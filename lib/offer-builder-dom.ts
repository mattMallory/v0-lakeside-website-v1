import type { OfferBuilderState } from "@/lib/offer-builder"
import { defaultOfferBuilderState } from "@/lib/offer-builder"

export function offerInputId(group: string, value: string) {
  return `ob-${group}-${value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}`
}

export function readOfferBuilderStateFromDom(root: HTMLElement): OfferBuilderState {
  const audience =
    (root.querySelector("#ob-audience") as HTMLSelectElement | null)?.value ??
    defaultOfferBuilderState.audience
  const firstStep =
    (root.querySelector("#ob-first-step") as HTMLSelectElement | null)?.value ??
    defaultOfferBuilderState.firstStep

  const concernCustom =
    (root.querySelector("#ob-concern-custom") as HTMLInputElement | null)?.value.trim() ?? ""
  const concernRadio = root.querySelector<HTMLInputElement>('input[name="ob-concern"]:checked')
  const concern = concernCustom ? "" : (concernRadio?.value ?? "")

  const happens = Array.from(
    root.querySelectorAll<HTMLInputElement>('input[name="ob-happen"]:checked'),
  ).map((input) => input.value)

  const takeaway =
    root.querySelector<HTMLInputElement>('input[name="ob-takeaway"]:checked')?.value ??
    defaultOfferBuilderState.takeaway

  const action =
    root.querySelector<HTMLInputElement>('input[name="ob-action"]:checked')?.value ??
    defaultOfferBuilderState.action

  const price =
    root.querySelector<HTMLInputElement>('input[name="ob-price"]:checked')?.value ??
    defaultOfferBuilderState.price

  return {
    audience,
    concern,
    concernCustom,
    firstStep,
    happens,
    takeaway,
    action,
    price,
  }
}

export function syncOfferBuilderHappensLimit(root: HTMLElement) {
  const checkedCount = root.querySelectorAll('input[name="ob-happen"]:checked').length

  root.querySelectorAll<HTMLInputElement>('input[name="ob-happen"]').forEach((input) => {
    input.disabled = !input.checked && checkedCount >= 3
    const label = root.querySelector<HTMLLabelElement>(`label[for="${input.id}"]`)
    if (label) {
      if (input.disabled) label.setAttribute("data-ob-disabled", "true")
      else label.removeAttribute("data-ob-disabled")
    }
  })
}

export function applyOfferBuilderInputSideEffects(root: HTMLElement, target: HTMLInputElement) {
  if (target.name === "ob-happen" && target.type === "checkbox" && target.checked) {
    const checkedCount = root.querySelectorAll('input[name="ob-happen"]:checked').length
    if (checkedCount > 3) {
      target.checked = false
      return false
    }
  }

  if (target.name === "ob-price" && target.type === "checkbox" && target.checked) {
    root.querySelectorAll<HTMLInputElement>('input[name="ob-price"]').forEach((input) => {
      if (input !== target) input.checked = false
    })
  }

  if (target.name === "ob-concern" && target.checked) {
    const custom = root.querySelector("#ob-concern-custom") as HTMLInputElement | null
    if (custom) custom.value = ""
  }

  if (target.id === "ob-concern-custom") {
    root.querySelectorAll<HTMLInputElement>('input[name="ob-concern"]').forEach((input) => {
      input.checked = false
    })
  }

  return true
}

const INTERACTIVE_SELECTOR =
  ".offer-builder-chip-label, .offer-builder-radio-label, .offer-builder-action-label, .offer-builder-native-input, .offer-builder-select, .offer-builder-concern-custom, #ob-concern-custom"

export function attachOfferBuilderFormListeners(
  root: HTMLElement,
  onStateChange: (updater: (state: OfferBuilderState) => OfferBuilderState) => void,
) {
  function syncFromDom() {
    syncOfferBuilderHappensLimit(root)
    const next = readOfferBuilderStateFromDom(root)
    onStateChange(() => next)
  }

  function handleNativeInput(event: Event) {
    const target = event.target
    if (!(target instanceof HTMLElement) || !root.contains(target)) return

    if (target instanceof HTMLSelectElement) {
      syncFromDom()
      return
    }

    if (!(target instanceof HTMLInputElement)) return
    if (!target.classList.contains("offer-builder-native-input") && target.id !== "ob-concern-custom") {
      return
    }

    if (!applyOfferBuilderInputSideEffects(root, target)) return

    syncFromDom()
  }

  function handlePointerSync(event: Event) {
    const target = event.target
    if (!(target instanceof Element)) return
    if (!target.closest(INTERACTIVE_SELECTOR)) return

    window.setTimeout(() => {
      syncFromDom()
    }, 0)
  }

  root.addEventListener("change", handleNativeInput, true)
  root.addEventListener("input", handleNativeInput, true)
  root.addEventListener("click", handlePointerSync, true)
  root.addEventListener("touchend", handlePointerSync, true)

  syncOfferBuilderHappensLimit(root)

  return () => {
    root.removeEventListener("change", handleNativeInput, true)
    root.removeEventListener("input", handleNativeInput, true)
    root.removeEventListener("click", handlePointerSync, true)
    root.removeEventListener("touchend", handlePointerSync, true)
  }
}
