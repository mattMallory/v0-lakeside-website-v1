export async function revalidateSite() {
  try {
    const { revalidatePath } = await import("next/cache")
    revalidatePath("/", "layout")
    revalidatePath("/consultation")
    revalidatePath("/consultation/thank-you")
    revalidatePath("/demo")
    revalidatePath("/about")
    revalidatePath("/services")
    revalidatePath("/blog")
    revalidatePath("/blog", "page")
    revalidatePath("/privacy")
    revalidatePath("/terms")
    revalidatePath("/schedule")
  } catch {
    // Outside Next.js request context (e.g. migrate CLI) — ignore.
  }
}
