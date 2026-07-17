import { Button as ButtonPrimitive } from '@base-ui/react/button'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-2 border border-transparent bg-clip-padding font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        // Primary — pill (Brand Guide)
        default:
          'rounded-full bg-button text-button-foreground shadow-[0_1px_2px_rgba(37,99,168,0.2)] hover:bg-button-hover hover:-translate-y-px hover:shadow-[0_4px_14px_rgba(37,99,168,0.28)] active:bg-button-active active:translate-y-0',
        // Secondary — square (Brand Guide)
        outline:
          'rounded-[10px] border-[1.5px] border-secondary-button bg-white text-secondary-button-foreground hover:border-gray-400 hover:text-heading',
        // Lake outline secondary
        secondary:
          'rounded-[10px] border-[1.5px] border-primary bg-white text-primary hover:bg-lake-pale',
        ghost:
          'rounded-[10px] hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground',
        destructive:
          'rounded-[10px] bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20',
        // Tertiary — underlined text link (Brand Guide v20)
        link:
          'h-auto min-h-0 rounded-none border-0 bg-transparent p-0 text-[15px] font-medium text-primary underline decoration-[1.5px] underline-offset-4 [text-decoration-color:rgba(37,99,168,0.4)] hover:bg-transparent hover:text-button-hover hover:[text-decoration-color:var(--button-hover)]',
      },
      size: {
        default: 'min-h-[46px] px-[26px] text-[15px]',
        xs: 'min-h-8 px-3 text-xs',
        sm: 'min-h-[42px] px-5 text-sm',
        lg: 'min-h-14 px-8 text-base',
        icon: 'size-10 rounded-[10px]',
        'icon-xs': 'size-6 rounded-[10px] [&_svg:not([class*=\'size-\'])]:size-3',
        'icon-sm': 'size-8 rounded-[10px]',
        'icon-lg': 'size-11 rounded-[10px]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant = 'default',
  size = 'default',
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
