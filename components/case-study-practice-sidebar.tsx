import type { CaseStudyPost } from "@/lib/blog-types"

type CaseStudyPracticeSidebarProps = {
  post: CaseStudyPost
}

type SidebarItem = {
  label: string
  value: string
}

function buildSidebarItems(post: CaseStudyPost): SidebarItem[] {
  const items: SidebarItem[] = []

  if (post.clientName?.trim()) {
    items.push({ label: "Practice", value: post.clientName.trim() })
  }

  if (post.clientLocation?.trim()) {
    items.push({ label: "Location", value: post.clientLocation.trim() })
  }

  if (post.practiceInfo.practiceType?.trim()) {
    items.push({ label: "Practice Type", value: post.practiceInfo.practiceType.trim() })
  }

  if (post.practiceInfo.services?.trim()) {
    items.push({ label: "Services", value: post.practiceInfo.services.trim() })
  }

  if (post.practiceInfo.engagementFocus?.trim()) {
    items.push({ label: "Engagement", value: post.practiceInfo.engagementFocus.trim() })
  }

  if (post.practiceInfo.marketReach?.trim()) {
    items.push({ label: "Market Reach", value: post.practiceInfo.marketReach.trim() })
  }

  if (post.category?.name) {
    items.push({ label: "Category", value: post.category.name })
  }

  return items
}

export function CaseStudyPracticeSidebar({ post }: CaseStudyPracticeSidebarProps) {
  const items = buildSidebarItems(post)

  return (
    <aside className="rounded-card border border-border bg-white p-5">
      <dl className="space-y-4">
        {items.map((item) => (
          <div key={item.label}>
            <dt className="font-brand-display text-xs font-bold uppercase tracking-eyebrow text-heading">
              {item.label}
            </dt>
            <dd className="mt-1 text-body font-normal leading-relaxed text-muted-foreground">{item.value}</dd>
          </div>
        ))}
      </dl>
    </aside>
  )
}
