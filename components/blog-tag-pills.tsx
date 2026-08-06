type BlogTagPillsProps = {
  pills?: Array<{ label: string }> | null
}

export function BlogTagPills({ pills }: BlogTagPillsProps) {
  if (!pills || pills.length === 0) {
    return null
  }

  return (
    <div className="my-6 flex flex-wrap gap-2">
      {pills.map((pill, index) => (
        <span
          key={`${pill.label}-${index}`}
          className="rounded-full border border-[#DBEAFE] bg-[#EFF6FF] px-3.5 py-1.5 text-sm font-semibold text-primary"
        >
          {pill.label}
        </span>
      ))}
    </div>
  )
}
