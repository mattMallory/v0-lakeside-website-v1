const practices = [
  "Acupuncturists",
  "Chiropractors",
  "Functional Medicine Clinics",
  "Naturopathic Doctors",
  "Wellness Clinics",
  "Integrative Health Practices",
]

export function WhoWeHelp() {
  return (
    <section id="who-we-help" className="bg-secondary/60 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Who We Help</h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            We partner with natural healthcare practices across the wellness spectrum.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {practices.map((practice) => (
            <div
              key={practice}
              className="flex items-center justify-center rounded-2xl border border-border bg-card px-6 py-8 text-center font-semibold text-card-foreground transition-colors hover:border-primary/50"
            >
              {practice}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
