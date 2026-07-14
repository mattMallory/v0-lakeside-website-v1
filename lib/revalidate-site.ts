export async function revalidateSite() {
  try {
    const { revalidatePath } = await import("next/cache")
    revalidatePath("/", "layout")
    revalidatePath("/consultation")
  } catch {
    // Outside Next.js request context (e.g. migrate CLI) — ignore.
  }
}
