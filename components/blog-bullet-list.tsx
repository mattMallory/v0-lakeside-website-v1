type BlogBulletListProps = {
  items?: Array<{ text: string }> | null
}

export function BlogBulletList({ items }: BlogBulletListProps) {
  if (!items || items.length === 0) {
    return null
  }

  return (
    <ul className="my-6 flex list-disc flex-col gap-2 pl-[22px] text-lg leading-relaxed text-[#374151]">
      {items.map((item, index) => (
        <li key={`${item.text}-${index}`}>{item.text}</li>
      ))}
    </ul>
  )
}
