import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob"
import type { Plugin } from "payload"

import { oidcVercelBlobStorage } from "./payload-blob-plugin"

export function getPayloadBlobPlugins(): Plugin[] {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    return [
      vercelBlobStorage({
        collections: {
          media: true,
        },
        clientUploads: true,
        token: process.env.BLOB_READ_WRITE_TOKEN,
      }),
    ]
  }

  const oidcPlugin = oidcVercelBlobStorage()

  if (oidcPlugin) {
    return [oidcPlugin]
  }

  return []
}
