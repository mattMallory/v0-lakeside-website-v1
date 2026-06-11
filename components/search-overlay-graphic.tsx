"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"

const places = [
  {
    name: "Van Ness Practic",
    rating: "5.0",
    reviews: "(493)",
    type: "Chiropractor",
    distance: "7.6 mi · 215 South Northwest Highway · (847) 221-8...",
    note: "Calm and Relaxing - Complimentary Consultation. Dr. Van Ness Helps Barrington a...",
    hours: "Open · Closes 6 PM",
  },
  {
    name: "Nature's Balance Acupuncture & Wellness...",
    rating: "4.8",
    reviews: "(72)",
    type: "Acupuncturist",
    distance: "3.6 mi · Crystal Lake, IL · (815) 788-8383",
    note: "",
    hours: "Open · Closes 7 PM",
  },
]

function Stars() {
  return (
    <span className="inline-flex items-center gap-px align-middle" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} viewBox="0 0 24 24" className="h-3 w-3 fill-[#fbbc04]">
          <path d="M12 2l2.9 6.3 6.9.6-5.2 4.5 1.6 6.7L12 17.3 5.8 20.6l1.6-6.7L2.2 8.9l6.9-.6z" />
        </svg>
      ))}
    </span>
  )
}

function SearchCard() {
  return (
    <div className="w-[340px] max-w-[88%] overflow-hidden rounded-xl bg-white shadow-[0_20px_50px_-12px_rgba(0,0,0,0.35)] ring-1 ring-black/5 sm:w-[360px]">
      {/* Search bar */}
      <div className="flex items-center gap-3 border-b border-black/5 px-4 py-3">
        <span className="text-[15px] font-medium tracking-tight">
          <span className="text-[#4285f4]">G</span>
          <span className="text-[#ea4335]">o</span>
          <span className="text-[#fbbc04]">o</span>
          <span className="text-[#4285f4]">g</span>
          <span className="text-[#34a853]">l</span>
          <span className="text-[#ea4335]">e</span>
        </span>
        <div className="flex flex-1 items-center justify-between rounded-full border border-black/10 px-3 py-1.5">
          <span className="text-xs text-neutral-700">acupuncture near me</span>
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-none stroke-neutral-400" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* Places */}
      <div className="px-4 py-3">
        <p className="text-sm font-semibold text-neutral-800">Places</p>
        <p className="mb-2 text-[10px] uppercase tracking-wide text-neutral-400">Sponsored</p>

        <div className="flex flex-col gap-3">
          {places.map((p, idx) => (
            <div key={p.name} className={idx > 0 ? "border-t border-black/5 pt-3" : ""}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12px] font-medium text-neutral-800">{p.name}</p>
                  <div className="mt-0.5 flex items-center gap-1 text-[10px] text-neutral-500">
                    <span className="font-medium text-neutral-700">{p.rating}</span>
                    <Stars />
                    <span>{p.reviews}</span>
                    <span>· {p.type}</span>
                  </div>
                  <p className="mt-0.5 truncate text-[10px] text-neutral-500">{p.distance}</p>
                  {p.note ? <p className="mt-0.5 line-clamp-2 text-[10px] text-neutral-400">{p.note}</p> : null}
                  <p className="mt-0.5 text-[10px] font-medium text-[#34a853]">{p.hours}</p>
                </div>

                {/* Action buttons */}
                <div className="flex shrink-0 gap-2">
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full border border-[#4285f4]/40">
                      <svg viewBox="0 0 24 24" className="h-3 w-3 fill-none stroke-[#4285f4]" strokeWidth="2">
                        <circle cx="12" cy="12" r="9" />
                        <path d="M3 12h18M12 3a15 15 0 010 18M12 3a15 15 0 000 18" />
                      </svg>
                    </span>
                    <span className="text-[8px] text-[#4285f4]">Website</span>
                  </div>
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full border border-[#4285f4]/40">
                      <svg viewBox="0 0 24 24" className="h-3 w-3 fill-[#4285f4]">
                        <path d="M21.7 11.3l-9-9a1 1 0 00-1.4 0l-9 9a1 1 0 000 1.4l9 9a1 1 0 001.4 0l9-9a1 1 0 000-1.4zM13 14v-2.5h-2V14H9l3 3 3-3z" />
                      </svg>
                    </span>
                    <span className="text-[8px] text-[#4285f4]">Directions</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

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
          src="/why/woman-phone-search.png"
          alt="Wellness patient searching for local clinics on her phone"
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 33vw, 100vw"
        />
      </div>

      {/* Sliding / fading overlay */}
      <div
        className={`absolute left-2 top-6 transition-all duration-700 ease-out sm:left-4 ${
          visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
      >
        <SearchCard />
      </div>
    </div>
  )
}
