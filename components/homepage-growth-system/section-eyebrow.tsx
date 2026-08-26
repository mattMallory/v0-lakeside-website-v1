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
 *
 * It renders as a plain block. It used to be `inline-flex items-center`, which
 * existed solely to sit the dash beside the text — dead layout code once the
 * dash went. Keeping it was not free: an inline-level box does not occupy the
 * same space as a block one, so hand-written `<p>` eyebrows could not be folded
 * into this component without shifting the page. Now they can.
 */
export function SectionEyebrow({
  children,
  variant = "light",
  className,
}: SectionEyebrowProps) {
  return (
    <div
      className={cn(
        "mb-4 font-brand-display text-eyebrow font-bold uppercase tracking-eyebrow",
        variant === "dark" ? "text-accent-on-dark" : "text-primary",
        className,
      )}
    >
      {children}
    </div>
  )
}
