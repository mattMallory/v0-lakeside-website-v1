export async function revalidateSite() {
  try {
    const { revalidatePath } = await import("next/cache")
    revalidatePath("/", "layout")
    revalidatePath("/consultation")
    revalidatePath("/about")
    revalidatePath("/services")
    revalidatePath("/blog")
    revalidatePath("/blog", "page")
    revalidatePath("/privacy")
    revalidatePath("/terms")
  } catch {
    // Outside Next.js request context (e.g. migrate CLI) — ignore.
  }
}
