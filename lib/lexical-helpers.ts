import { defaultPatientJourneyBlock } from "@/lib/patient-journey-defaults"
import type { PatientJourneyProps } from "@/lib/patient-journey-types"
import type { Post } from "@/payload-types"

type LexicalTextNode = {
  type: "text"
  format: number
  mode: "normal"
  style: string
  text: string
  version: 1
}

type LexicalParagraphNode = {
  type: "paragraph"
  format: string
  indent: number
  version: 1
  direction: "ltr"
  children: LexicalTextNode[]
}

type LexicalHeadingNode = {
  type: "heading"
  tag: "h2" | "h3"
  format: string
  indent: number
  version: 1
  direction: "ltr"
  children: LexicalTextNode[]
}

type LexicalBlockNodeFields = {
  id: string
  blockName: string
  blockType: string
  [key: string]: unknown
}

type LexicalBlockNode = {
  type: "block"
  format: string
  version: 2
  fields: LexicalBlockNodeFields
}

type LexicalNode = LexicalParagraphNode | LexicalHeadingNode | LexicalBlockNode

export type LexicalContentItem =
  | { type: "p" | "h2" | "h3"; text: string }
  | { type: "callout"; text: string }
  | { type: "cardGrid"; cards: Array<{ title: string; description: string }> }
  | { type: "tagPills"; pills: string[] }
  | { type: "bulletList"; items: string[] }
  | {
      type: "references"
      label?: string
      items: Array<{ text: string; url?: string; linkLabel?: string }>
    }
  | {
      type: "authorBio"
      name: string
      role?: string
      bio: string
      linkedinUrl?: string
    }
  | {
      type: "articleCta"
      eyebrow?: string
      title: string
      description?: string
      ctaLabel?: string
      ctaUrl?: string
    }
  | { type: "patientJourney"; fields?: PatientJourneyProps }
  | { type: "budgetPlanner" }
  | { type: "offerBuilder" }

function createBudgetPlannerBlockNode(): LexicalBlockNode {
  return createBlockNode("budgetPlanner", {})
}

function createOfferBuilderBlockNode(): LexicalBlockNode {
  return createBlockNode("offerBuilder", {})
}

function createTextNode(text: string): LexicalTextNode {
  return {
    type: "text",
    format: 0,
    mode: "normal",
    style: "",
    text,
    version: 1,
  }
}

function createTextBlock(item: Extract<LexicalContentItem, { type: "p" | "h2" | "h3" }>) {
  const textNode = createTextNode(item.text)

  if (item.type === "p") {
    return {
      type: "paragraph" as const,
      format: "",
      indent: 0,
      version: 1 as const,
      direction: "ltr" as const,
      children: [textNode],
    }
  }

  return {
    type: "heading" as const,
    tag: item.type,
    format: "",
    indent: 0,
    version: 1 as const,
    direction: "ltr" as const,
    children: [textNode],
  }
}

function createBlockNode(blockType: string, fields: Record<string, unknown>): LexicalBlockNode {
  return {
    type: "block",
    format: "",
    version: 2,
    fields: {
      id: crypto.randomUUID(),
      blockName: "",
      blockType,
      ...fields,
    },
  }
}

export function createPatientJourneyBlockNode(
  fields: PatientJourneyProps = defaultPatientJourneyBlock,
): LexicalBlockNode {
  return createBlockNode("patientJourney", fields)
}

export function createBlogCalloutBlockNode(text: string): LexicalBlockNode {
  return createBlockNode("blogCallout", { text })
}

export function createBlogCardGridBlockNode(
  cards: Array<{ title: string; description: string }>,
): LexicalBlockNode {
  return createBlockNode("blogCardGrid", { cards })
}

export function createBlogTagPillsBlockNode(pills: string[]): LexicalBlockNode {
  return createBlockNode("blogTagPills", {
    pills: pills.map((label) => ({ label })),
  })
}

export function createBlogBulletListBlockNode(items: string[]): LexicalBlockNode {
  return createBlockNode("blogBulletList", {
    items: items.map((text) => ({ text })),
  })
}

export function createBlogReferencesBlockNode({
  label = "References",
  items,
}: {
  label?: string
  items: Array<{ text: string; url?: string; linkLabel?: string }>
}): LexicalBlockNode {
  return createBlockNode("blogReferences", { label, items })
}

export function createBlogAuthorBioBlockNode(fields: {
  name: string
  role?: string
  bio: string
  linkedinUrl?: string
}): LexicalBlockNode {
  return createBlockNode("blogAuthorBio", fields)
}

export function createBlogArticleCtaBlockNode(fields: {
  eyebrow?: string
  title: string
  description?: string
  ctaLabel?: string
  ctaUrl?: string
}): LexicalBlockNode {
  return createBlockNode("blogArticleCta", fields)
}

function mapContentItem(item: LexicalContentItem): LexicalNode {
  if (item.type === "callout") {
    return createBlogCalloutBlockNode(item.text)
  }

  if (item.type === "cardGrid") {
    return createBlogCardGridBlockNode(item.cards)
  }

  if (item.type === "tagPills") {
    return createBlogTagPillsBlockNode(item.pills)
  }

  if (item.type === "bulletList") {
    return createBlogBulletListBlockNode(item.items)
  }

  if (item.type === "references") {
    return createBlogReferencesBlockNode({
      label: item.label,
      items: item.items,
    })
  }

  if (item.type === "authorBio") {
    return createBlogAuthorBioBlockNode(item)
  }

  if (item.type === "articleCta") {
    return createBlogArticleCtaBlockNode(item)
  }

  if (item.type === "patientJourney") {
    return createPatientJourneyBlockNode(item.fields)
  }

  if (item.type === "budgetPlanner") {
    return createBudgetPlannerBlockNode()
  }

  if (item.type === "offerBuilder") {
    return createOfferBuilderBlockNode()
  }

  return createTextBlock(item)
}

// Annotated with the generated Post["content"] type so the root node's `format` and
// `direction` are checked against the alignment unions the schema actually permits,
// rather than being widened to `string` and only failing when a seed writes them.
export function createLexicalArticleContent(items: LexicalContentItem[]): Post["content"] {
  return {
    root: {
      type: "root",
      format: "",
      indent: 0,
      version: 1,
      direction: "ltr",
      children: items.map(mapContentItem),
    },
  }
}

export function createLexicalContent(blocks: Array<{ type: "p" | "h2" | "h3"; text: string }>) {
  return createLexicalArticleContent(blocks)
}

