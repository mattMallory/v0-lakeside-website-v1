"use client"

import { GhlNativeEmailCapture } from "@/components/ghl-native-email-capture"
import { GHL_DEMO_SYSTEM_SOURCE, GHL_DEMO_SYSTEM_TAGS } from "@/lib/ghl-demo-system"
import { submitGhlContact } from "@/lib/submit-ghl-contact"

type DemoSystemWaitlistProps = {
  formTitle: string
  formDescription: string
  formButtonLabel: string
  successTitle: string
  successMessage: string
}

export function DemoSystemWaitlist({
  formTitle,
  formDescription,
  formButtonLabel,
  successTitle,
  successMessage,
}: DemoSystemWaitlistProps) {
  return (
    <div className="rounded-2xl border border-border bg-white p-6 shadow-sm ring-1 ring-border md:p-8">
      <GhlNativeEmailCapture
        title={formTitle}
        description={formDescription}
        buttonLabel={formButtonLabel}
        successTitle={successTitle}
        successMessage={successMessage}
        onSubmit={({ firstName, email }) =>
          submitGhlContact({
            firstName,
            email,
            source: GHL_DEMO_SYSTEM_SOURCE,
            tags: [...GHL_DEMO_SYSTEM_TAGS],
          })
        }
      />
    </div>
  )
}
