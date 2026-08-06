import type { Metadata } from "next"

import { LegalPageContent } from "@/components/legal-page-content"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { getPrivacyPageContent } from "@/lib/legal"

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPrivacyPageContent()

  return {
    title: content.seoTitle,
    description: content.seoDescription,
    openGraph: {
      title: content.seoTitle,
      description: content.seoDescription,
    },
  }
}

export default async function PrivacyPage() {
  const content = await getPrivacyPageContent()

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <LegalPageContent content={content} />
      <SiteFooter />
    </div>
  )
}
