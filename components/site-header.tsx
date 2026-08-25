"use client"

import { useEffect, type CSSProperties, type MouseEvent } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { useBranding } from "@/components/branding-provider"
import { useNavigation } from "@/components/navigation-provider"
import { Button } from "@/components/ui/button"

const MOBILE_MENU_TOGGLE_ID = "site-mobile-menu-toggle"

function closeMobileMenu() {
  const toggle = document.getElementById(MOBILE_MENU_TOGGLE_ID) as HTMLInputElement | null
  if (toggle) toggle.checked = false
}

export function SiteHeader() {
  const pathname = usePathname()
  const branding = useBranding()
  const navigation = useNavigation()
  const navItems = navigation.headerNavItems
  const ctaNavIndex = navItems.length

  useEffect(() => {
    const toggle = document.getElementById(MOBILE_MENU_TOGGLE_ID) as HTMLInputElement | null
    const overlay = document.querySelector(".site-mobile-nav-overlay")
    if (!toggle || !overlay) return

    const syncAria = () => {
      overlay.setAttribute("aria-hidden", toggle.checked ? "false" : "true")
    }

    toggle.addEventListener("change", syncAria)
    syncAria()
    return () => toggle.removeEventListener("change", syncAria)
  }, [])

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return
      const toggle = document.getElementById(MOBILE_MENU_TOGGLE_ID) as HTMLInputElement | null
      if (toggle?.checked) toggle.checked = false
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  function handleNavClick(event: MouseEvent<HTMLAnchorElement>, href: string) {
    const hashIndex = href.indexOf("#")
    if (hashIndex === -1) return

    const sectionId = href.slice(hashIndex + 1)
    closeMobileMenu()

    if (pathname !== "/") {
      event.preventDefault()
      window.location.assign(href)
      return
    }

    event.preventDefault()
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" })
    window.history.pushState(null, "", href)
  }

  return (
    <header className="sticky top-0 z-[100] border-b border-border bg-white">
      <input
        type="checkbox"
        id={MOBILE_MENU_TOGGLE_ID}
        className="site-mobile-menu-toggle sr-only"
        aria-hidden="true"
      />

      <div className="site-mobile-nav-bar mx-auto flex h-16 max-w-page items-center justify-between px-6">
        <Link href="/" className="flex shrink-0 items-center">
          <img
            src={branding.logoUrl}
            alt={branding.logoAlt}
            suppressHydrationWarning
            // Height comes from Branding; resolveLogoHeight clamps it to 16-96px.
            // max-width still bounds a wide logo independently of its height.
            style={{ height: `${branding.logoHeight}px` }}
            className="w-auto max-w-[9.5rem] object-contain object-left"
          />
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={(event) => handleNavClick(event, item.href)}
              className="font-brand-display rounded-[7px] px-[11px] py-1.5 text-[15px] font-medium text-heading transition-colors hover:bg-muted hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button
            render={<Link href={navigation.headerCtaHref} />}
            nativeButton={false}
            size="sm"
          >
            {navigation.headerCtaLabel}
          </Button>
        </div>

        <label
          htmlFor={MOBILE_MENU_TOGGLE_ID}
          className="site-mobile-nav-trigger relative z-[101] flex h-11 w-11 shrink-0 cursor-pointer touch-manipulation items-center justify-center rounded-md text-foreground md:hidden"
          aria-controls="site-mobile-nav-dialog"
        >
          <Menu className="site-mobile-nav-icon-menu h-6 w-6" aria-hidden />
          <X className="site-mobile-nav-icon-close h-6 w-6" aria-hidden />
          <span className="sr-only">Toggle menu</span>
        </label>
      </div>

      <div
        className="site-mobile-nav-overlay fixed inset-0 z-[110] md:hidden"
        aria-hidden="true"
      >
        <label
          htmlFor={MOBILE_MENU_TOGGLE_ID}
          className="site-mobile-nav-backdrop absolute inset-0 cursor-pointer touch-manipulation"
          aria-label="Close menu"
        />

        <div
          id="site-mobile-nav-dialog"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          className="site-mobile-nav-panel fixed top-0 right-0 flex h-full w-[min(100%,20rem)] flex-col border-l border-border bg-white shadow-raised"
        >
          <div className="flex h-16 shrink-0 items-center justify-end border-b border-border/60 px-6">
            <label
              htmlFor={MOBILE_MENU_TOGGLE_ID}
              className="flex h-11 w-11 cursor-pointer touch-manipulation items-center justify-center rounded-md text-foreground"
              aria-label="Close menu"
            >
              <X className="h-6 w-6" aria-hidden />
            </label>
          </div>

          <nav
            className="flex flex-col gap-1 overflow-y-auto px-6 py-4"
            aria-label="Mobile navigation"
          >
            {navItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                style={{ "--nav-index": index } as CSSProperties}
                onClick={(event) => {
                  handleNavClick(event, item.href)
                  closeMobileMenu()
                }}
                className="site-mobile-nav-link font-brand-display rounded-md px-2 py-2 text-base font-medium text-heading hover:bg-muted hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
            <div
              className="site-mobile-nav-cta mt-2"
              style={{ "--nav-index": ctaNavIndex } as CSSProperties}
            >
              <Button
                render={
                  <Link href={navigation.headerCtaHref} onClick={() => closeMobileMenu()} />
                }
                nativeButton={false}
                className="w-full"
              >
                {navigation.headerCtaLabel}
              </Button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
