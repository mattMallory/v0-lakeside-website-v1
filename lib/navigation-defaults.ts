export type NavItem = {
  label: string
  href: string
}

export type NavigationContent = {
  headerNavItems: NavItem[]
  headerCtaLabel: string
  headerCtaHref: string
  footerDescription: string
  footerNavItems: NavItem[]
}

const defaultNavItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/consultation" },
]

export const defaultNavigationContent: NavigationContent = {
  headerNavItems: defaultNavItems,
  headerCtaLabel: "Schedule a Consultation",
  headerCtaHref: "/consultation",
  footerDescription:
    "Patient acquisition systems for natural wellness clinics. More appointments, less marketing guesswork.",
  footerNavItems: defaultNavItems,
}
