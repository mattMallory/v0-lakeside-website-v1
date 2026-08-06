import type { SelectField } from "payload"

import {
  DEFAULT_IMAGE_POSITION,
  IMAGE_POSITION_OPTIONS,
} from "@/lib/image-position"

type ImagePositionFieldOptions = {
  name?: string
  label?: string
  required?: boolean
  description?: string
}

export function imagePositionField({
  name = "imagePosition",
  label = "Image Alignment",
  required = false,
  description = "Choose which part of the image stays in frame when it is cropped.",
}: ImagePositionFieldOptions = {}): SelectField {
  return {
    name,
    type: "select",
    label,
    required,
    defaultValue: DEFAULT_IMAGE_POSITION,
    options: IMAGE_POSITION_OPTIONS.map((option) => ({
      label: option.label,
      value: option.value,
    })),
    admin: {
      description,
      components: {
        Field: "@/components/payload/ImagePositionField#ImagePositionField",
      },
    },
  }
}
