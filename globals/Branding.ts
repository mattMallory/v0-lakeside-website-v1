import type { GlobalConfig, TextField } from "payload"

import { defaultBrandingContent } from "@/lib/branding-defaults"
import { googleFontOptions } from "@/lib/google-fonts"

const hexColorValidate: TextField["validate"] = (value) => {
  if (!value) return true
  if (typeof value !== "string") return "Enter a valid hex color (e.g. #3B6FD8)"
  return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(value)
    ? true
    : "Enter a valid hex color (e.g. #3B6FD8)"
}

function hexColorField({
  name,
  label,
  defaultValue,
  description,
}: {
  name: string
  label: string
  defaultValue: string
  description: string
}): TextField {
  return {
    name,
    type: "text",
    label,
    defaultValue,
    admin: {
      description,
      placeholder: defaultValue,
    },
    validate: hexColorValidate,
  }
}

export const Branding: GlobalConfig = {
  slug: "branding",
  label: "Branding",
  access: {
    read: () => true,
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Logo",
          fields: [
            {
              name: "logo",
              type: "upload",
              relationTo: "media",
              label: "Logo",
              admin: {
                description: "Shown in the site header and footer. SVG or PNG recommended.",
              },
            },
            {
              name: "logoAlt",
              type: "text",
              label: "Logo alt text",
              defaultValue: defaultBrandingContent.logoAlt,
            },
          ],
        },
        {
          label: "Colors",
          fields: [
            {
              type: "row",
              fields: [
                hexColorField({
                  name: "primaryColor",
                  label: "Brand / link color",
                  defaultValue: defaultBrandingContent.primaryColor,
                  description: "Eyebrows, text links, and general brand accents.",
                }),
                hexColorField({
                  name: "iconColor",
                  label: "Icon color",
                  defaultValue: defaultBrandingContent.iconColor,
                  description: "Icons in problem cards, services, and similar UI.",
                }),
              ],
            },
            {
              type: "row",
              fields: [
                hexColorField({
                  name: "accentColor",
                  label: "Accent color",
                  defaultValue: defaultBrandingContent.accentColor,
                  description: "Soft highlights and decorative accent surfaces.",
                }),
              ],
            },
            {
              type: "row",
              fields: [
                hexColorField({
                  name: "buttonColor",
                  label: "Primary button color",
                  defaultValue: defaultBrandingContent.buttonColor,
                  description: "Primary CTA button background.",
                }),
                hexColorField({
                  name: "buttonTextColor",
                  label: "Primary button text",
                  defaultValue: defaultBrandingContent.buttonTextColor,
                  description: "Text/icon color on primary buttons.",
                }),
              ],
            },
            {
              type: "row",
              fields: [
                hexColorField({
                  name: "secondaryButtonColor",
                  label: "Secondary button color",
                  defaultValue: defaultBrandingContent.secondaryButtonColor,
                  description: "Border/fill color for outline and secondary buttons.",
                }),
                hexColorField({
                  name: "secondaryButtonTextColor",
                  label: "Secondary button text",
                  defaultValue: defaultBrandingContent.secondaryButtonTextColor,
                  description: "Text color on secondary/outline buttons.",
                }),
              ],
            },
            {
              type: "row",
              fields: [
                hexColorField({
                  name: "backgroundColor",
                  label: "Page background",
                  defaultValue: defaultBrandingContent.backgroundColor,
                  description: "Main page background color.",
                }),
                hexColorField({
                  name: "secondaryColor",
                  label: "Surface / card tint",
                  defaultValue: defaultBrandingContent.secondaryColor,
                  description: "Secondary surfaces, muted fills, and soft cards.",
                }),
              ],
            },
            {
              type: "row",
              fields: [
                hexColorField({
                  name: "headingColor",
                  label: "Heading text color",
                  defaultValue: defaultBrandingContent.headingColor,
                  description: "Color for section titles and other headings.",
                }),
                hexColorField({
                  name: "textColor",
                  label: "Body text color",
                  defaultValue: defaultBrandingContent.textColor,
                  description: "Main paragraph and body copy color.",
                }),
              ],
            },
            {
              type: "row",
              fields: [
                hexColorField({
                  name: "mutedTextColor",
                  label: "Muted text color",
                  defaultValue: defaultBrandingContent.mutedTextColor,
                  description: "Supporting copy, captions, and nav links.",
                }),
                hexColorField({
                  name: "borderColor",
                  label: "Border color",
                  defaultValue: defaultBrandingContent.borderColor,
                  description: "Dividers, outlines, and card borders.",
                }),
              ],
            },
            {
              type: "row",
              fields: [
                hexColorField({
                  name: "focusRingColor",
                  label: "Focus ring color",
                  defaultValue: defaultBrandingContent.focusRingColor,
                  description: "Keyboard focus outlines on buttons and inputs.",
                }),
              ],
            },
          ],
        },
        {
          label: "Typography",
          fields: [
            {
              name: "headingFont",
              type: "select",
              label: "Heading font",
              options: [...googleFontOptions],
              defaultValue: defaultBrandingContent.headingFont,
              required: true,
              admin: {
                description: "Applied to all headings (h1–h6).",
              },
            },
            {
              name: "bodyFont",
              type: "select",
              label: "Body font",
              options: [...googleFontOptions],
              defaultValue: defaultBrandingContent.bodyFont,
              required: true,
              admin: {
                description: "Applied to body copy and UI text.",
              },
            },
          ],
        },
      ],
    },
  ],
}
