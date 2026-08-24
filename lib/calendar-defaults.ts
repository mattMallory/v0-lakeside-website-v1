export type CalendarPageContent = {
  eyebrow: string
  title: string
  description: string
  embedCode: string
  seoTitle: string
  seoDescription: string
}

export const defaultCalendarContent: CalendarPageContent = {
  eyebrow: "Schedule",
  title: "Book a time that works for you",
  description:
    "Choose an available time below. You’ll receive a confirmation email once your appointment is booked.",
  embedCode: "",
  seoTitle: "Schedule | Lakeside",
  seoDescription: "Book a growth consultation with Lakeside.",
}
