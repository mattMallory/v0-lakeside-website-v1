"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Waves } from "lucide-react"
import { Button } from "@/components/ui/button"

const navItems = [
  { label: "System", href: "#system" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Who We Help", href: "#who-we-help" },
  { label: "Why Lakeside", href: "#why" },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Waves className="h-5 w-5" />
          </span>
          <span className="text-lg font-semibold tracking-tight text-foreground">Lakeside</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button render={<Link href="#contact" />} className="rounded-full">
            Schedule a Consultation
          </Button>
        </div>

        <button
          className="text-foreground md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border/60 bg-background md:hidden">
          <nav className="flex flex-col gap-1 px-6 py-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
            <Button
              render={<Link href="#contact" onClick={() => setOpen(false)} />}
              className="mt-2 rounded-full"
            >
              Schedule a Consultation
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}
