import { cn } from "@/lib/utils"

type SectionEyebrowProps = {
  children: React.ReactNode
  variant?: "light" | "dark"
  className?: string
}

export function SectionEyebrow({
  children,
  variant = "light",
  className,
}: SectionEyebrowProps) {
  return (
    <div
      className={cn(
        "mb-4 inline-flex items-center gap-2 font-brand-display text-[11px] font-semibold uppercase tracking-[0.14em]",
        variant === "dark" ? "text-accent-on-dark" : "text-primary",
        className,
      )}
    >
      <span
        className={cn(
          "h-0.5 w-5 rounded",
          variant === "dark" ? "bg-accent-on-dark" : "bg-primary",
        )}
      />
      {children}
    </div>
  )
}
