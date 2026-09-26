// Clones a live site's design tokens into a shadcn-compatible theme: real CSS custom
// properties when the site exposes them (shadcn/Tailwind sites), else a heuristic sample
// of computed colors/radius/font from the rendered page. Chromium is launched lazily via
// playwright-core and installed on first use (never at package install time).
import { spawn } from "node:child_process"
import fs from "node:fs"
import os from "node:os"
import path from "node:path"

import { foregroundFor, oklchToCss, parseCssColor, rgbToOklch } from "./color.mjs"

const SHADCN_VAR_NAMES = [
  "background", "foreground", "card", "card-foreground", "popover", "popover-foreground",
  "primary", "primary-foreground", "secondary", "secondary-foreground", "muted", "muted-foreground",
  "accent", "accent-foreground", "destructive", "border", "input", "ring", "radius",
]

function run(argv, opts = {}) {
  return new Promise((resolve, reject) => {
    const [cmd, ...args] = argv
    const child = spawn(cmd, args, { stdio: "ignore", shell: process.platform === "win32", ...opts })
    child.on("error", reject)
    child.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(`${argv.join(" ")} exited ${code}`))))
  })
}

async function ensureChromium() {
  const { chromium } = await import("playwright-core")
  try {
    const browser = await chromium.launch({ headless: true })
    return { chromium, browser }
  } catch (e) {
    if (!/executable doesn.t exist/i.test(e.message)) throw e
  }
  // First use: fetch just the Chromium binary (not the whole Playwright test toolchain).
  await run(["npx", "--yes", "playwright", "install", "--with-deps", "chromium"], { timeout: 5 * 60_000 })
  const browser = await chromium.launch({ headless: true })
  return { chromium, browser }
}

const EXTRACT_SCRIPT = `(() => {
  const readStylesheetVars = () => {
    const out = {};
    for (const sheet of document.styleSheets) {
      let rules;
      try { rules = sheet.cssRules; } catch { continue; }
      for (const rule of rules) {
        if (!rule.style) continue;
        for (let i = 0; i < rule.style.length; i++) {
          const prop = rule.style[i];
          if (prop.startsWith("--")) out[prop] = rule.style.getPropertyValue(prop).trim();
        }
      }
    }
    return out;
  };

  const sample = (sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const cs = getComputedStyle(el);
    return { bg: cs.backgroundColor, fg: cs.color, radius: cs.borderRadius, border: cs.borderColor, shadow: cs.boxShadow };
  };

  // Frequency-count saturated background colors across visible elements: the most common
  // vivid color on the page is a reasonable proxy for the brand/primary color.
  const colorCounts = new Map();
  const nodes = document.querySelectorAll("body *");
  let scanned = 0;
  for (const el of nodes) {
    if (scanned++ > 2500) break;
    const bg = getComputedStyle(el).backgroundColor;
    if (!bg || bg === "transparent" || bg.startsWith("rgba(0, 0, 0, 0)")) continue;
    colorCounts.set(bg, (colorCounts.get(bg) || 0) + 1);
  }

  const radiusCounts = new Map();
  for (const sel of ["button", "[class*='btn' i]", "input", "[class*='card' i]"]) {
    const el = document.querySelector(sel);
    if (!el) continue;
    const r = getComputedStyle(el).borderRadius;
    if (r && r !== "0px") radiusCounts.set(r, (radiusCounts.get(r) || 0) + 1);
  }

  const bodyCs = getComputedStyle(document.body);
  return {
    vars: readStylesheetVars(),
    body: { bg: bodyCs.backgroundColor, fg: bodyCs.color, font: bodyCs.fontFamily },
    card: sample("[class*='card' i]") || sample("section") || sample("article"),
    colorCounts: [...colorCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12),
    radiusCounts: [...radiusCounts.entries()].sort((a, b) => b[1] - a[1]),
  };
})()`

/** Extract computed design tokens from one prefers-color-scheme capture of `url`. */
async function captureScheme(browser, url, colorScheme) {
  const page = await browser.newPage({ colorScheme })
  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 30_000 }).catch(() =>
      page.goto(url, { waitUntil: "domcontentloaded", timeout: 30_000 })
    )
    await page.waitForTimeout(500)
    return await page.evaluate(EXTRACT_SCRIPT)
  } finally {
    await page.close()
  }
}

/** Direct match on a shadcn/Tailwind CSS var name, e.g. "--primary" or "--color-primary". */
function findShadcnVar(vars, name) {
  for (const [k, v] of Object.entries(vars)) {
    const bare = k.replace(/^--(color-)?/, "")
    if (bare === name) return v
  }
  return null
}

function palette(raw) {
  // Fast path: the site already ships shadcn-style CSS variables.
  const direct = {}
  for (const name of SHADCN_VAR_NAMES) {
    const v = findShadcnVar(raw.vars, name)
    if (v && parseCssColor(v)) direct[name] = v
  }
  if (Object.keys(direct).length >= 4) return { source: "css-vars", tokens: direct }

  // Heuristic path: sample the rendered page.
  const bg = parseCssColor(raw.body.bg) || [255, 255, 255, 1]
  const fg = parseCssColor(raw.body.fg) || [10, 10, 10, 1]
  const card = raw.card ? parseCssColor(raw.card.bg) : null

  let primaryRgb = null
  for (const [css] of raw.colorCounts) {
    const rgb = parseCssColor(css)
    if (!rgb) continue
    const [r, g, b] = rgb
    const max = Math.max(r, g, b), min = Math.min(r, g, b)
    const sat = max === 0 ? 0 : (max - min) / max
    const isNeutral = max - min < 12 // grays/near-blacks/near-whites
    if (!isNeutral && sat > 0.18) { primaryRgb = rgb; break }
  }
  primaryRgb ??= fg

  const radius = raw.radiusCounts[0]?.[0] ?? "8px"

  return {
    source: "heuristic",
    tokens: {
      background: `rgb(${bg[0]}, ${bg[1]}, ${bg[2]})`,
      foreground: `rgb(${fg[0]}, ${fg[1]}, ${fg[2]})`,
      card: card ? `rgb(${card[0]}, ${card[1]}, ${card[2]})` : null,
      primary: `rgb(${primaryRgb[0]}, ${primaryRgb[1]}, ${primaryRgb[2]})`,
      border: raw.card?.border ?? null,
      radius,
      font: raw.body.font,
    },
  }
}

function toOklchVars({ source, tokens }) {
  const primaryRgb = parseCssColor(tokens.primary) ?? [64, 64, 64, 1]
  const bgRgb = parseCssColor(tokens.background) ?? [255, 255, 255, 1]
  const primary = rgbToOklch(...primaryRgb.slice(0, 3))
  const primaryFg = foregroundFor(primaryRgb)
  const ring = { ...primary, l: Math.min(0.75, primary.l + 0.05) }

  const chartFrom = (l) => oklchToCss({ ...primary, l })
  const vars = {
    "--primary": oklchToCss(primary),
    "--primary-foreground": oklchToCss(primaryFg),
    "--ring": oklchToCss(ring),
    "--sidebar-primary": oklchToCss(primary),
    "--chart-1": chartFrom(Math.min(0.88, primary.l + 0.22)),
    "--chart-2": oklchToCss(ring),
    "--chart-3": oklchToCss(primary),
    "--chart-4": chartFrom(Math.max(0.3, primary.l - 0.08)),
    "--chart-5": chartFrom(Math.max(0.2, primary.l - 0.16)),
  }
  if (source === "heuristic") {
    vars["--background"] = oklchToCss(rgbToOklch(...bgRgb.slice(0, 3)))
    vars["--foreground"] = oklchToCss(rgbToOklch(...(parseCssColor(tokens.foreground) ?? [10, 10, 10]).slice(0, 3)))
    if (tokens.card) vars["--card"] = oklchToCss(rgbToOklch(...parseCssColor(tokens.card).slice(0, 3)))
  }
  return { vars, radius: tokens.radius, font: tokens.font }
}

function slugify(input) {
  return input.toLowerCase().replace(/^https?:\/\//, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40)
}

/** Extract a light + dark theme from a live URL. Returns a plain, portable JSON theme. */
export async function extractStyle(url, { name } = {}) {
  new URL(url) // throws on malformed input
  const { browser } = await ensureChromium()
  try {
    const [lightRaw, darkRaw] = await Promise.all([
      captureScheme(browser, url, "light"),
      captureScheme(browser, url, "dark"),
    ])
    const light = toOklchVars(palette(lightRaw))
    const dark = toOklchVars(palette(darkRaw))
    const sameCapture = JSON.stringify(light.vars) === JSON.stringify(dark.vars)

    const slug = slugify(name || new URL(url).hostname)
    return {
      slug,
      name: name || new URL(url).hostname,
      source: url,
      capturedAt: new Date().toISOString(),
      radius: light.radius,
      font: light.font,
      light: light.vars,
      dark: sameCapture ? invertForDark(light.vars) : dark.vars,
      note: sameCapture ? "site has no prefers-color-scheme: dark variant is inferred, not captured" : "light and dark both captured live",
    }
  } finally {
    await browser.close()
  }
}

/** Fallback when a site doesn't respond to prefers-color-scheme: invert lightness, keep hue/chroma. */
function invertForDark(vars) {
  const out = {}
  for (const [k, css] of Object.entries(vars)) {
    const m = css.match(/oklch\(([\d.]+) ([\d.]+) ([\d.]+)\)/)
    if (!m) { out[k] = css; continue }
    const l = parseFloat(m[1])
    const invertedL = k.includes("foreground") ? 1 - l * 0.15 : l > 0.6 ? l - 0.12 : Math.min(0.85, l + 0.12)
    out[k] = `oklch(${invertedL.toFixed(3)} ${m[2]} ${m[3]})`
  }
  return out
}

/** No-API-key web search via DuckDuckGo's HTML endpoint. Best-effort: DuckDuckGo's markup
 * and rate limits can change without notice, so failures should be treated as "try a URL
 * directly" rather than a hard error. */
export async function searchDesignInspiration(query, limit = 8) {
  const res = await fetch(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; ocean-uiux-mcp/1.0)" },
  })
  if (!res.ok) throw new Error(`duckduckgo html search: HTTP ${res.status}`)
  const html = await res.text()
  const hits = []
  const re = /<a[^>]*class="result__a"[^>]*href="([^"]+)"[^>]*>(.*?)<\/a>/gs
  let m
  while ((m = re.exec(html)) && hits.length < limit) {
    const title = m[2].replace(/<[^>]+>/g, "").trim()
    let href = m[1]
    const redirect = href.match(/uddg=([^&]+)/)
    if (redirect) href = decodeURIComponent(redirect[1])
    if (href.startsWith("http")) hits.push({ title, url: href })
  }
  return hits
}

export function themeCssBlock(theme, selectorAttr = "data-accent") {
  const block = (vars) => Object.entries(vars).map(([k, v]) => `  ${k}: ${v};`).join("\n")
  return [
    `[${selectorAttr}="${theme.slug}"] {`,
    block(theme.light),
    "}",
    `.dark[${selectorAttr}="${theme.slug}"] {`,
    block(theme.dark),
    "}",
  ].join("\n")
}

/** When cwd is *this* gallery repo, wire the cloned theme straight into the live accent
 * picker (globals.css block + accents list + swatch). Returns what was changed, or null
 * if cwd isn't this repo. */
export function applyToGalleryRepo(cwd, theme) {
  const providerPath = path.join(cwd, "components/gallery/gallery-provider.tsx")
  const controlsPath = path.join(cwd, "components/gallery/gallery-controls.tsx")
  const cssPath = path.join(cwd, "app/globals.css")
  if (![providerPath, controlsPath, cssPath].every((p) => fs.existsSync(p))) return null

  let css = fs.readFileSync(cssPath, "utf8")
  const marker = "/* Gallery accent presets"
  if (css.includes(`[data-accent="${theme.slug}"]`)) {
    css = css.replace(
      new RegExp(`\\[data-accent="${theme.slug}"\\] \\{[\\s\\S]*?\\}\\n\\.dark\\[data-accent="${theme.slug}"\\] \\{[\\s\\S]*?\\}\\n`),
      themeCssBlock(theme) + "\n"
    )
  } else {
    const idx = css.indexOf(marker)
    if (idx === -1) throw new Error("accent presets marker not found in app/globals.css")
    const insertAt = css.indexOf("\n", idx) + 1
    css = css.slice(0, insertAt) + themeCssBlock(theme) + "\n" + css.slice(insertAt)
  }
  fs.writeFileSync(cssPath, css)

  let provider = fs.readFileSync(providerPath, "utf8")
  const accentsMatch = provider.match(/export const accents = \[([^\]]*)\] as const/)
  if (accentsMatch && !accentsMatch[1].includes(`"${theme.slug}"`)) {
    provider = provider.replace(accentsMatch[0], `export const accents = [${accentsMatch[1].trimEnd()}, "${theme.slug}"] as const`)
    fs.writeFileSync(providerPath, provider)
  }

  let controls = fs.readFileSync(controlsPath, "utf8")
  const swatchMatch = controls.match(/const swatch(?:es)?[^=]*=\s*\{([^}]*)\}/)
  if (swatchMatch && !swatchMatch[0].includes(`${theme.slug}:`)) {
    const primaryHex = theme.light["--primary"]
    const updated = swatchMatch[0].replace(/\}\s*$/, `  ${theme.slug}: "${primaryHex}",\n}`)
    controls = controls.replace(swatchMatch[0], updated)
    fs.writeFileSync(controlsPath, controls)
  }

  return { css: cssPath, provider: providerPath, controls: controlsPath }
}
