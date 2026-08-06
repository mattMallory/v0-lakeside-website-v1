import type { Block } from "payload"

import { defaultPatientJourneyBlock } from "@/lib/patient-journey-defaults"

const patientJourneyStepFields = [
  {
    name: "label",
    type: "text" as const,
    label: "Step Label",
    required: true,
  },
  {
    name: "teaser",
    type: "text" as const,
    label: "Summary Line",
    required: true,
  },
  {
    name: "badTitle",
    type: "text" as const,
    label: "Typical Approach Label",
    defaultValue: "Typical approach",
  },
  {
    name: "badDescription",
    type: "textarea" as const,
    label: "Typical Approach Description",
    required: true,
  },
  {
    name: "goodTitle",
    type: "text" as const,
    label: "What Works Label",
    required: true,
  },
  {
    name: "goodDescription",
    type: "textarea" as const,
    label: "What Works Description",
    required: true,
  },
  {
    name: "insight",
    type: "text" as const,
    label: "Insight Line",
    required: true,
  },
]

export const PatientJourneyBlock: Block = {
  slug: "patientJourney",
  interfaceName: "PatientJourneyBlock",
  labels: {
    singular: "Patient Journey",
    plural: "Patient Journeys",
  },
  fields: [
    {
      name: "eyebrow",
      type: "text",
      defaultValue: defaultPatientJourneyBlock.eyebrow,
    },
    {
      name: "title",
      type: "text",
      defaultValue: defaultPatientJourneyBlock.title,
      required: true,
    },
    {
      name: "description",
      type: "textarea",
      defaultValue: defaultPatientJourneyBlock.description,
    },
    {
      name: "steps",
      type: "array",
      label: "Journey Steps",
      minRows: 1,
      maxRows: 6,
      defaultValue: defaultPatientJourneyBlock.steps,
      fields: patientJourneyStepFields,
    },
    {
      name: "completionTitle",
      type: "text",
      defaultValue: defaultPatientJourneyBlock.completionTitle,
    },
    {
      name: "completionDescription",
      type: "textarea",
      defaultValue: defaultPatientJourneyBlock.completionDescription,
    },
    {
      name: "ctaLabel",
      type: "text",
      defaultValue: defaultPatientJourneyBlock.ctaLabel,
    },
    {
      name: "ctaUrl",
      type: "text",
      defaultValue: defaultPatientJourneyBlock.ctaUrl,
    },
  ],
}
