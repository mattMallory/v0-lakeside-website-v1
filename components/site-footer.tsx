import Link from "next/link"
import { Waves } from "lucide-react"

const columns = [
  {
    title: "System",
    links: ["Paid Advertising", "Landing Pages", "Lead Management", "Campaign Optimization"],
  },
  {
    title: "Who We Help",
    links: ["Acupuncturists", "Chiropractors", "Functional Medicine", "Naturopathic Doctors"],
  },
  {
    title: "Company",
    links: ["Why Lakeside", "Case Studies", "About", "Contact"],
  },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Waves className="h-5 w-5" />
              </span>
              <span className="text-lg font-semibold tracking-tight text-foreground">Lakeside</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Patient acquisition systems for natural wellness clinics. More appointments, less marketing guesswork.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold text-foreground">{col.title}</h3>
              <ul className="mt-4 flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <Link href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            {"© "}
            {new Date().getFullYear()} Lakeside. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
