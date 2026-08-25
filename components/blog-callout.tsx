type BlogCalloutProps = {
  text: string
}

export function BlogCallout({ text }: BlogCalloutProps) {
  return (
    <div className="my-6 rounded-r-lg border-l-[3px] border-primary bg-lake-pale px-6 py-[18px]">
      <p className="text-[19px] font-medium leading-body tracking-[-0.01em] text-heading">
        {text}
      </p>
    </div>
  )
}
