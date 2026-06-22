"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

const WORDS = ["Appointments", "Leads", "Sales", "Virtual Visits"] as const

const TYPING_SPEED = 110
const DELETING_SPEED = 55
const PAUSE_AFTER_TYPING = 1600
const PAUSE_AFTER_DELETING = 350

export function TypingWord({ className }: { className?: string }) {
  const [wordIndex, setWordIndex] = useState(0)
  const [text, setText] = useState("")
  const [phase, setPhase] = useState<"typing" | "pausing" | "deleting">("typing")

  useEffect(() => {
    const currentWord = WORDS[wordIndex]
    let timeout: ReturnType<typeof setTimeout>

    if (phase === "typing") {
      if (text.length < currentWord.length) {
        timeout = setTimeout(() => {
          setText(currentWord.slice(0, text.length + 1))
        }, TYPING_SPEED)
      } else {
        timeout = setTimeout(() => setPhase("deleting"), PAUSE_AFTER_TYPING)
      }
    } else if (phase === "deleting") {
      if (text.length > 0) {
        timeout = setTimeout(() => {
          setText(currentWord.slice(0, text.length - 1))
        }, DELETING_SPEED)
      } else {
        timeout = setTimeout(() => {
          setWordIndex((prev) => (prev + 1) % WORDS.length)
          setPhase("typing")
        }, PAUSE_AFTER_DELETING)
      }
    }

    return () => clearTimeout(timeout)
  }, [text, phase, wordIndex])

  return (
    <span className={cn("relative inline-block whitespace-nowrap text-primary", className)}>
      <span aria-hidden="true">{text}</span>
      <span className="typing-cursor" aria-hidden="true" />
      <span className="sr-only">{WORDS[wordIndex]}</span>
    </span>
  )
}
