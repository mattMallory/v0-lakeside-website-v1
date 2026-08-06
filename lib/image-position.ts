export const IMAGE_POSITION_GRID = [
  ["top-left", "top-center", "top-right"],
  ["center-left", "center", "center-right"],
  ["bottom-left", "bottom-center", "bottom-right"],
] as const

export const IMAGE_POSITION_EDGE_OPTIONS = [
  { label: "Top", value: "top" },
  { label: "Left", value: "left" },
  { label: "Right", value: "right" },
  { label: "Bottom", value: "bottom" },
] as const

export const IMAGE_POSITION_OPTIONS = [
  { label: "Center", value: "center" },
  { label: "Top", value: "top" },
  { label: "Bottom", value: "bottom" },
  { label: "Left", value: "left" },
  { label: "Right", value: "right" },
  { label: "Top Left", value: "top-left" },
  { label: "Top Center", value: "top-center" },
  { label: "Top Right", value: "top-right" },
  { label: "Center Left", value: "center-left" },
  { label: "Center Right", value: "center-right" },
  { label: "Bottom Left", value: "bottom-left" },
  { label: "Bottom Center", value: "bottom-center" },
  { label: "Bottom Right", value: "bottom-right" },
] as const

export type ImagePositionValue = (typeof IMAGE_POSITION_OPTIONS)[number]["value"]

export const DEFAULT_IMAGE_POSITION: ImagePositionValue = "center"

const IMAGE_POSITION_CSS: Record<ImagePositionValue, string> = {
  center: "center",
  top: "top",
  bottom: "bottom",
  left: "left",
  right: "right",
  "top-left": "top left",
  "top-center": "top center",
  "top-right": "top right",
  "center-left": "center left",
  "center-right": "center right",
  "bottom-left": "bottom left",
  "bottom-center": "bottom center",
  "bottom-right": "bottom right",
}

export function toImagePositionValue(
  value: string | null | undefined,
  fallback: ImagePositionValue = DEFAULT_IMAGE_POSITION,
): ImagePositionValue {
  if (value && value in IMAGE_POSITION_CSS) {
    return value as ImagePositionValue
  }

  return fallback
}

export function getImagePositionLabel(
  value: string | null | undefined,
  fallback: ImagePositionValue = DEFAULT_IMAGE_POSITION,
): string {
  const resolved = toImagePositionValue(value, fallback)
  return IMAGE_POSITION_OPTIONS.find((option) => option.value === resolved)?.label ?? "Center"
}

export function resolveImagePosition(
  value: string | null | undefined,
  fallback: ImagePositionValue = DEFAULT_IMAGE_POSITION,
): string {
  if (!value) return IMAGE_POSITION_CSS[fallback]

  if (value in IMAGE_POSITION_CSS) {
    return IMAGE_POSITION_CSS[value as ImagePositionValue]
  }

  return IMAGE_POSITION_CSS[fallback]
}
