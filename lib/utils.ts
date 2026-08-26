import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

/**
 * tailwind-merge has to be told about the design system's own token names.
 *
 * It resolves conflicts using a built-in map of Tailwind's default scale. A
 * class it does not recognise gets classified by prefix alone, and `text-*` is
 * ambiguous — it is both the font-size and the text-colour namespace. So
 * `text-caption` was read as a *colour*, and any colour later in the same
 * `cn()` call replaced it. The size silently disappeared and the element
 * inherited its parent's.
 *
 * That is not theoretical: it was measured on the offer builder's clarity
 * rows, where a 13px label rendered at 16px because `text-caption` was dropped
 * against `text-muted-foreground-subtle`. Nothing failed — the element just
 * quietly got bigger.
 *
 * Declaring the tokens here restores the intended behaviour: a size conflicts
 * with a size, a colour with a colour. The other groups are listed for the
 * same reason, before they can bite.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        {
          text: [
            'micro',
            'caption',
            'eyebrow',
            'body',
            'body-lg',
            'lead',
            'title-sm',
            'title',
            'display',
            'display-lg',
            'display-md',
          ],
        },
      ],
      tracking: [{ tracking: ['display', 'eyebrow'] }],
      leading: [{ leading: ['display', 'body'] }],
      rounded: [{ rounded: ['sq', 'card', 'pill'] }],
      'shadow-color': [],
      shadow: [{ shadow: ['raised'] }],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
