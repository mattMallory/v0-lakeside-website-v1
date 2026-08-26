type BlogReferenceItem = {
  text: string
  url?: string | null
  linkLabel?: string | null
}

type BlogReferencesProps = {
  label?: string | null
  items?: BlogReferenceItem[] | null
}

function renderCitation(item: BlogReferenceItem) {
  if (item.url && item.linkLabel) {
    const parts = item.text.split(item.linkLabel)
    if (parts.length > 1) {
      return (
        <>
          {parts[0]}
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline underline-offset-2"
          >
            {item.linkLabel}
          </a>
          {parts.slice(1).join(item.linkLabel)}
        </>
      )
    }

    return (
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary underline underline-offset-2"
      >
        {item.text}
      </a>
    )
  }

  return item.text
}

export function BlogReferences({ label = "References", items }: BlogReferencesProps) {
  if (!items || items.length === 0) {
    return null
  }

  return (
    <div className="my-10 rounded-card border border-border bg-white px-6 py-[22px]">
      {label ? (
        <p className="font-brand-display mb-3.5 text-xs font-bold uppercase tracking-eyebrow text-muted-foreground-subtle">
          {label}
        </p>
      ) : null}
      <ul className="flex list-none flex-col gap-2.5 text-body leading-body text-muted-foreground">
        {items.map((item, index) => (
          <li key={`${item.text}-${index}`}>{renderCitation(item)}</li>
        ))}
      </ul>
    </div>
  )
}
