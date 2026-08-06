import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical"
import type { JSXConvertersFunction } from "@payloadcms/richtext-lexical/react"
import { RichText } from "@payloadcms/richtext-lexical/react"

import { BlogArticleCta } from "@/components/blog-article-cta"
import { BlogAuthorBio } from "@/components/blog-author-bio"
import { BlogBulletList } from "@/components/blog-bullet-list"
import { BlogCallout } from "@/components/blog-callout"
import { BlogCardGrid } from "@/components/blog-card-grid"
import { BlogReferences } from "@/components/blog-references"
import { BlogTagPills } from "@/components/blog-tag-pills"
import { ChiropracticOfferBuilder } from "@/components/chiropractic-offer-builder"
import { GoogleAdsBudgetPlanner } from "@/components/google-ads-budget-planner"
import { PatientJourneyInteractive } from "@/components/patient-journey-interactive"
import type { PatientJourneyProps } from "@/lib/patient-journey-types"

export const blogRichTextConverters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  blocks: {
    patientJourney: ({ node }: { node: { fields: PatientJourneyProps } }) => (
      <div className="blog-rich-text-breakout not-prose">
        <PatientJourneyInteractive {...node.fields} />
      </div>
    ),
    budgetPlanner: () => (
      <div className="blog-rich-text-breakout blog-budget-planner-breakout not-prose">
        <GoogleAdsBudgetPlanner embedded />
      </div>
    ),
    offerBuilder: () => (
      <div className="blog-rich-text-breakout blog-offer-builder-breakout not-prose">
        <ChiropracticOfferBuilder embedded />
      </div>
    ),
    blogCallout: ({ node }: { node: { fields: { text: string } } }) => (
      <div className="not-prose">
        <BlogCallout text={node.fields.text} />
      </div>
    ),
    blogCardGrid: ({
      node,
    }: {
      node: { fields: { cards?: Array<{ title: string; description: string }> | null } }
    }) => (
      <div className="not-prose">
        <BlogCardGrid cards={node.fields.cards} />
      </div>
    ),
    blogTagPills: ({
      node,
    }: {
      node: { fields: { pills?: Array<{ label: string }> | null } }
    }) => (
      <div className="not-prose">
        <BlogTagPills pills={node.fields.pills} />
      </div>
    ),
    blogBulletList: ({
      node,
    }: {
      node: { fields: { items?: Array<{ text: string }> | null } }
    }) => (
      <div className="not-prose">
        <BlogBulletList items={node.fields.items} />
      </div>
    ),
    blogReferences: ({
      node,
    }: {
      node: {
        fields: {
          label?: string | null
          items?: Array<{ text: string; url?: string | null; linkLabel?: string | null }> | null
        }
      }
    }) => (
      <div className="not-prose">
        <BlogReferences label={node.fields.label} items={node.fields.items} />
      </div>
    ),
    blogAuthorBio: ({
      node,
    }: {
      node: {
        fields: {
          photo?: number | { url?: string | null; alt?: string | null } | null
          name: string
          role?: string | null
          bio: string
          linkedinUrl?: string | null
        }
      }
    }) => (
      <div className="not-prose">
        <BlogAuthorBio {...node.fields} />
      </div>
    ),
    blogArticleCta: ({
      node,
    }: {
      node: {
        fields: {
          eyebrow?: string | null
          title: string
          description?: string | null
          ctaLabel?: string | null
          ctaUrl?: string | null
        }
      }
    }) => (
      <div className="blog-rich-text-breakout not-prose">
        <BlogArticleCta {...node.fields} />
      </div>
    ),
  },
})

type BlogRichTextProps = {
  content: Record<string, unknown>
}

export function BlogRichText({ content }: BlogRichTextProps) {
  return (
    <div className="prose-blog">
      <RichText
        converters={blogRichTextConverters}
        data={content as SerializedEditorState}
      />
    </div>
  )
}
