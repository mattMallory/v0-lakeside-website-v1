import { cn } from "@/lib/utils"

export const GHL_EMBED_MIN_HEIGHT = 216

type GhlEmbedFormSlotProps = {
  title: string
  embedUrl: string | null
  embedRefreshKey?: number
  isUpdating?: boolean
  waitingMessage: string
  className?: string
  placeholderClassName?: string
}

export function GhlEmbedFormSlot({
  title,
  embedUrl,
  embedRefreshKey = 0,
  isUpdating = false,
  waitingMessage,
  className,
  placeholderClassName,
}: GhlEmbedFormSlotProps) {
  return (
    <div
      className={cn("relative overflow-hidden rounded-[11px]", className)}
      style={{ minHeight: GHL_EMBED_MIN_HEIGHT }}
    >
      {embedUrl ? (
        <>
          {isUpdating ? (
            <div
              className="absolute inset-0 z-10 flex items-center justify-center bg-white/90"
              aria-live="polite"
            >
              <p className="px-4 text-center text-xs font-medium leading-relaxed text-[#64748B]">
                Updating pre-filled values…
              </p>
            </div>
          ) : null}
          <iframe
            key={embedRefreshKey}
            title={title}
            src={embedUrl}
            className="block w-full border-0 bg-white"
            style={{ minHeight: GHL_EMBED_MIN_HEIGHT, height: GHL_EMBED_MIN_HEIGHT }}
          />
        </>
      ) : (
        <div
          data-ob-embed-root
          data-ob-embed-waiting={waitingMessage}
          suppressHydrationWarning
          className={cn(
            "flex items-center justify-center px-4",
            placeholderClassName ?? "bg-[#F9F7F4]",
          )}
          style={{ minHeight: GHL_EMBED_MIN_HEIGHT }}
        >
          <p className="text-center text-xs leading-relaxed text-[#94A3B8]">{waitingMessage}</p>
        </div>
      )}
    </div>
  )
}
