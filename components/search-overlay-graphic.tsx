"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"

export function SearchOverlayGraphic() {
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
          src="/why/woman-full-photo.jpg"
          alt="Wellness patient searching for local clinics on her phone"
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 33vw, 100vw"
        />
      </div>

      {/* Sliding / fading overlay graphic (~60% of the space) */}
      <div
        className={`absolute left-3 top-45 w-[60%] transition-all duration-700 ease-out sm:left-4 ${
          visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
      >
        <div className="overflow-hidden rounded-lg shadow-[0_20px_50px_-12px_rgba(0,0,0,0.35)] ring-1 ring-black/5">
          <Image
            src="/why/places-overlay.png"
            alt="Google search results showing local wellness clinics with ratings and directions"
            width={627}
            height={257}
            className="h-auto w-full"
          />
        </div>
      </div>
    </div>
  )
}
