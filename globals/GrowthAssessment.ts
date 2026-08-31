import type { GlobalConfig } from "payload"

import { defaultGrowthAssessmentContent } from "@/lib/growth-assessment-defaults"
import { iconOptions } from "@/lib/icons"
import { revalidateSite } from "@/lib/revalidate-site"

const stringListField = (name: string, label: string, defaults: string[]) => ({
  name,
  type: "array" as const,
  label,
  defaultValue: defaults.map((value) => ({ label: value })),
  fields: [
    {
      name: "label",
      type: "text" as const,
      required: true,
    },
  ],
})

export const GrowthAssessment: GlobalConfig = {
  slug: "growth-assessment",
  label: "Growth Assessment",
  access: {
    read: () => true,
  },
  admin: {
    description:
      "Business Growth Assessment page at /growth-plan. Linked from the main nav as “Get Your Growth Plan”.",
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
          label: "Hero",
          fields: [
            { name: "heroEyebrow", type: "text", defaultValue: defaultGrowthAssessmentContent.heroEyebrow },
            { name: "heroHeadline", type: "text", required: true, defaultValue: defaultGrowthAssessmentContent.heroHeadline },
            { name: "heroDescription", type: "textarea", defaultValue: defaultGrowthAssessmentContent.heroDescription },
            { name: "heroPrimaryCta", type: "text", defaultValue: defaultGrowthAssessmentContent.heroPrimaryCta },
            { name: "heroSecondaryCta", type: "text", defaultValue: defaultGrowthAssessmentContent.heroSecondaryCta },
            { name: "heroNote", type: "text", defaultValue: defaultGrowthAssessmentContent.heroNote },
            { name: "heroSamplePractice", type: "text", defaultValue: defaultGrowthAssessmentContent.heroSamplePractice },
            { name: "heroSampleScore", type: "number", defaultValue: defaultGrowthAssessmentContent.heroSampleScore },
            { name: "heroTopOpportunity", type: "text", defaultValue: defaultGrowthAssessmentContent.heroTopOpportunity },
            { name: "heroSuggestedRange", type: "text", defaultValue: defaultGrowthAssessmentContent.heroSuggestedRange },
            stringListField(
              "heroPriorityActions",
              "Priority Actions (sample card)",
              defaultGrowthAssessmentContent.heroPriorityActions,
            ),
          ],
        },
        {
          label: "Problem",
          fields: [
            { name: "problemEyebrow", type: "text", defaultValue: defaultGrowthAssessmentContent.problemEyebrow },
            { name: "problemHeadline", type: "text", defaultValue: defaultGrowthAssessmentContent.problemHeadline },
            { name: "problemDescription", type: "textarea", defaultValue: defaultGrowthAssessmentContent.problemDescription },
            stringListField("problemStages", "Pipeline Stages", defaultGrowthAssessmentContent.problemStages),
            { name: "problemHighlightStage", type: "text", defaultValue: defaultGrowthAssessmentContent.problemHighlightStage },
            { name: "problemFootnote", type: "textarea", defaultValue: defaultGrowthAssessmentContent.problemFootnote },
          ],
        },
        {
          label: "What We Assess",
          fields: [
            { name: "assessEyebrow", type: "text", defaultValue: defaultGrowthAssessmentContent.assessEyebrow },
            { name: "assessHeadline", type: "text", defaultValue: defaultGrowthAssessmentContent.assessHeadline },
            { name: "assessDescription", type: "textarea", defaultValue: defaultGrowthAssessmentContent.assessDescription },
            {
              name: "assessItems",
              type: "array",
              label: "Assessment Areas",
              defaultValue: defaultGrowthAssessmentContent.assessItems,
              fields: [
                { name: "icon", type: "select", options: iconOptions, required: true },
                { name: "title", type: "text", required: true },
                { name: "description", type: "textarea", required: true },
              ],
            },
          ],
        },
        {
          label: "Real Data",
          fields: [
            { name: "dataEyebrow", type: "text", defaultValue: defaultGrowthAssessmentContent.dataEyebrow },
            { name: "dataHeadline", type: "text", defaultValue: defaultGrowthAssessmentContent.dataHeadline },
            { name: "dataDescription", type: "textarea", defaultValue: defaultGrowthAssessmentContent.dataDescription },
            { name: "dataCredibilityLine", type: "text", defaultValue: defaultGrowthAssessmentContent.dataCredibilityLine },
            {
              name: "dataSources",
              type: "array",
              label: "Data Sources",
              defaultValue: defaultGrowthAssessmentContent.dataSources,
              fields: [
                { name: "icon", type: "select", options: iconOptions, required: true },
                { name: "title", type: "text", required: true },
                { name: "description", type: "textarea", required: true },
              ],
            },
            {
              name: "dataHumanReviewLabel",
              type: "text",
              defaultValue: defaultGrowthAssessmentContent.dataHumanReviewLabel,
            },
            stringListField(
              "dataFlowSteps",
              "Data Flow Steps",
              defaultGrowthAssessmentContent.dataFlowSteps,
            ),
            { name: "dataSourcesNote", type: "textarea", defaultValue: defaultGrowthAssessmentContent.dataSourcesNote },
            { name: "useCasesHeadline", type: "text", defaultValue: defaultGrowthAssessmentContent.useCasesHeadline },
            { name: "useCasesDescription", type: "textarea", defaultValue: defaultGrowthAssessmentContent.useCasesDescription },
            {
              name: "useCases",
              type: "array",
              label: "Use Cases",
              defaultValue: defaultGrowthAssessmentContent.useCases,
              fields: [
                { name: "number", type: "text", required: true },
                { name: "title", type: "text", required: true },
                { name: "description", type: "textarea", required: true },
              ],
            },
            { name: "dataBridgeLine", type: "text", defaultValue: defaultGrowthAssessmentContent.dataBridgeLine },
          ],
        },
        {
          label: "How It Works",
          fields: [
            { name: "howEyebrow", type: "text", defaultValue: defaultGrowthAssessmentContent.howEyebrow },
            { name: "howHeadline", type: "text", defaultValue: defaultGrowthAssessmentContent.howHeadline },
            {
              name: "howSteps",
              type: "array",
              defaultValue: defaultGrowthAssessmentContent.howSteps,
              fields: [
                { name: "label", type: "text", required: true },
                { name: "title", type: "text", required: true },
                { name: "description", type: "textarea", required: true },
              ],
            },
            { name: "howNote", type: "textarea", defaultValue: defaultGrowthAssessmentContent.howNote },
          ],
        },
        {
          label: "Sample Report",
          fields: [
            { name: "reportEyebrow", type: "text", defaultValue: defaultGrowthAssessmentContent.reportEyebrow },
            { name: "reportHeadline", type: "text", defaultValue: defaultGrowthAssessmentContent.reportHeadline },
            { name: "reportDescription", type: "textarea", defaultValue: defaultGrowthAssessmentContent.reportDescription },
            stringListField("reportChecklist", "Report Checklist", defaultGrowthAssessmentContent.reportChecklist),
            { name: "reportSamplePlanLabel", type: "text", defaultValue: defaultGrowthAssessmentContent.reportSamplePlanLabel },
            { name: "reportSamplePlanUrl", type: "text", defaultValue: defaultGrowthAssessmentContent.reportSamplePlanUrl },
          ],
        },
        {
          label: "Financial",
          fields: [
            { name: "financialEyebrow", type: "text", defaultValue: defaultGrowthAssessmentContent.financialEyebrow },
            { name: "financialHeadline", type: "text", defaultValue: defaultGrowthAssessmentContent.financialHeadline },
            { name: "financialDescription", type: "textarea", defaultValue: defaultGrowthAssessmentContent.financialDescription },
            { name: "financialDisclaimer", type: "textarea", defaultValue: defaultGrowthAssessmentContent.financialDisclaimer },
            {
              name: "financialScenarios",
              type: "array",
              defaultValue: defaultGrowthAssessmentContent.financialScenarios,
              fields: [
                { name: "title", type: "text", required: true },
                { name: "description", type: "textarea", required: true },
                { name: "featured", type: "checkbox", defaultValue: false },
                {
                  name: "rows",
                  type: "array",
                  fields: [
                    { name: "label", type: "text", required: true },
                    { name: "value", type: "text", required: true },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: "Who & Why",
          fields: [
            { name: "whoEyebrow", type: "text", defaultValue: defaultGrowthAssessmentContent.whoEyebrow },
            { name: "whoHeadline", type: "text", defaultValue: defaultGrowthAssessmentContent.whoHeadline },
            stringListField("whoFitItems", "Good Fit If", defaultGrowthAssessmentContent.whoFitItems),
            stringListField("whoNotFitItems", "Not a Fit If", defaultGrowthAssessmentContent.whoNotFitItems),
            { name: "whoNotFitNote", type: "textarea", defaultValue: defaultGrowthAssessmentContent.whoNotFitNote },
            { name: "whyEyebrow", type: "text", defaultValue: defaultGrowthAssessmentContent.whyEyebrow },
            { name: "whyHeadline", type: "text", defaultValue: defaultGrowthAssessmentContent.whyHeadline },
            { name: "whyDescription", type: "textarea", defaultValue: defaultGrowthAssessmentContent.whyDescription },
            stringListField("whyItems", "Why Lakeside Bullets", defaultGrowthAssessmentContent.whyItems),
          ],
        },
        {
          label: "Findings & FAQ",
          fields: [
            { name: "findingsEyebrow", type: "text", defaultValue: defaultGrowthAssessmentContent.findingsEyebrow },
            { name: "findingsHeadline", type: "text", defaultValue: defaultGrowthAssessmentContent.findingsHeadline },
            {
              name: "findingsItems",
              type: "array",
              defaultValue: defaultGrowthAssessmentContent.findingsItems,
              fields: [
                { name: "title", type: "text", required: true },
                { name: "description", type: "textarea", required: true },
                { name: "consequence", type: "textarea", required: true },
                { name: "action", type: "textarea", required: true },
              ],
            },
            { name: "faqEyebrow", type: "text", defaultValue: defaultGrowthAssessmentContent.faqEyebrow },
            { name: "faqHeadline", type: "text", defaultValue: defaultGrowthAssessmentContent.faqHeadline },
            {
              name: "faqItems",
              type: "array",
              defaultValue: defaultGrowthAssessmentContent.faqItems,
              fields: [
                { name: "question", type: "text", required: true },
                { name: "answer", type: "textarea", required: true },
              ],
            },
          ],
        },
        {
          label: "Practitioners",
          fields: [
            {
              name: "practitionersEyebrow",
              type: "text",
              defaultValue: defaultGrowthAssessmentContent.practitionersEyebrow,
            },
            {
              name: "practitionersHeadline",
              type: "text",
              defaultValue: defaultGrowthAssessmentContent.practitionersHeadline,
            },
            {
              name: "practitionersDescription",
              type: "textarea",
              defaultValue: defaultGrowthAssessmentContent.practitionersDescription,
            },
            {
              name: "practitioners",
              type: "array",
              label: "Practitioner Cards",
              defaultValue: defaultGrowthAssessmentContent.practitioners,
              fields: [
                { name: "name", type: "text", required: true },
                { name: "specialty", type: "text", required: true },
                { name: "quote", type: "textarea", required: true },
                {
                  name: "photo",
                  type: "upload",
                  relationTo: "media",
                  label: "Photo",
                },
                {
                  name: "initials",
                  type: "text",
                  label: "Initials (fallback when no photo)",
                },
              ],
            },
          ],
        },
        {
          label: "Form & CTA",
          fields: [
            { name: "formEyebrow", type: "text", defaultValue: defaultGrowthAssessmentContent.formEyebrow },
            { name: "formHeadline", type: "text", defaultValue: defaultGrowthAssessmentContent.formHeadline },
            { name: "formDescription", type: "textarea", defaultValue: defaultGrowthAssessmentContent.formDescription },
            stringListField("formBullets", "Form Bullets", defaultGrowthAssessmentContent.formBullets),
            { name: "formQuote", type: "textarea", defaultValue: defaultGrowthAssessmentContent.formQuote },
            { name: "formCtaLabel", type: "text", defaultValue: defaultGrowthAssessmentContent.formCtaLabel },
            { name: "sectionCtaLabel", type: "text", label: "Section CTA Label", defaultValue: defaultGrowthAssessmentContent.sectionCtaLabel },
            { name: "formShowInvestmentStep", type: "checkbox", defaultValue: defaultGrowthAssessmentContent.formShowInvestmentStep },
            stringListField(
              "formInvestmentOptions",
              "Investment Options",
              defaultGrowthAssessmentContent.formInvestmentOptions,
            ),
            stringListField(
              "formProcessingSteps",
              "Processing Steps (after submit)",
              defaultGrowthAssessmentContent.formProcessingSteps,
            ),
          ],
        },
        {
          label: "SEO",
          fields: [
            { name: "seoTitle", type: "text", defaultValue: defaultGrowthAssessmentContent.seoTitle },
            { name: "seoDescription", type: "textarea", defaultValue: defaultGrowthAssessmentContent.seoDescription },
          ],
        },
      ],
    },
  ],
}
