import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

// Generates public/tokens.css from the @theme block in app/globals.css, so a design
// mockup can @import the same values the site ships.
//
// Why this parses structurally rather than with a regex: scripts/sync-layout-scripts.mjs
// matches an exact source shape and breaks when an unrelated file is reformatted. That
// fragility is a known cost in this repository. This walks the stylesheet character by
// character, tracking comments, strings, parentheses and braces, so reformatting, new
// comments, extra whitespace or a new token category do not affect it.

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const sourcePath = path.join(root, "app", "globals.css")
const sourceLabel = "app/globals.css"
const outputPath = path.join(root, "public", "tokens.css")

// ---------------------------------------------------------------- structural scanning

/**
 * Index just past the comment or string starting at `i`, or `i` itself when nothing
 * special starts there. Every scan below routes through this so that braces, semicolons
 * and parentheses inside comments and strings are never mistaken for syntax.
 */
function skipCommentOrString(css, i) {
  if (css.startsWith("/*", i)) {
    const end = css.indexOf("*/", i + 2)
    return end === -1 ? css.length : end + 2
  }

  const quote = css[i]
  if (quote === '"' || quote === "'") {
    let j = i + 1
    while (j < css.length) {
      if (css[j] === "\\") {
        j += 2
        continue
      }
      if (css[j] === quote) return j + 1
      j += 1
    }
    return css.length
  }

  return i
}

/** Index of the `}` matching the `{` at `openIndex`. */
function matchBrace(css, openIndex) {
  let depth = 0

  for (let i = openIndex; i < css.length; i += 1) {
    const skipped = skipCommentOrString(css, i)
    if (skipped !== i) {
      i = skipped - 1
      continue
    }

    if (css[i] === "{") depth += 1
    else if (css[i] === "}") {
      depth -= 1
      if (depth === 0) return i
    }
  }

  throw new Error(`Unbalanced braces in ${sourceLabel} starting at offset ${openIndex}.`)
}

/**
 * Every top-level block, as { prelude, inner }. The prelude is the selector or at-rule
 * text before the brace — `:root`, `@theme inline`, `@media (...)` — so callers can pick
 * blocks by meaning rather than by line number.
 */
export function topLevelBlocks(css) {
  const blocks = []
  let preludeStart = 0

  for (let i = 0; i < css.length; i += 1) {
    const skipped = skipCommentOrString(css, i)
    if (skipped !== i) {
      i = skipped - 1
      continue
    }

    if (css[i] === ";") {
      preludeStart = i + 1
      continue
    }

    if (css[i] === "{") {
      const close = matchBrace(css, i)
      blocks.push({
        // Comments preceding a block are not part of its selector or at-rule, so
        // strip them — otherwise a note written above `@theme` would hide the block.
        prelude: css.slice(preludeStart, i).replace(/\/\*[\s\S]*?\*\//g, " ").trim(),
        inner: css.slice(i + 1, close),
      })
      i = close
      preludeStart = close + 1
    }
  }

  return blocks
}

// ---------------------------------------------------------------- declaration walking

/**
 * Walks a block body into an ordered list of entries:
 *   { kind: "comment", text }      — a standalone comment between declarations
 *   { kind: "decl", name, value, trailingComment }
 *
 * Nested blocks inside the body are skipped: a custom property is a flat declaration, and
 * anything brace-wrapped in here is not a token.
 */
export function parseDeclarations(inner) {
  const entries = []
  let buffer = ""
  let bufferStart = 0
  let parenDepth = 0

  const pendingComments = []

  for (let i = 0; i < inner.length; i += 1) {
    if (inner.startsWith("/*", i)) {
      const end = inner.indexOf("*/", i + 2)
      const stop = end === -1 ? inner.length : end + 2
      const text = inner.slice(i, stop)

      // Same line as the previous declaration -> trailing comment for it.
      const gap = inner.slice(bufferStart, i)
      const last = entries[entries.length - 1]
      if (
        buffer.trim() === "" &&
        last &&
        last.kind === "decl" &&
        !last.trailingComment &&
        !gap.includes("\n")
      ) {
        last.trailingComment = text
      } else {
        pendingComments.push(text)
      }

      i = stop - 1
      bufferStart = stop
      continue
    }

    const skipped = skipCommentOrString(inner, i)
    if (skipped !== i) {
      buffer += inner.slice(i, skipped)
      i = skipped - 1
      continue
    }

    const ch = inner[i]

    if (ch === "(") parenDepth += 1
    else if (ch === ")") parenDepth = Math.max(0, parenDepth - 1)

    if (ch === "{") {
      // Not a token declaration — skip the nested block wholesale.
      const close = matchBrace(inner, i)
      buffer = ""
      i = close
      bufferStart = close + 1
      continue
    }

    if (ch === ";" && parenDepth === 0) {
      const text = buffer.trim()
      buffer = ""
      bufferStart = i + 1

      if (text === "") continue

      const colon = text.indexOf(":")
      if (colon === -1) continue

      const name = text.slice(0, colon).trim()
      const value = text.slice(colon + 1).trim()

      for (const comment of pendingComments) entries.push({ kind: "comment", text: comment })
      pendingComments.length = 0

      entries.push({ kind: "decl", name, value, trailingComment: null })
      continue
    }

    buffer += ch
  }

  // A declaration with no closing semicolon (legal for the last one in a block).
  const tail = buffer.trim()
  if (tail !== "" && tail.includes(":")) {
    const colon = tail.indexOf(":")
    for (const comment of pendingComments) entries.push({ kind: "comment", text: comment })
    pendingComments.length = 0
    entries.push({
      kind: "decl",
      name: tail.slice(0, colon).trim(),
      value: tail.slice(colon + 1).trim(),
      trailingComment: null,
    })
  } else {
    for (const comment of pendingComments) entries.push({ kind: "comment", text: comment })
  }

  return entries
}

// ---------------------------------------------------------------- var() resolution

/**
 * Replaces every var(--name[, fallback]) in `value` with the referenced value.
 *
 * The @theme block is written as indirections — `--color-border: var(--border)` — with the
 * literal sitting in :root. Emitting those verbatim would produce a file that resolves to
 * nothing outside this site, which defeats the point: a mockup has only this one file.
 * Resolving keeps the token names identical while making each one usable standalone.
 *
 * Handles var() nested inside functions, e.g. calc(var(--radius) * 0.6).
 */
export function resolveValue(value, base, seen = new Set(), unresolved = new Set()) {
  let out = ""
  let i = 0

  while (i < value.length) {
    const skipped = skipCommentOrString(value, i)
    if (skipped !== i) {
      out += value.slice(i, skipped)
      i = skipped
      continue
    }

    if (!value.startsWith("var(", i)) {
      out += value[i]
      i += 1
      continue
    }

    // Find the matching ')' for this var(
    let depth = 0
    let j = i + 3
    for (; j < value.length; j += 1) {
      const s = skipCommentOrString(value, j)
      if (s !== j) {
        j = s - 1
        continue
      }
      if (value[j] === "(") depth += 1
      else if (value[j] === ")") {
        depth -= 1
        if (depth === 0) break
      }
    }

    const args = value.slice(i + 4, j)
    const comma = splitTopLevelComma(args)
    const name = comma[0].trim()
    const fallback = comma.length > 1 ? comma.slice(1).join(",").trim() : null

    let replacement
    if (Object.prototype.hasOwnProperty.call(base, name) && !seen.has(name)) {
      replacement = resolveValue(base[name], base, new Set([...seen, name]), unresolved)
    } else if (fallback !== null) {
      replacement = resolveValue(fallback, base, seen, unresolved)
    } else {
      // Unknown reference: leave it intact rather than emitting something wrong.
      replacement = value.slice(i, j + 1)
      unresolved.add(name)
    }

    out += replacement
    i = j + 1
  }

  return out
}

function splitTopLevelComma(text) {
  const parts = []
  let depth = 0
  let current = ""

  for (let i = 0; i < text.length; i += 1) {
    const skipped = skipCommentOrString(text, i)
    if (skipped !== i) {
      current += text.slice(i, skipped)
      i = skipped - 1
      continue
    }

    const ch = text[i]
    if (ch === "(") depth += 1
    else if (ch === ")") depth -= 1

    if (ch === "," && depth === 0) {
      parts.push(current)
      current = ""
      continue
    }

    current += ch
  }

  parts.push(current)
  return parts
}

// ---------------------------------------------------------------- build the file

export function generate() {
const unresolved = new Set()
const css = fs.readFileSync(sourcePath, "utf8")
const blocks = topLevelBlocks(css)

const themeBlock = blocks.find((block) => /^@theme\b/.test(block.prelude))
if (!themeBlock) {
  console.error(`[tokens] No @theme block found in ${sourceLabel}. Nothing to generate.`)
  process.exit(1)
}

// Literal values the @theme indirections point at.
const base = {}
for (const block of blocks) {
  if (!/(^|,)\s*:root\s*$/.test(block.prelude)) continue
  for (const entry of parseDeclarations(block.inner)) {
    if (entry.kind === "decl" && entry.name.startsWith("--")) base[entry.name] = entry.value
  }
}

const entries = parseDeclarations(themeBlock.inner)
const declarations = entries.filter((entry) => entry.kind === "decl" && entry.name.startsWith("--"))

const lines = []
lines.push("/* ------------------------------------------------------------------")
lines.push("   Lakeside design tokens — the values the live site ships.")
lines.push("")
lines.push(`   GENERATED FILE — do not edit.`)
lines.push(`   Source:     ${sourceLabel}  (the @theme block)`)
lines.push(`   Regenerate: pnpm generate:tokens  (also runs on every build)`)
lines.push("")
lines.push("   Edits here are overwritten by the next build. Change a value in")
lines.push(`   ${sourceLabel} instead — that file is the source of truth.`)
lines.push("")
lines.push("   Usage in a design mockup, with no build step and no Tailwind:")
lines.push("     <link rel=\"stylesheet\" href=\"tokens.css\">")
lines.push("     …or  @import url('tokens.css');")
lines.push("   then reference them directly:")
lines.push("     color: var(--color-heading);")
lines.push("")
lines.push("   The @theme source writes most colours as indirections such as")
lines.push("   `var(--primary)`. Those are resolved to their literal values here so")
lines.push("   this file stands alone. They are the site's defaults; a site owner can")
lines.push("   override some colours at runtime through the CMS branding settings.")
lines.push("")
lines.push("   Comments below are copied from the source, because the reasoning")
lines.push("   behind a token is usually worth more than the value.")
lines.push("   ------------------------------------------------------------------ */")
lines.push("")
lines.push(":root {")

for (const entry of entries) {
  if (entry.kind === "comment") {
    // The captured text starts at `/*`, so only the first line lost its indent.
    // Continuation lines keep the alignment they were authored with.
    const commentLines = entry.text.split("\n")
    const text = commentLines
      .map((line, index) => (index === 0 ? `  ${line}` : line))
      .join("\n")
    lines.push("")
    lines.push(text)
    continue
  }

  if (!entry.name.startsWith("--")) continue

  const resolved = resolveValue(entry.value, base, new Set(), unresolved)
  const trailing = entry.trailingComment ? ` ${entry.trailingComment}` : ""
  lines.push(`  ${entry.name}: ${resolved};${trailing}`)
}

lines.push("}")
lines.push("")

const output = lines.join("\n")

const relativeOut = path.relative(root, outputPath)
const previous = fs.existsSync(outputPath) ? fs.readFileSync(outputPath, "utf8") : null

// `--check` reports drift instead of fixing it, for use in CI: the committed file is
// what a designer links to, so it should not silently fall behind a token change that
// merged without a build.
if (process.argv.includes("--check")) {
  if (previous === output) {
    console.log(`[tokens] ${relativeOut} matches ${sourceLabel} — ${declarations.length} tokens.`)
  } else {
    console.error(
      `[tokens] ${relativeOut} is out of date with ${sourceLabel}.\n` +
        `[tokens] Run \`pnpm generate:tokens\` and commit the result.`,
    )
    process.exit(1)
  }
  return { output, tokenCount: declarations.length }
}

fs.mkdirSync(path.dirname(outputPath), { recursive: true })
fs.writeFileSync(outputPath, output)

if (previous === output) {
  console.log(`[tokens] ${relativeOut} is up to date — ${declarations.length} tokens.`)
} else {
  console.log(`[tokens] Wrote ${relativeOut} — ${declarations.length} tokens from ${sourceLabel}.`)
}

if (unresolved.size > 0) {
  console.warn(
    `[tokens] ${unresolved.size} reference(s) had no definition and were left as var(): ${[...unresolved].join(", ")}`,
  )
}

  return { output, tokenCount: declarations.length }
}

// Only generate when invoked directly, so the parser can be imported and tested
// without writing files as a side effect.
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  generate()
}
