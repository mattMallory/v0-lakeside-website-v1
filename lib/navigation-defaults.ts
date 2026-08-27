export type NavItem = {
  label: string
  href: string
}

export type NavigationContent = {
  headerNavItems: NavItem[]
  headerCtaLabel: string
  headerCtaHref: string
  footerDescription: string
  footerAddressLine1: string
  footerAddressLine2: string
  footerPhone: string
  footerEmail: string
  footerNavItems: NavItem[]
}

const defaultNavItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Blog", href: "/blog" },
  { label: "Demo The System", href: "/demo" },
]

export const defaultNavigationContent: NavigationContent = {
  headerNavItems: defaultNavItems,
  headerCtaLabel: "Schedule a Consultation",
  headerCtaHref: "/consultation",
  footerDescription:
    "Patient acquisition systems for natural wellness clinics. More appointments, less marketing guesswork.",
  footerAddressLine1: "332 HIAWATHA DR",
  footerAddressLine2: "LAKE IN THE HILLS, 60156",
  footerPhone: "815-893-2976",
  footerEmail: "sales@madebylakeside.com",
  footerNavItems: defaultNavItems,
}
