// Minimal color math: parse CSS colors -> oklch(), matching shadcn's variable format
// exactly (e.g. "oklch(0.546 0.245 262.881)"), with no external dependency.

function srgbToLinear(c) {
  const v = c / 255
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
}

function linearToOklab(r, g, b) {
  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b
  const l_ = Math.cbrt(l)
  const m_ = Math.cbrt(m)
  const s_ = Math.cbrt(s)
  return [
    0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_,
    1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_,
    0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_,
  ]
}

/** [r,g,b] in 0-255 -> {l, c, h} (h in degrees). */
export function rgbToOklch(r, g, b) {
  const [L, a, bb] = linearToOklab(srgbToLinear(r), srgbToLinear(g), srgbToLinear(b))
  const c = Math.sqrt(a * a + bb * bb)
  let h = (Math.atan2(bb, a) * 180) / Math.PI
  if (h < 0) h += 360
  return { l: L, c, h }
}

export function oklchToCss({ l, c, h }) {
  return `oklch(${round(l, 3)} ${round(c, 3)} ${round(h, 3)})`
}

function round(n, d) {
  const f = 10 ** d
  return Math.round(n * f) / f
}

/** Relative luminance (WCAG) from 0-255 rgb, for choosing a readable foreground. */
export function relativeLuminance(r, g, b) {
  const lin = (c) => {
    const v = c / 255
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  }
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
}

/** Parse a CSS color string as produced by getComputedStyle: rgb()/rgba() (the common
 * case), plus hex and hsl() for values read directly out of stylesheet text. Returns
 * [r,g,b,a] in 0-255/0-1, or null if unparseable (e.g. "transparent", a var() reference). */
export function parseCssColor(input) {
  const s = input.trim()
  if (!s || s === "transparent" || s.startsWith("var(")) return null

  let m = s.match(/^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.]+%?))?\s*\)$/i)
  if (m) {
    const a = m[4] ? (m[4].endsWith("%") ? parseFloat(m[4]) / 100 : parseFloat(m[4])) : 1
    return [parseFloat(m[1]), parseFloat(m[2]), parseFloat(m[3]), a]
  }

  m = s.match(/^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i)
  if (m) {
    let hex = m[1]
    if (hex.length === 3 || hex.length === 4) hex = [...hex].map((c) => c + c).join("")
    const num = parseInt(hex.slice(0, 6), 16)
    const a = hex.length === 8 ? parseInt(hex.slice(6, 8), 16) / 255 : 1
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255, a]
  }

  m = s.match(/^hsla?\(\s*([\d.]+)(?:deg)?[,\s]+([\d.]+)%[,\s]+([\d.]+)%(?:[,\s/]+([\d.]+%?))?\s*\)$/i)
  if (m) {
    const [r, g, b] = hslToRgb(parseFloat(m[1]), parseFloat(m[2]) / 100, parseFloat(m[3]) / 100)
    const a = m[4] ? (m[4].endsWith("%") ? parseFloat(m[4]) / 100 : parseFloat(m[4])) : 1
    return [r, g, b, a]
  }

  return null
}

function hslToRgb(h, s, l) {
  h = ((h % 360) + 360) % 360
  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - c / 2
  const [r1, g1, b1] =
    h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x]
  return [(r1 + m) * 255, (g1 + m) * 255, (b1 + m) * 255]
}

/** Pick the readable oklch foreground (near-white or near-black) for a background color. */
export function foregroundFor([r, g, b]) {
  const lum = relativeLuminance(r, g, b)
  return lum > 0.5 ? rgbToOklch(15, 15, 20) : rgbToOklch(250, 250, 252)
}
