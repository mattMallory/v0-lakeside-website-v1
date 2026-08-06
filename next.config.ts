import { withPayload } from "@payloadcms/next/withPayload"
import type { NextConfig } from "next"
import path from "path"
import { fileURLToPath } from "url"

import { shouldUsePostgresConfig } from "./lib/db-url"

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

// Pages named `*.e2e.tsx` are viewport-test fixtures. They only become routes when
// E2E_FIXTURES=1, so they are absent from a production build rather than merely
// unreachable. See e2e/README.md.
const pageExtensions = ["tsx", "ts", "jsx", "js"]
if (process.env.E2E_FIXTURES === "1") {
  pageExtensions.push("e2e.tsx")
}

const nextConfig: NextConfig = {
  pageExtensions,
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
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "madebylakeside.com",
      },
    ],
  },
  webpack: (webpackConfig, { webpack }) => {
    if (shouldUsePostgresConfig()) {
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
