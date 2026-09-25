// Launches real Chromium against a live site. Slow, needs network; runs only with E2E=1.
import assert from "node:assert/strict"
import { test } from "node:test"

import { extractStyle } from "../src/clone.mjs"

test("extractStyle clones real CSS variables/colors from a live site", { skip: !process.env.E2E, timeout: 60_000 }, async () => {
  const theme = await extractStyle("https://tailwindcss.com", { name: "Tailwind" })
  assert.equal(theme.slug, "tailwind")
  assert.match(theme.light["--primary"], /^oklch\(/)
  assert.match(theme.dark["--primary"], /^oklch\(/)
  assert.ok(theme.source.startsWith("https://"))
})
