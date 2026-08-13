/**
 * Reports which blob-storage backend the app will use, mirroring the selection
 * logic in lib/get-payload-blob-plugins.ts:
 *
 *   1. BLOB_READ_WRITE_TOKEN set -> @payloadcms/storage-vercel-blob, client uploads
 *   2. otherwise BLOB_STORE_ID set -> OIDC-authenticated Vercel Blob (lib/payload-blob-plugin.ts)
 *   3. neither -> no storage backend; uploads have nowhere to go
 *
 * Reports variable names and presence only. Never returns or logs a value.
 */
export function getBlobStorageState(env = process.env) {
  if (env.BLOB_READ_WRITE_TOKEN?.trim()) {
    return {
      backend: "vercel-blob (client uploads)",
      via: "BLOB_READ_WRITE_TOKEN",
      configured: true,
    }
  }

  if (env.BLOB_STORE_ID?.trim()) {
    return {
      backend: "vercel-blob (OIDC)",
      via: "BLOB_STORE_ID",
      configured: true,
    }
  }

  return {
    backend: "none — media uploads will fail",
    via: "set BLOB_READ_WRITE_TOKEN or BLOB_STORE_ID",
    configured: false,
  }
}

export function formatBlobStorageState(env = process.env) {
  const { backend, via } = getBlobStorageState(env)
  return `${backend} [${via}]`
}
