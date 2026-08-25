import { cn } from "@/lib/utils"

type SectionEyebrowProps = {
  children: React.ReactNode
  variant?: "light" | "dark"
  className?: string
}

/**
 * The section eyebrow — the small uppercase label above a heading.
 *
 * One specification, approved 2026-08-13: **14px, semibold, 0.1em, no leading
 * dash**. This component used to be 11px *with* a dash, which made it the odd
 * one out: the same eyebrow rendered at two different sizes depending on
 * whether a given section used the component or hand-written markup. In one
 * file the two sat two lines apart inside the same expression and disagreed.
 *
 * The dash is gone because the approved eyebrow does not have one, not because
 * it was hard to keep.
 */
export function SectionEyebrow({
  children,
  variant = "light",
  className,
}: SectionEyebrowProps) {
  return (
    <div
      className={cn(
        "mb-4 inline-flex items-center font-brand-display text-eyebrow font-semibold uppercase tracking-eyebrow",
        variant === "dark" ? "text-accent-on-dark" : "text-primary",
        className,
      )}
    >
      {children}
    </div>
  )
}
