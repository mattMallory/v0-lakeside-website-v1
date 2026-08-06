import type { CSSProperties } from "react"

import {
  HERO_DASH_CYCLE,
  HERO_DASH_MARCH_MS,
  HERO_DASH_PATTERN,
} from "@/lib/hero-dash-pattern"
import { cn } from "@/lib/utils"

const BLOG_HERO_BALL_COLOR = "#7CB0E8"
const BLOG_HERO_DASH_COLOR = "#5B7CAA"

const orbitRings = [
  { size: "5.5rem", floatDuration: 5.1, floatDelay: 0, spinMultiplier: 4.6 },
  { size: "12rem", floatDuration: 9.8, floatDelay: -2.4, spinMultiplier: 6.2 },
  { size: "19.5rem", floatDuration: 4.3, floatDelay: -6.8, spinMultiplier: 5.4 },
  { size: "28rem", floatDuration: 11.2, floatDelay: -1.2, spinMultiplier: 7.1 },
  { size: "37.5rem", floatDuration: 6.7, floatDelay: -9.5, spinMultiplier: 4.9 },
  { size: "48rem", floatDuration: 13.5, floatDelay: -4.1, spinMultiplier: 8.3 },
  { size: "59rem", floatDuration: 7.4, floatDelay: -11.3, spinMultiplier: 5.8 },
] as const

const orbitBalls = [
  { size: "h-3 w-3", radius: "5.5rem", duration: 17.5, startAngle: 23, reverse: false, wobbleDuration: 3.4 },
  { size: "h-2.5 w-2.5", radius: "8.5rem", duration: 54, startAngle: 147, reverse: true, wobbleDuration: 5.9 },
  { size: "h-4 w-4", radius: "11.5rem", duration: 31, startAngle: 268, reverse: false, wobbleDuration: 4.1 },
  { size: "h-2 w-2", radius: "7rem", duration: 43, startAngle: 52, reverse: true, wobbleDuration: 6.7 },
  { size: "h-3.5 w-3.5", radius: "14.5rem", duration: 22, startAngle: 199, reverse: false, wobbleDuration: 3.8 },
  { size: "h-2.5 w-2.5", radius: "10rem", duration: 68, startAngle: 311, reverse: true, wobbleDuration: 7.2 },
  { size: "h-3 w-3", radius: "16.5rem", duration: 39, startAngle: 84, reverse: false, wobbleDuration: 5.3 },
  { size: "h-2 w-2", radius: "6.5rem", duration: 26, startAngle: 236, reverse: true, wobbleDuration: 4.6 },
  { size: "h-3 w-3", radius: "9rem", duration: 61, startAngle: 175, reverse: false, wobbleDuration: 6.1 },
  { size: "h-2.5 w-2.5", radius: "13rem", duration: 33, startAngle: 42, reverse: true, wobbleDuration: 3.2 },
  { size: "h-2 w-2", radius: "5rem", duration: 48, startAngle: 290, reverse: false, wobbleDuration: 5.5 },
  { size: "h-3.5 w-3.5", radius: "15rem", duration: 74, startAngle: 118, reverse: true, wobbleDuration: 8.4 },
] as const

function orbitDelay(duration: number, startAngle: number) {
  return `${-((startAngle / 360) * duration).toFixed(2)}s`
}

export function BlogHeroBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {orbitRings.map((ring, index) => (
        <div
          key={index}
          className={cn(
            "absolute top-1/2 left-1/2 origin-center",
            index % 2 === 0 ? "blog-orbit-ring-spin-cw" : "blog-orbit-ring-spin-ccw",
          )}
          style={{
            width: ring.size,
            height: ring.size,
            animationDuration: `${ring.floatDuration * ring.spinMultiplier}s`,
            animationDelay: `${ring.floatDelay}s`,
          }}
        >
          <div
            className="blog-orbit-ring-float h-full w-full origin-center"
            style={{
              ["--blog-orbit-size" as string]: ring.size,
              animationDuration: `${ring.floatDuration}s`,
              animationDelay: `${ring.floatDelay}s`,
            }}
          >
            <svg aria-hidden className="h-full w-full overflow-visible" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="49.5"
                fill="none"
                stroke={BLOG_HERO_DASH_COLOR}
                strokeWidth="0.35"
                pathLength={1}
                strokeDasharray={HERO_DASH_PATTERN}
                strokeDashoffset={0}
                className="blog-orbit-dash-march"
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
        </div>
      ))}

      {orbitBalls.map((ball, index) => (
        <div
          key={index}
          className={cn("absolute", ball.reverse ? "blog-orbit-reverse" : "blog-orbit")}
          style={{
            top: "50%",
            left: "50%",
            width: `calc(${ball.radius} * 2)`,
            height: `calc(${ball.radius} * 2)`,
            animationDuration: `${ball.duration}s`,
            animationDelay: orbitDelay(ball.duration, ball.startAngle),
          }}
        >
          <div
            className={cn("blog-orbit-ball absolute top-0 left-1/2 rounded-full", ball.size)}
            style={
              {
                backgroundColor: BLOG_HERO_BALL_COLOR,
                "--blog-orbit-wobble-x": `${2 + (index % 4)}px`,
                "--blog-orbit-wobble-y": `${2 + (index % 3)}px`,
                animationDuration: `${ball.wobbleDuration}s`,
                animationDelay: `${-(index * 0.37)}s`,
              } as CSSProperties
            }
          />
        </div>
      ))}
    </div>
  )
}
