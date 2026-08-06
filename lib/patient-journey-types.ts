export type PatientJourneyStep = {
  label: string
  teaser: string
  badTitle?: string | null
  badDescription: string
  goodTitle: string
  goodDescription: string
  insight: string
}

export type PatientJourneyProps = {
  eyebrow?: string | null
  title?: string | null
  description?: string | null
  steps?: PatientJourneyStep[] | null
  completionTitle?: string | null
  completionDescription?: string | null
  ctaLabel?: string | null
  ctaUrl?: string | null
}
