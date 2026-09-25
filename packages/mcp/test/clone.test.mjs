import assert from "node:assert/strict"
import { test } from "node:test"

import { foregroundFor, oklchToCss, parseCssColor, rgbToOklch } from "../src/color.mjs"
import { themeCssBlock } from "../src/clone.mjs"

test("parseCssColor handles the formats getComputedStyle returns, plus stylesheet-text hex/hsl", () => {
  assert.deepEqual(parseCssColor("rgb(37, 99, 235)"), [37, 99, 235, 1])
  assert.deepEqual(parseCssColor("rgba(0, 0, 0, 0.5)"), [0, 0, 0, 0.5])
  assert.deepEqual(parseCssColor("#2563eb"), [37, 99, 235, 1])
  assert.equal(parseCssColor("transparent"), null)
  assert.equal(parseCssColor("var(--foo)"), null)
})

test("rgbToOklch matches shadcn's reference blue accent within rounding", () => {
  const { l, h } = rgbToOklch(37, 99, 235) // tailwind blue-600, same source as the "blue" accent preset
  assert.ok(Math.abs(l - 0.546) < 0.01)
  assert.ok(Math.abs(h - 262.881) < 0.5)
})

test("foregroundFor picks a light foreground on a dark background and vice versa", () => {
  const onDark = oklchToCss(foregroundFor([10, 10, 15]))
  const onLight = oklchToCss(foregroundFor([250, 250, 250]))
  assert.match(onDark, /oklch\(0\.9/) // near-white
  assert.match(onLight, /oklch\(0\.[01]/) // near-black
})

test("themeCssBlock emits a light block and a .dark-scoped block for the same attribute selector", () => {
  const css = themeCssBlock({ slug: "acme", light: { "--primary": "oklch(0.5 0.2 250)" }, dark: { "--primary": "oklch(0.6 0.2 250)" } })
  assert.match(css, /\[data-accent="acme"\] \{\n {2}--primary: oklch\(0\.5 0\.2 250\);\n\}/)
  assert.match(css, /\.dark\[data-accent="acme"\] \{\n {2}--primary: oklch\(0\.6 0\.2 250\);\n\}/)
})
