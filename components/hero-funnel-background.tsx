import type { CSSProperties } from "react"

import { HERO_DASH_COLOR, HERO_DASH_CYCLE, HERO_DASH_MARCH_MS, HERO_DASH_PATTERN } from "@/lib/hero-dash-pattern"
import { cn } from "@/lib/utils"

const funnelBalls = [
  { size: "h-3 w-3", startLeft: 8, duration: 14, delay: 0 },
  { size: "h-2.5 w-2.5", startLeft: 18, duration: 16, delay: -3 },
  { size: "h-4 w-4", startLeft: 28, duration: 13, delay: -6 },
  { size: "h-2 w-2", startLeft: 38, duration: 15, delay: -2 },
  { size: "h-3.5 w-3.5", startLeft: 48, duration: 17, delay: -9 },
  { size: "h-2.5 w-2.5", startLeft: 58, duration: 12, delay: -5 },
  { size: "h-3 w-3", startLeft: 68, duration: 16, delay: -11 },
  { size: "h-2 w-2", startLeft: 78, duration: 14, delay: -7 },
  { size: "h-3 w-3", startLeft: 88, duration: 15, delay: -4 },
  { size: "h-2.5 w-2.5", startLeft: 14, duration: 18, delay: -13 },
  { size: "h-3 w-3", startLeft: 52, duration: 13, delay: -8 },
  { size: "h-2 w-2", startLeft: 92, duration: 17, delay: -10 },
  { size: "h-3 w-3", startLeft: 33, duration: 15, delay: -1 },
  { size: "h-2.5 w-2.5", startLeft: 63, duration: 14, delay: -12 },
  { size: "h-2 w-2", startLeft: 24, duration: 16, delay: -6 },
  { size: "h-3.5 w-3.5", startLeft: 43, duration: 12, delay: -14 },
  { size: "h-3 w-3", startLeft: 71, duration: 18, delay: -3 },
  { size: "h-2.5 w-2.5", startLeft: 84, duration: 13, delay: -9 },
] as const

const funnelRings = [
  { top: "4%", width: "70%", height: "2.5rem", floatDuration: 6.2, floatDelay: 0, floatScaleMin: 0.98, floatScaleMax: 1.035 },
  { top: "calc(4% + (96% - 1.8rem) * 0.1)", width: "64.5%", height: "2.38rem", floatDuration: 7.5, floatDelay: -1.8, floatScaleMin: 0.972, floatScaleMax: 1.028 },
  { top: "calc(4% + (96% - 1.8rem) * 0.2)", width: "59%", height: "2.26rem", floatDuration: 8.9, floatDelay: -3.7, floatScaleMin: 0.965, floatScaleMax: 1.02 },
  { top: "calc(4% + (96% - 1.8rem) * 0.3)", width: "53.5%", height: "2.14rem", floatDuration: 5.6, floatDelay: -9.4, floatScaleMin: 0.975, floatScaleMax: 1.05 },
  { top: "calc(4% + (96% - 1.8rem) * 0.4)", width: "48%", height: "2.02rem", floatDuration: 10.3, floatDelay: -2.1, floatScaleMin: 0.955, floatScaleMax: 1.03 },
  { top: "calc(4% + (96% - 1.8rem) * 0.5)", width: "42.5%", height: "1.9rem", floatDuration: 6.8, floatDelay: -5.5, floatScaleMin: 0.968, floatScaleMax: 1.04 },
  { top: "calc(4% + (96% - 1.8rem) * 0.6)", width: "37%", height: "1.78rem", floatDuration: 7.8, floatDelay: -6.3, floatScaleMin: 0.97, floatScaleMax: 1.045 },
  { top: "calc(4% + (96% - 1.8rem) * 0.7)", width: "31.5%", height: "1.66rem", floatDuration: 9.1, floatDelay: -4.2, floatScaleMin: 0.962, floatScaleMax: 1.038 },
  { top: "calc(4% + (96% - 1.8rem) * 0.8)", width: "26%", height: "1.54rem", floatDuration: 6.4, floatDelay: -8.1, floatScaleMin: 0.978, floatScaleMax: 1.032 },
  { top: "calc(4% + (96% - 1.8rem) * 0.9)", width: "20.5%", height: "1.42rem", floatDuration: 8.2, floatDelay: -11.5, floatScaleMin: 0.966, floatScaleMax: 1.048 },
  { bottom: "0.5rem", width: "15%", height: "1.3rem", floatDuration: 7.4, floatDelay: -12.8, floatScaleMin: 0.985, floatScaleMax: 1.06 },
] as const

export function HeroFunnelBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div className="absolute top-1/2 right-[max(1.5rem,calc((100vw-72rem)/2+1.5rem))] h-[85%] w-[min(80vw,45rem)] -translate-y-1/2 sm:w-[min(70vw,48rem)] lg:w-[min(64vw,51rem)]">
        <div className="relative h-full w-full translate-x-[100px]">
      {funnelRings.map((ring, index) => (
        <div
          key={index}
          className="hero-funnel-ring absolute left-1/2"
          style={{
            ...("top" in ring ? { top: ring.top } : { bottom: ring.bottom }),
            width: ring.width,
            height: ring.height,
            ["--float-scale-min" as string]: ring.floatScaleMin,
            ["--float-scale-max" as string]: ring.floatScaleMax,
            animationDuration: `${ring.floatDuration}s`,
            animationDelay: `${ring.floatDelay}s`,
          }}
        >
          <svg
            aria-hidden
            className="h-full w-full overflow-visible"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <ellipse
              cx="50"
              cy="50"
              rx="49.5"
              ry="49.5"
              fill="none"
              stroke={HERO_DASH_COLOR}
              strokeWidth="0.35"
              pathLength={1}
              strokeDasharray={HERO_DASH_PATTERN}
              strokeDashoffset={0}
              className={cn(
                index % 2 === 0 ? "hero-funnel-dash-march" : "hero-funnel-dash-march-reverse",
              )}
              style={
                {
                  "--hero-dash-cycle": HERO_DASH_CYCLE,
                  animationDuration: `${HERO_DASH_MARCH_MS}ms`,
                } as CSSProperties
              }
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>
      ))}

      {funnelBalls.map((ball, index) => (
        <div
          key={index}
          className={`hero-funnel-ball absolute rounded-full bg-[#B8D4F5] ${ball.size}`}
          style={{
            ["--start-left" as string]: ball.startLeft,
            animationDuration: `${ball.duration}s`,
            animationDelay: `${ball.delay}s`,
          }}
        />
      ))}
        </div>
      </div>
    </div>
  )
}
