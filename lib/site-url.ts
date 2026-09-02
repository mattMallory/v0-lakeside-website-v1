/**
 * Canonical public site origin for SEO (sitemap, robots, absolute URLs).
 */
export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SERVER_URL) {
    return process.env.NEXT_PUBLIC_SERVER_URL.replace(/\/$/, "")
  }

  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }

  return "https://www.madebylakeside.com"
}
