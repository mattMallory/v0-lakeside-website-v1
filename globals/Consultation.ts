import type { GlobalConfig } from "payload"

import { defaultConsultationPageContent } from "@/lib/consultation-page-defaults"
import { revalidateSite } from "@/lib/revalidate-site"

export const Consultation: GlobalConfig = {
  slug: "consultation",
  label: "Consultation Page",
  access: {
    read: () => true,
  },
  admin: {
    description:
      "Editable copy for the public consultation form page at /consultation. Form field options are configured in code.",
  },
  hooks: {
    afterChange: [
      async () => {
        await revalidateSite()
      },
    ],
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Page Copy",
          fields: [
            {
              name: "eyebrow",
              type: "text",
              label: "Eyebrow",
              defaultValue: defaultConsultationPageContent.eyebrow,
            },
            {
              name: "title",
              type: "text",
              label: "Page Title",
              required: true,
              defaultValue: defaultConsultationPageContent.title,
            },
            {
              name: "description",
              type: "textarea",
              label: "Supporting Text",
              defaultValue: defaultConsultationPageContent.description,
              admin: {
                rows: 6,
              },
            },
            {
              name: "seoTitle",
              type: "text",
              label: "SEO Title",
              defaultValue: defaultConsultationPageContent.seoTitle,
            },
            {
              name: "seoDescription",
              type: "textarea",
              label: "SEO Description",
              defaultValue: defaultConsultationPageContent.seoDescription,
            },
          ],
        },
        {
          label: "SMS Consent",
          description:
            "Optional checkboxes shown before submit. Edit the full consent language for TCPA / carrier compliance.",
          fields: [
            {
              name: "smsNonMarketingConsentLabel",
              type: "textarea",
              label: "Non-Marketing SMS Consent",
              defaultValue: defaultConsultationPageContent.smsNonMarketingConsentLabel,
              admin: {
                description:
                  "Optional checkbox for transactional / non-marketing texts (consultation, scheduling).",
                rows: 5,
              },
            },
            {
              name: "smsMarketingConsentLabel",
              type: "textarea",
              label: "Marketing SMS Consent",
              defaultValue: defaultConsultationPageContent.smsMarketingConsentLabel,
              admin: {
                description: "Optional checkbox for marketing / promotional texts.",
                rows: 5,
              },
            },
            {
              name: "privacyLinkLabel",
              type: "text",
              label: "Privacy Policy Link Label",
              defaultValue: defaultConsultationPageContent.privacyLinkLabel,
            },
            {
              name: "termsLinkLabel",
              type: "text",
              label: "Terms Link Label",
              defaultValue: defaultConsultationPageContent.termsLinkLabel,
            },
          ],
        },
      ],
    },
  ],
}
