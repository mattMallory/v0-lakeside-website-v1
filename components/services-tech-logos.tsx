import { cn } from "@/lib/utils"

export type TechLogo = {
  id: string
  name: string
}

type ServicesTechLogosProps = {
  logos: TechLogo[]
  variant?: "light" | "dark"
  align?: "center" | "start"
}

function PlatformLogo({ id }: { id: string }) {
  switch (id) {
    case "google":
      return (
        <svg viewBox="0 0 24 24" aria-hidden className="h-6 w-6 sm:h-7 sm:w-7">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
      )
    case "meta":
      return (
        <svg viewBox="0 0 24 24" aria-hidden className="h-6 w-6 sm:h-7 sm:w-7">
          <path
            fill="#0081FB"
            d="M6.5 8.5c1.4-2.1 3.2-3.2 4.8-3.2 2.2 0 3.6 1.6 5.2 3.6 1.4-2.2 2.9-3.6 4.5-3.6 2.7 0 4.5 2.5 4.5 5.4 0 4.2-2.8 8.8-6.4 8.8-1.8 0-3.2-.9-4.8-3.1-1.6 2.2-3 3.1-4.8 3.1C4.3 19.5 2 15.6 2 11.4c0-2.9 1.8-4.9 4.5-2.9z"
          />
        </svg>
      )
    case "microsoft":
      return (
        <svg viewBox="0 0 24 24" aria-hidden className="h-6 w-6 sm:h-7 sm:w-7">
          <rect fill="#F25022" x="2" y="2" width="9.5" height="9.5" />
          <rect fill="#7FBA00" x="12.5" y="2" width="9.5" height="9.5" />
          <rect fill="#00A4EF" x="2" y="12.5" width="9.5" height="9.5" />
          <rect fill="#FFB900" x="12.5" y="12.5" width="9.5" height="9.5" />
        </svg>
      )
    case "youtube":
      return (
        <svg viewBox="0 0 24 24" aria-hidden className="h-6 w-6 sm:h-7 sm:w-7">
          <rect fill="#FF0000" x="2" y="5" width="20" height="14" rx="3.5" />
          <path fill="#fff" d="M10 9.5v5l5-2.5-5-2.5z" />
        </svg>
      )
    case "highlevel":
      return (
        <svg viewBox="0 0 24 24" aria-hidden className="h-6 w-6 sm:h-7 sm:w-7">
          <path
            fill="#188AF5"
            d="M12 2.5 4.5 19h4.8l1.2-2.8h3l1.2 2.8H19.5L12 2.5zm0 6.8 1.5 3.5h-3L12 9.3z"
          />
        </svg>
      )
    case "payload":
      return (
        <svg viewBox="0 0 24 24" aria-hidden className="h-6 w-6 sm:h-7 sm:w-7">
          <path
            fill="#fff"
            d="M12 2 3 7v10l9 5 9-5V7l-9-5zm0 2.3 6.5 3.6v7.2L12 18.1l-6.5-3.6V7.9L12 4.3z"
          />
          <path fill="#64748B" d="m12 8.5-3 1.7v3.6l3 1.7 3-1.7v-3.6l-3-1.7z" />
        </svg>
      )
    default:
      return (
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-lake-pale text-xs font-bold text-primary sm:h-7 sm:w-7">
          ?
        </span>
      )
  }
}

export function ServicesTechLogos({
  logos,
  variant = "light",
  align = "center",
}: ServicesTechLogosProps) {
  const isDark = variant === "dark"

  return (
    <div
      data-tech-logos
      className={cn(
        "grid max-w-xs grid-cols-3 gap-2 sm:max-w-none sm:flex sm:flex-wrap sm:items-center sm:gap-3",
        align === "center" ? "mb-10 justify-items-center mx-auto sm:justify-center" : "justify-items-start",
      )}
    >
      {logos.map((logo) => (
        <div
          key={logo.id}
          className={cn(
            "tech-logo-item flex h-12 w-12 items-center justify-center rounded-[12px] sm:h-14 sm:w-14",
            isDark
              ? "border border-[#1F2E45] bg-[#111B2E]"
              : "border border-border bg-white shadow-sm sm:h-16 sm:w-16",
          )}
          title={logo.name}
        >
          <span className="sr-only">{logo.name}</span>
          <PlatformLogo id={logo.id} />
        </div>
      ))}
    </div>
  )
}
