import { cache } from "react"

import {
  defaultGrowthAssessmentContent,
  type GrowthAssessmentContent,
  type GrowthAssessmentDataSource,
  type GrowthAssessmentFinding,
  type GrowthAssessmentIconCard,
  type GrowthAssessmentPractitioner,
  type GrowthAssessmentScenario,
  type GrowthAssessmentScenarioRow,
  type GrowthAssessmentStep,
  type GrowthAssessmentUseCase,
} from "@/lib/growth-assessment-defaults"

function withFallback<T>(value: T | null | undefined, fallback: T): T {
  if (value === null || value === undefined) return fallback
  if (typeof value === "string" && value.trim() === "") return fallback
  return value
}

function mergeArray<T>(value: unknown[] | null | undefined, fallback: T[]): T[] {
  if (!Array.isArray(value) || value.length === 0) return fallback
  return value as T[]
}

function mapStringItems(
  value: unknown[] | null | undefined,
  fallback: string[],
  key = "label",
): string[] {
  if (!Array.isArray(value) || value.length === 0) return fallback

  return value
    .map((item, index) => {
      if (typeof item === "string") return item
      if (item && typeof item === "object" && key in item) {
        const label = (item as Record<string, unknown>)[key]
        return typeof label === "string" ? label : fallback[index]
      }
      return fallback[index]
    })
    .filter((item): item is string => Boolean(item))
}

function mapIconCards(
  value: unknown[] | null | undefined,
  fallback: GrowthAssessmentIconCard[],
): GrowthAssessmentIconCard[] {
  return mergeArray(value, fallback).map((item, index) => {
    const doc = item as Partial<GrowthAssessmentIconCard>
    const fb = fallback[index] ?? fallback[0]
    return {
      icon: withFallback(doc.icon, fb.icon),
      title: withFallback(doc.title, fb.title),
      description: withFallback(doc.description, fb.description),
    }
  })
}

function mapSteps(
  value: unknown[] | null | undefined,
  fallback: GrowthAssessmentStep[],
): GrowthAssessmentStep[] {
  return mergeArray(value, fallback).map((item, index) => {
    const doc = item as Partial<GrowthAssessmentStep>
    const fb = fallback[index] ?? fallback[0]
    return {
      label: withFallback(doc.label, fb.label),
      title: withFallback(doc.title, fb.title),
      description: withFallback(doc.description, fb.description),
    }
  })
}

function mapScenarioRows(
  value: unknown[] | null | undefined,
  fallback: GrowthAssessmentScenarioRow[],
): GrowthAssessmentScenarioRow[] {
  return mergeArray(value, fallback).map((item, index) => {
    const doc = item as Partial<GrowthAssessmentScenarioRow>
    const fb = fallback[index] ?? fallback[0]
    return {
      label: withFallback(doc.label, fb.label),
      value: withFallback(doc.value, fb.value),
    }
  })
}

function mapScenarios(
  value: unknown[] | null | undefined,
  fallback: GrowthAssessmentScenario[],
): GrowthAssessmentScenario[] {
  return mergeArray(value, fallback).map((item, index) => {
    const doc = item as Partial<GrowthAssessmentScenario> & {
      rows?: unknown[] | null
    }
    const fb = fallback[index] ?? fallback[0]
    return {
      title: withFallback(doc.title, fb.title),
      description: withFallback(doc.description, fb.description),
      featured: doc.featured ?? fb.featured,
      rows: mapScenarioRows(doc.rows, fb.rows),
    }
  })
}

function mapFindings(
  value: unknown[] | null | undefined,
  fallback: GrowthAssessmentFinding[],
): GrowthAssessmentFinding[] {
  return mergeArray(value, fallback).map((item, index) => {
    const doc = item as Partial<GrowthAssessmentFinding>
    const fb = fallback[index] ?? fallback[0]
    return {
      title: withFallback(doc.title, fb.title),
      description: withFallback(doc.description, fb.description),
      consequence: withFallback(doc.consequence, fb.consequence),
      action: withFallback(doc.action, fb.action),
    }
  })
}

function mapFaq(
  value: unknown[] | null | undefined,
  fallback: GrowthAssessmentContent["faqItems"],
): GrowthAssessmentContent["faqItems"] {
  return mergeArray(value, fallback).map((item, index) => {
    const doc = item as Partial<GrowthAssessmentContent["faqItems"][number]>
    const fb = fallback[index] ?? fallback[0]
    return {
      question: withFallback(doc.question, fb.question),
      answer: withFallback(doc.answer, fb.answer),
    }
  })
}

type MediaLike = { url?: string | null }

function resolveMediaUrl(media: number | MediaLike | null | undefined): string | undefined {
  if (!media || typeof media === "number") return undefined
  return typeof media.url === "string" && media.url.trim() ? media.url : undefined
}

function mapDataSources(
  value: unknown[] | null | undefined,
  fallback: GrowthAssessmentDataSource[],
): GrowthAssessmentDataSource[] {
  return mergeArray(value, fallback).map((item, index) => {
    const doc = item as Partial<GrowthAssessmentDataSource>
    const fb = fallback[index] ?? fallback[0]
    return {
      icon: withFallback(doc.icon, fb.icon),
      title: withFallback(doc.title, fb.title),
      description: withFallback(doc.description, fb.description),
    }
  })
}

function mapUseCases(
  value: unknown[] | null | undefined,
  fallback: GrowthAssessmentUseCase[],
): GrowthAssessmentUseCase[] {
  return mergeArray(value, fallback).map((item, index) => {
    const doc = item as Partial<GrowthAssessmentUseCase>
    const fb = fallback[index] ?? fallback[0]
    return {
      number: withFallback(doc.number, fb.number),
      title: withFallback(doc.title, fb.title),
      description: withFallback(doc.description, fb.description),
    }
  })
}

function mapPractitioners(
  value: unknown[] | null | undefined,
  fallback: GrowthAssessmentPractitioner[],
): GrowthAssessmentPractitioner[] {
  return mergeArray(value, fallback).map((item, index) => {
    const doc = item as Partial<GrowthAssessmentPractitioner> & {
      photo?: number | MediaLike | null
    }
    const fb = fallback[index] ?? fallback[0]
    const photoUrl = resolveMediaUrl(doc.photo) ?? fb.photoUrl
    const caseStudyUrl =
      typeof doc.caseStudyUrl === "string" && doc.caseStudyUrl.trim()
        ? doc.caseStudyUrl.trim()
        : undefined

    return {
      name: withFallback(doc.name, fb.name),
      specialty: withFallback(doc.specialty, fb.specialty),
      quote: withFallback(doc.quote, fb.quote),
      ...(photoUrl ? { photoUrl } : {}),
      initials: withFallback(doc.initials, fb.initials),
      ...(caseStudyUrl
        ? {
            caseStudyUrl,
            caseStudyLabel: withFallback(
              typeof doc.caseStudyLabel === "string" ? doc.caseStudyLabel : undefined,
              fb.caseStudyLabel ?? "Read case study",
            ),
          }
        : {}),
    }
  })
}

function mapGrowthAssessmentContent(doc: Record<string, unknown>): GrowthAssessmentContent {
  const defaults = defaultGrowthAssessmentContent

  return {
    heroEyebrow: withFallback(doc.heroEyebrow as string, defaults.heroEyebrow),
    heroHeadline: withFallback(doc.heroHeadline as string, defaults.heroHeadline),
    heroDescription: withFallback(doc.heroDescription as string, defaults.heroDescription),
    heroPrimaryCta: withFallback(doc.heroPrimaryCta as string, defaults.heroPrimaryCta),
    heroSecondaryCta: withFallback(doc.heroSecondaryCta as string, defaults.heroSecondaryCta),
    heroNote: withFallback(doc.heroNote as string, defaults.heroNote),
    heroSamplePractice: withFallback(doc.heroSamplePractice as string, defaults.heroSamplePractice),
    heroSampleScore:
      typeof doc.heroSampleScore === "number" ? doc.heroSampleScore : defaults.heroSampleScore,
    heroTopOpportunity: withFallback(doc.heroTopOpportunity as string, defaults.heroTopOpportunity),
    heroSuggestedRange: withFallback(doc.heroSuggestedRange as string, defaults.heroSuggestedRange),
    heroPriorityActions: mapStringItems(
      doc.heroPriorityActions as unknown[] | null | undefined,
      defaults.heroPriorityActions,
    ),
    problemEyebrow: withFallback(doc.problemEyebrow as string, defaults.problemEyebrow),
    problemHeadline: withFallback(doc.problemHeadline as string, defaults.problemHeadline),
    problemDescription: withFallback(doc.problemDescription as string, defaults.problemDescription),
    problemStages: mapStringItems(
      doc.problemStages as unknown[] | null | undefined,
      defaults.problemStages,
    ),
    problemHighlightStage: withFallback(
      doc.problemHighlightStage as string,
      defaults.problemHighlightStage,
    ),
    problemFootnote: withFallback(doc.problemFootnote as string, defaults.problemFootnote),
    assessEyebrow: withFallback(doc.assessEyebrow as string, defaults.assessEyebrow),
    assessHeadline: withFallback(doc.assessHeadline as string, defaults.assessHeadline),
    assessDescription: withFallback(doc.assessDescription as string, defaults.assessDescription),
    assessItems: mapIconCards(doc.assessItems as unknown[] | null | undefined, defaults.assessItems),
    dataEyebrow: withFallback(doc.dataEyebrow as string, defaults.dataEyebrow),
    dataHeadline: withFallback(doc.dataHeadline as string, defaults.dataHeadline),
    dataDescription: withFallback(doc.dataDescription as string, defaults.dataDescription),
    dataCredibilityLine: withFallback(doc.dataCredibilityLine as string, defaults.dataCredibilityLine),
    dataSources: mapDataSources(doc.dataSources as unknown[] | null | undefined, defaults.dataSources),
    dataHumanReviewLabel: withFallback(
      doc.dataHumanReviewLabel as string,
      defaults.dataHumanReviewLabel,
    ),
    dataFlowSteps: mapStringItems(
      doc.dataFlowSteps as unknown[] | null | undefined,
      defaults.dataFlowSteps,
    ),
    dataSourcesNote: withFallback(doc.dataSourcesNote as string, defaults.dataSourcesNote),
    useCasesHeadline: withFallback(doc.useCasesHeadline as string, defaults.useCasesHeadline),
    useCasesDescription: withFallback(
      doc.useCasesDescription as string,
      defaults.useCasesDescription,
    ),
    useCases: mapUseCases(doc.useCases as unknown[] | null | undefined, defaults.useCases),
    dataBridgeLine: withFallback(doc.dataBridgeLine as string, defaults.dataBridgeLine),
    howEyebrow: withFallback(doc.howEyebrow as string, defaults.howEyebrow),
    howHeadline: withFallback(doc.howHeadline as string, defaults.howHeadline),
    howSteps: mapSteps(doc.howSteps as unknown[] | null | undefined, defaults.howSteps),
    howNote: withFallback(doc.howNote as string, defaults.howNote),
    reportEyebrow: withFallback(doc.reportEyebrow as string, defaults.reportEyebrow),
    reportHeadline: withFallback(doc.reportHeadline as string, defaults.reportHeadline),
    reportDescription: withFallback(doc.reportDescription as string, defaults.reportDescription),
    reportChecklist: mapStringItems(
      doc.reportChecklist as unknown[] | null | undefined,
      defaults.reportChecklist,
    ),
    reportSamplePlanLabel: withFallback(
      doc.reportSamplePlanLabel as string,
      defaults.reportSamplePlanLabel,
    ),
    reportSamplePlanUrl: withFallback(
      doc.reportSamplePlanUrl as string,
      defaults.reportSamplePlanUrl,
    ),
    financialEyebrow: withFallback(doc.financialEyebrow as string, defaults.financialEyebrow),
    financialHeadline: withFallback(doc.financialHeadline as string, defaults.financialHeadline),
    financialDescription: withFallback(
      doc.financialDescription as string,
      defaults.financialDescription,
    ),
    financialDisclaimer: withFallback(
      doc.financialDisclaimer as string,
      defaults.financialDisclaimer,
    ),
    financialScenarios: mapScenarios(
      doc.financialScenarios as unknown[] | null | undefined,
      defaults.financialScenarios,
    ),
    whoEyebrow: withFallback(doc.whoEyebrow as string, defaults.whoEyebrow),
    whoHeadline: withFallback(doc.whoHeadline as string, defaults.whoHeadline),
    whoFitItems: mapStringItems(
      doc.whoFitItems as unknown[] | null | undefined,
      defaults.whoFitItems,
    ),
    whoNotFitItems: mapStringItems(
      doc.whoNotFitItems as unknown[] | null | undefined,
      defaults.whoNotFitItems,
    ),
    whoNotFitNote: withFallback(doc.whoNotFitNote as string, defaults.whoNotFitNote),
    whyEyebrow: withFallback(doc.whyEyebrow as string, defaults.whyEyebrow),
    whyHeadline: withFallback(doc.whyHeadline as string, defaults.whyHeadline),
    whyDescription: withFallback(doc.whyDescription as string, defaults.whyDescription),
    whyItems: mapStringItems(doc.whyItems as unknown[] | null | undefined, defaults.whyItems),
    findingsEyebrow: withFallback(doc.findingsEyebrow as string, defaults.findingsEyebrow),
    findingsHeadline: withFallback(doc.findingsHeadline as string, defaults.findingsHeadline),
    findingsItems: mapFindings(
      doc.findingsItems as unknown[] | null | undefined,
      defaults.findingsItems,
    ),
    faqEyebrow: withFallback(doc.faqEyebrow as string, defaults.faqEyebrow),
    faqHeadline: withFallback(doc.faqHeadline as string, defaults.faqHeadline),
    faqItems: mapFaq(doc.faqItems as unknown[] | null | undefined, defaults.faqItems),
    practitionersEyebrow: withFallback(
      doc.practitionersEyebrow as string,
      defaults.practitionersEyebrow,
    ),
    practitionersHeadline: withFallback(
      doc.practitionersHeadline as string,
      defaults.practitionersHeadline,
    ),
    practitionersDescription: withFallback(
      doc.practitionersDescription as string,
      defaults.practitionersDescription,
    ),
    practitioners: mapPractitioners(
      doc.practitioners as unknown[] | null | undefined,
      defaults.practitioners,
    ),
    formEyebrow: withFallback(doc.formEyebrow as string, defaults.formEyebrow),
    formHeadline: withFallback(doc.formHeadline as string, defaults.formHeadline),
    formDescription: withFallback(doc.formDescription as string, defaults.formDescription),
    formBullets: mapStringItems(
      doc.formBullets as unknown[] | null | undefined,
      defaults.formBullets,
    ),
    formQuote: withFallback(doc.formQuote as string, defaults.formQuote),
    formCtaLabel: withFallback(doc.formCtaLabel as string, defaults.formCtaLabel),
    sectionCtaLabel: withFallback(doc.sectionCtaLabel as string, defaults.sectionCtaLabel),
    formShowInvestmentStep:
      typeof doc.formShowInvestmentStep === "boolean"
        ? doc.formShowInvestmentStep
        : defaults.formShowInvestmentStep,
    formInvestmentOptions: mapStringItems(
      doc.formInvestmentOptions as unknown[] | null | undefined,
      defaults.formInvestmentOptions,
    ),
    formProcessingSteps: mapStringItems(
      doc.formProcessingSteps as unknown[] | null | undefined,
      defaults.formProcessingSteps,
    ),
    seoTitle: withFallback(doc.seoTitle as string, defaults.seoTitle),
    seoDescription: withFallback(doc.seoDescription as string, defaults.seoDescription),
  }
}

async function fetchGrowthAssessmentContent(): Promise<GrowthAssessmentContent> {
  if (!process.env.PAYLOAD_SECRET) {
    return defaultGrowthAssessmentContent
  }

  try {
    const { default: config } = await import("@payload-config")
    const { getPayload } = await import("payload")
    const payload = await getPayload({ config })
    const growthAssessment = await payload.findGlobal({
      slug: "growth-assessment",
      depth: 1,
    })

    return mapGrowthAssessmentContent(growthAssessment as unknown as Record<string, unknown>)
  } catch (error) {
    console.error("[payload] Failed to load growth assessment content:", error)
    return defaultGrowthAssessmentContent
  }
}

export const getGrowthAssessmentContent = cache(fetchGrowthAssessmentContent)
export type { GrowthAssessmentContent }
