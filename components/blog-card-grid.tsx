type BlogCardGridItem = {
  title: string
  description: string
}

type BlogCardGridProps = {
  cards?: BlogCardGridItem[] | null
}

export function BlogCardGrid({ cards }: BlogCardGridProps) {
  if (!cards || cards.length === 0) {
    return null
  }

  return (
    <div className="my-6 grid gap-3.5 sm:grid-cols-2">
      {cards.map((card, index) => (
        <div
          key={`${card.title}-${index}`}
          className="rounded-xl border border-border bg-white p-[22px]"
        >
          <div className="mb-1.5 text-[15px] font-bold text-heading">{card.title}</div>
          <div className="text-sm leading-[1.55] text-muted-foreground">{card.description}</div>
        </div>
      ))}
    </div>
  )
}
