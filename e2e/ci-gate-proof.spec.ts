import { expect, test } from "@playwright/test"

test("deliberate failure proving the CI viewport gate fails the run", async () => {
  expect(1).toBe(2)
})
