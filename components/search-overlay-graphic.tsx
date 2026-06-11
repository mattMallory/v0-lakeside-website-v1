"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"

type SearchOverlayGraphicProps = {
  /** Base photo that sits behind the overlay */
  baseImage: string
  baseAlt: string
  /** Overlay graphic that slides up and fades in */
  overlayImage: string
  overlayAlt: string
  /** Intrinsic size of the overlay image (for aspect ratio) */
  overlayWidth?: number
  overlayHeight?: number
  /** Tailwind width class for the overlay (defaults to ~60%) */
  overlayWidthClass?: string
  /** Tailwind positioning classes for the overlay placement */
  overlayPositionClass?: string
}

export function SearchOverlayGraphic({
  baseImage,
  baseAlt,
  overlayImage,
  overlayAlt,
  overlayWidth = 627,
  overlayHeight = 257,
  overlayWidthClass = "w-[60%]",
  overlayPositionClass = "left-3 top-45 sm:left-4",
}: SearchOverlayGraphicProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className="relative w-full">
      {/* Base image */}
      <div className="relative aspect-[16/11] w-full overflow-hidden rounded-2xl bg-muted">
        <Image
          src={baseImage || "/placeholder.svg"}
          alt={baseAlt}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 33vw, 100vw"
        />
      </div>

      {/* Sliding / fading overlay graphic */}
      <div
        className={`absolute ${overlayPositionClass} ${overlayWidthClass} transition-all duration-700 ease-out ${
          visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
      >
        <div className="overflow-hidden rounded-lg shadow-[0_20px_50px_-12px_rgba(0,0,0,0.35)] ring-1 ring-black/5">
          <Image
            src={overlayImage || "/placeholder.svg"}
            alt={overlayAlt}
            width={overlayWidth}
            height={overlayHeight}
            className="h-auto w-full"
          />
        </div>
      </div>
    </div>
  )
}
