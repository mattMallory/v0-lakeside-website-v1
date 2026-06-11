import Script from "next/script"

export function ConsultationForm() {
  return (
    <>
      <div className="min-h-[952px] w-full overflow-hidden rounded-2xl border border-border bg-card shadow-sm ring-1 ring-border">
        <iframe
          src="https://api.leadconnectorhq.com/widget/form/MyXndz0NrZDQljBcy9Xq"
          id="inline-MyXndz0NrZDQljBcy9Xq"
          title="Schedule a consultation"
          data-layout='{"id":"INLINE"}'
          data-trigger-type="alwaysShow"
          data-trigger-value=""
          data-activation-type="alwaysActivated"
          data-activation-value=""
          data-deactivation-type="neverDeactivate"
          data-deactivation-value=""
          data-form-name="Form 1"
          data-height="952"
          data-layout-iframe-id="inline-MyXndz0NrZDQljBcy9Xq"
          data-form-id="MyXndz0NrZDQljBcy9Xq"
          className="h-[952px] w-full border-0"
        />
      </div>
      <Script src="https://link.msgsndr.com/js/form_embed.js" strategy="afterInteractive" />
    </>
  )
}
