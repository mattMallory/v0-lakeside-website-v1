import { createServer, type Server } from "node:http"
import type { AddressInfo } from "node:net"

import { expect, test } from "@playwright/test"

import { diffSnapshots, type Snapshot } from "./tools/diff-layout.mjs"
import {
  assertServedAppIsThisBuild,
  readBuildIdentity,
  ServedAppMismatchError,
} from "./support/served-app-identity"

/**
 * Positive controls for the server-identity guard.
 *
 * The guard's whole purpose is to fail. A guard that has only ever been observed
 * passing is indistinguishable from one that returns true unconditionally, and
 * that is precisely the defect it was written to prevent — a confident answer
 * from an instrument nobody checked.
 *
 * Each test below stands up a server that is wrong in a specific way and requires
 * the guard to reject it, naming the cause.
 */

type Handler = (url: string) => { status: number; body: string; contentType?: string }

async function withServer<T>(handler: Handler, run: (baseURL: string) => Promise<T>): Promise<T> {
  const server: Server = createServer((req, res) => {
    const { status, body, contentType } = handler(req.url ?? "/")
    res.writeHead(status, { "content-type": contentType ?? "text/html" })
    res.end(body)
  })

  await new Promise<void>((done) => server.listen(0, "127.0.0.1", done))
  const { port } = server.address() as AddressInfo

  try {
    return await run(`http://127.0.0.1:${port}`)
  } finally {
    await new Promise<void>((done) => server.close(() => done()))
  }
}

const FOREIGN_PAGE =
  "<html><head><title>WildRoot Health - Find Holistic Practitioners Near You</title></head><body></body></html>"

test.describe("served-app identity guard", () => {
  test("rejects a foreign application on the harness port", async () => {
    // Reproduces what actually happened: a different Next application answered
    // 200 on port 3100 and the suite measured it without complaint.
    const error = await withServer(
      () => ({ status: 404, body: FOREIGN_PAGE }),
      async (baseURL) => assertServedAppIsThisBuild(baseURL).catch((e) => e),
    )

    expect(error).toBeInstanceOf(ServedAppMismatchError)
    expect(error.message).toContain("Served application is not this repository")
    // The message has to name what it found, or the reader cannot act on it.
    expect(error.message).toContain("WildRoot Health")
  })

  test("rejects a server that serves this build's assets but renders other pages", async () => {
    const identity = readBuildIdentity()

    const error = await withServer(
      (url) =>
        url.includes(identity.mainAppChunk)
          ? { status: 200, body: "// chunk", contentType: "application/javascript" }
          : { status: 200, body: FOREIGN_PAGE },
      async (baseURL) => assertServedAppIsThisBuild(baseURL).catch((e) => e),
    )

    expect(error).toBeInstanceOf(ServedAppMismatchError)
    expect(error.message).toContain("renders different pages")
  })

  test("rejects a port with nothing listening", async () => {
    // Port 1 is reserved and never bound.
    const error = await assertServedAppIsThisBuild("http://127.0.0.1:1").catch((e) => e)

    expect(error).toBeInstanceOf(ServedAppMismatchError)
    expect(error.message).toContain("Cannot reach the server")
  })

  test("rejects a checkout with no build", async () => {
    const error = await Promise.resolve()
      .then(() => readBuildIdentity("/nonexistent/.next"))
      .catch((e) => e)

    expect(error).toBeInstanceOf(ServedAppMismatchError)
    expect(error.message).toContain("has no build")
  })

  test("accepts a server that is this build", async () => {
    const identity = readBuildIdentity()

    await withServer(
      (url) =>
        url.includes(identity.mainAppChunk)
          ? { status: 200, body: "// chunk", contentType: "application/javascript" }
          : {
              status: 200,
              body: `<html><body><script src="/_next/${identity.mainAppChunk}"></script></body></html>`,
            },
      async (baseURL) => {
        await expect(assertServedAppIsThisBuild(baseURL)).resolves.toBeUndefined()
      },
    )
  })
})

/**
 * Positive controls for the snapshot comparison.
 *
 * The tool exists to answer one question — "did this change move anything?" — and
 * the migration it serves renames classes on every batch. So it must be blind to
 * renames and sighted to movement. A tool that reports clean on both is worse
 * than the one it replaced, because it would launder a real regression.
 */

const element = (
  path: string,
  selector: string,
  box: { x: number; y: number; width: number; height: number },
) => ({ path, selector, display: "block", position: "static", ...box })

const BASELINE: Snapshot = {
  "/ @ 768": [
    element("body:nth-of-type(1)", "body.antialiased", { x: 0, y: 0, width: 768, height: 2000 }),
    element("body:nth-of-type(1)>main:nth-of-type(1)", "main.mx-auto.max-w-3xl.px-6", {
      x: 0,
      y: 65,
      width: 768,
      height: 1400,
    }),
    element("body:nth-of-type(1)>footer:nth-of-type(1)", "footer.border-t.bg-ink", {
      x: 0,
      y: 1465,
      width: 768,
      height: 535,
    }),
  ],
}

/** Every class renamed, not one pixel moved — what a token migration batch looks like. */
const RENAMED: Snapshot = {
  "/ @ 768": [
    element("body:nth-of-type(1)", "body.antialiased", { x: 0, y: 0, width: 768, height: 2000 }),
    element("body:nth-of-type(1)>main:nth-of-type(1)", "main.mx-auto.max-w-prose.px-gutter", {
      x: 0,
      y: 65,
      width: 768,
      height: 1400,
    }),
    element("body:nth-of-type(1)>footer:nth-of-type(1)", "footer.border-t.bg-surface-ink", {
      x: 0,
      y: 1465,
      width: 768,
      height: 535,
    }),
  ],
}

/** Same classes, but the footer genuinely moved 40px down. */
const MOVED: Snapshot = {
  "/ @ 768": [
    element("body:nth-of-type(1)", "body.antialiased", { x: 0, y: 0, width: 768, height: 2000 }),
    element("body:nth-of-type(1)>main:nth-of-type(1)", "main.mx-auto.max-w-3xl.px-6", {
      x: 0,
      y: 65,
      width: 768,
      height: 1400,
    }),
    element("body:nth-of-type(1)>footer:nth-of-type(1)", "footer.border-t.bg-ink", {
      x: 0,
      y: 1505,
      width: 768,
      height: 535,
    }),
  ],
}

test.describe("layout snapshot comparison", () => {
  test("reports clean when classes are renamed and nothing moves", () => {
    const diff = diffSnapshots(BASELINE, RENAMED)

    expect(diff.comparedBy).toBe("structural path")
    expect(diff.changedElements).toBe(0)
    // The renames are still accounted for, so the reader knows they happened.
    expect(diff.renamedElements).toBe(2)
  })

  test("still reports a genuine movement", () => {
    const diff = diffSnapshots(BASELINE, MOVED)

    expect(diff.changedElements).toBe(1)
    expect(diff.groups[0].changes[0].kind).toBe("moved")
    expect(diff.groups[0].changes[0].selector).toContain("footer")
    expect(diff.groups[0].changes[0].after).toContain("@0,1505")
  })

  test("reports a movement that happens underneath a rename", () => {
    // The case that matters most: a batch renames everything, and one element
    // also moves. Blindness to renames must not become blindness to movement.
    const renamedAndMoved: Snapshot = {
      "/ @ 768": RENAMED["/ @ 768"].map((item) =>
        item.selector.includes("footer") ? { ...item, y: 1505 } : item,
      ),
    }

    const diff = diffSnapshots(BASELINE, renamedAndMoved)

    expect(diff.changedElements).toBe(1)
    expect(diff.groups[0].changes[0].selector).toContain("->")
    expect(diff.renamedElements).toBe(1)
  })

  test("reports added and removed elements", () => {
    const withExtra: Snapshot = {
      "/ @ 768": [
        ...BASELINE["/ @ 768"],
        element("body:nth-of-type(1)>aside:nth-of-type(1)", "aside.new", {
          x: 0,
          y: 2000,
          width: 768,
          height: 100,
        }),
      ],
    }

    expect(diffSnapshots(BASELINE, withExtra).groups[0].changes[0].kind).toBe("added")
    expect(diffSnapshots(withExtra, BASELINE).groups[0].changes[0].kind).toBe("removed")
  })
})
