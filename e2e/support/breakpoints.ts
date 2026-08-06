/**
 * The canonical breakpoint vocabulary for this site.
 *
 * This file is the machine-readable half of docs/breakpoints.md — that document
 * carries the justification, this one is what the tests import. Keep them in step.
 *
 * There is exactly one vocabulary: the Tailwind v4 defaults. No `--breakpoint-*`
 * token is defined in app/globals.css, so these are the values Tailwind ships.
 * Hand-written media queries and matchMedia strings must use the `MIN`/`MAX`
 * values below and nothing else.
 */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const

export type BreakpointName = keyof typeof BREAKPOINTS

/** `min-width` for a named breakpoint — matches Tailwind's `md:` etc. */
export const MIN = (name: BreakpointName) => BREAKPOINTS[name]

/** `max-width` for "below" a named breakpoint — always MIN - 1. */
export const MAX = (name: BreakpointName) => BREAKPOINTS[name] - 1

/**
 * Widths every route is tested at.
 *
 * The six boundary values are the exact pixels where the four historical
 * vocabularies disagreed. 767/768 straddle Tailwind `md`; 820/821 straddle the
 * hand-written query that produced the offer-builder dead zone; 1023/1024
 * straddle Tailwind `lg`.
 *
 * 820 and 821 are retained as test widths even though no rule keys on them any
 * more — they are precisely where the defect lived, so they are where a
 * regression would reappear.
 */
export const BOUNDARY_WIDTHS = [767, 768, 820, 821, 1023, 1024] as const

/** Real devices, so the matrix reflects hardware and not only arithmetic. */
export const DEVICE_WIDTHS = [
  { width: 320, label: "iPhone SE (smallest supported)" },
  { width: 375, label: "iPhone 12/13 mini" },
  { width: 390, label: "iPhone 14/15" },
  { width: 430, label: "iPhone 15 Pro Max" },
  { width: 768, label: "iPad Mini portrait" },
  { width: 810, label: "iPad 10.2 portrait" },
  { width: 834, label: "iPad Air portrait" },
  { width: 1024, label: "iPad Pro landscape" },
  { width: 1280, label: "laptop" },
  { width: 1440, label: "desktop" },
] as const

export type Viewport = { width: number; height: number; label: string }

const DEFAULT_HEIGHT = 900

/**
 * The full matrix: boundary widths plus device widths, de-duplicated and sorted.
 * Boundary labels win over device labels where the two coincide (e.g. 768).
 */
export const VIEWPORT_MATRIX: Viewport[] = (() => {
  const byWidth = new Map<number, string>()

  for (const { width, label } of DEVICE_WIDTHS) {
    byWidth.set(width, label)
  }
  for (const width of BOUNDARY_WIDTHS) {
    const existing = byWidth.get(width)
    byWidth.set(width, existing ? `boundary — ${existing}` : "boundary")
  }

  return [...byWidth.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([width, label]) => ({ width, height: DEFAULT_HEIGHT, label: `${width}px (${label})` }))
})()
