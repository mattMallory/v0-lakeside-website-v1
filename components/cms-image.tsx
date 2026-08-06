import Image, { type ImageProps } from "next/image"

import { resolveImagePosition } from "@/lib/image-position"
import { cn } from "@/lib/utils"

type CmsImageProps = Omit<ImageProps, "style"> & {
  position?: string | null
  style?: ImageProps["style"]
}

export function CmsImage({ position, className, style, ...props }: CmsImageProps) {
  return (
    <Image
      {...props}
      className={cn("object-cover", className)}
      style={{ objectPosition: resolveImagePosition(position), ...style }}
    />
  )
}
