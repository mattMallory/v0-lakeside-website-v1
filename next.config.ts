import { withPayload } from "@payloadcms/next/withPayload"
import type { NextConfig } from "next"
import path from "path"
import { fileURLToPath } from "url"

import { getPostgresUrl } from "./lib/db-url"

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "payload",
    "@payloadcms/db-vercel-postgres",
    "@payloadcms/db-sqlite",
    "@libsql/client",
    "libsql",
  ],
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    localPatterns: [
      {
        pathname: "/api/media/file/**",
      },
    ],
  },
  webpack: (webpackConfig, { webpack }) => {
    if (getPostgresUrl()) {
      webpackConfig.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: /payload\.config\.sqlite(\.ts)?$/,
        }),
      )
    }

    webpackConfig.resolve.extensionAlias = {
      ".cjs": [".cts", ".cjs"],
      ".js": [".ts", ".tsx", ".js", ".jsx"],
      ".mjs": [".mts", ".mjs"],
    }

    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
