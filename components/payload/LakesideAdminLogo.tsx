/**
 * Full Lakeside wordmark for the Payload admin login screen.
 */
export function LakesideAdminLogo() {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- Payload admin graphics use plain img
    <img
      src="/lakeside-logo.svg"
      alt="Lakeside"
      style={{
        display: "block",
        width: "min(220px, 70vw)",
        height: "auto",
      }}
    />
  )
}
