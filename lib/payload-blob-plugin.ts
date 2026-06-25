import { cloudStoragePlugin } from "@payloadcms/plugin-cloud-storage"
import { getFileKey } from "@payloadcms/plugin-cloud-storage/utilities"
import { del, put } from "@vercel/blob"
import path from "path"
import type { Plugin } from "payload"

function normalizeStoreId(storeId: string) {
  return storeId.startsWith("store_") ? storeId.slice("store_".length) : storeId
}

function getBlobStoreId(): string | undefined {
  const raw = process.env.BLOB_STORE_ID

  if (!raw) {
    return undefined
  }

  return normalizeStoreId(raw)
}

function getPublicBlobBaseUrl(storeId: string) {
  return `https://${storeId}.public.blob.vercel-storage.com`
}

function getBlobPutOptions(mimeType: string) {
  return {
    access: "public" as const,
    contentType: mimeType,
    storeId: process.env.BLOB_STORE_ID,
  }
}

function buildBlobUrl({
  baseUrl,
  collectionPrefix = "",
  filename,
  prefix = "",
}: {
  baseUrl: string
  collectionPrefix?: string
  filename: string
  prefix?: string
}) {
  const { fileKey: fileKeyWithPrefix } = getFileKey({
    collectionPrefix,
    docPrefix: prefix,
    filename,
  })

  const dir = path.posix.dirname(fileKeyWithPrefix)
  const encodedFilename = encodeURIComponent(path.posix.basename(fileKeyWithPrefix))
  const fileKeyWithEncodedFilename =
    dir === "." ? encodedFilename : path.posix.join(dir, encodedFilename)

  return `${baseUrl}/${fileKeyWithEncodedFilename}`
}

function createOidcBlobAdapter(baseUrl: string) {
  return ({ prefix = "" }: { prefix?: string }) => ({
    name: "vercel-blob-oidc",
    generateURL: ({
      filename,
      prefix: urlPrefix = "",
    }: {
      filename: string
      prefix?: string
    }) =>
      buildBlobUrl({
        baseUrl,
        collectionPrefix: prefix,
        filename,
        prefix: urlPrefix,
      }),
    handleDelete: async ({
      doc: { prefix: docPrefix = "" },
      filename,
    }: {
      doc: { prefix?: string }
      filename: string
    }) => {
      await del(
        buildBlobUrl({
          baseUrl,
          collectionPrefix: prefix,
          filename,
          prefix: docPrefix,
        }),
        {
          storeId: process.env.BLOB_STORE_ID,
        },
      )
    },
    handleUpload: async ({
      data,
      file: { buffer, filename, mimeType },
    }: {
      data: { prefix?: string; filename?: string }
      file: { buffer: Buffer; filename: string; mimeType: string }
    }) => {
      const { fileKey } = getFileKey({
        collectionPrefix: prefix,
        docPrefix: data.prefix,
        filename,
      })

      const result = await put(fileKey, buffer, getBlobPutOptions(mimeType))

      if (result.pathname) {
        const pathname = result.pathname.replace(/^\/+/, "")
        const basename = path.posix.basename(pathname)
        data.filename = decodeURIComponent(basename)
      }

      return data
    },
    staticHandler: () => new Response(null, { status: 404 }),
  })
}

export function oidcVercelBlobStorage(): Plugin | null {
  const storeId = getBlobStoreId()

  if (!storeId) {
    return null
  }

  const baseUrl = getPublicBlobBaseUrl(storeId)
  const adapter = createOidcBlobAdapter(baseUrl)

  return (incomingConfig) => {
    const config = {
      ...incomingConfig,
      collections: (incomingConfig.collections || []).map((collection) => {
        if (collection.slug !== "media") {
          return collection
        }

        return {
          ...collection,
          upload: {
            ...(typeof collection.upload === "object" ? collection.upload : {}),
            disableLocalStorage: true,
          },
        }
      }),
    }

    return cloudStoragePlugin({
      collections: {
        media: {
          adapter,
          disablePayloadAccessControl: true,
        },
      },
    })(config)
  }
}
