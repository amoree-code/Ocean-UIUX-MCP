// Registry access for the MCP server.
//
// Local mode (default): the registry ships inside this package with a {{OCEAN_UIUX_REGISTRY}}
// placeholder in every registry dependency. On first use it is materialised into a per-version
// cache dir with the placeholder replaced by that dir, so the shadcn CLI gets absolute paths
// that exist on this machine.
//
// Remote mode: OCEAN_UIUX_REGISTRY_URL=https://host/r points at a hosted build of the same
// registry (built with REGISTRY_BASE=that URL); items are passed to the CLI as URLs.
import fs from "node:fs"
import os from "node:os"
import path from "node:path"

export const PLACEHOLDER = "{{OCEAN_UIUX_REGISTRY}}"
const PKG_DIR = path.resolve(import.meta.dirname, "..")
const BUNDLE_DIR = path.join(PKG_DIR, "registry")
const PREVIEWS_DIR = path.join(PKG_DIR, "previews")
const VERSION = JSON.parse(fs.readFileSync(path.join(PKG_DIR, "package.json"), "utf8")).version

function cacheRoot() {
  if (process.env.OCEAN_UIUX_CACHE_DIR) return process.env.OCEAN_UIUX_CACHE_DIR
  if (process.platform === "win32") return path.join(process.env.LOCALAPPDATA || os.homedir(), "ocean-uiux-mcp")
  return path.join(process.env.XDG_CACHE_HOME || path.join(os.homedir(), ".cache"), "ocean-uiux-mcp")
}

/** Absolute dir holding ready-to-install item JSON for this package version. */
export function materialize() {
  const dir = path.join(cacheRoot(), VERSION, "r")
  const marker = path.join(dir, ".complete")
  if (fs.existsSync(marker)) return dir
  if (!fs.existsSync(path.join(BUNDLE_DIR, "registry.json"))) {
    throw new Error(`Bundled registry missing at ${BUNDLE_DIR}. Rebuild the package (pnpm bundle).`)
  }
  // Build in a temp dir and rename, so a crash never leaves a half-written cache.
  const tmp = `${dir}.tmp-${process.pid}`
  fs.rmSync(tmp, { recursive: true, force: true })
  fs.mkdirSync(tmp, { recursive: true })
  const base = dir.split(path.sep).join("/")
  for (const f of fs.readdirSync(BUNDLE_DIR).filter((f) => f.endsWith(".json"))) {
    const src = fs.readFileSync(path.join(BUNDLE_DIR, f), "utf8")
    fs.writeFileSync(path.join(tmp, f), src.replaceAll(PLACEHOLDER, base))
  }
  fs.writeFileSync(path.join(tmp, ".complete"), VERSION)
  fs.rmSync(dir, { recursive: true, force: true })
  fs.mkdirSync(path.dirname(dir), { recursive: true })
  fs.renameSync(tmp, dir)
  return dir
}

export function createRegistry() {
  const remote = process.env.OCEAN_UIUX_REGISTRY_URL?.replace(/\/$/, "")
  let index = null
  let localDir = null

  async function items() {
    if (index) return index
    if (remote) {
      const res = await fetch(`${remote}/registry.json`)
      if (!res.ok) throw new Error(`OCEAN_UIUX_REGISTRY_URL: ${remote}/registry.json → HTTP ${res.status}`)
      index = (await res.json()).items
    } else {
      localDir = materialize()
      index = JSON.parse(fs.readFileSync(path.join(localDir, "registry.json"), "utf8")).items
    }
    return index
  }

  /** What to pass to `shadcn add` for an item: a URL or an absolute file path. */
  async function itemRef(name) {
    await items()
    return remote ? `${remote}/${name}.json` : path.join(localDir, `${name}.json`)
  }

  async function item(name) {
    await items()
    if (remote) {
      const res = await fetch(`${remote}/${name}.json`)
      if (!res.ok) throw new Error(`${remote}/${name}.json → HTTP ${res.status}`)
      return res.json()
    }
    return JSON.parse(fs.readFileSync(path.join(localDir, `${name}.json`), "utf8"))
  }

  function examples(slugs = []) {
    return slugs
      .map((slug) => path.join(PREVIEWS_DIR, `${slug}.tsx`))
      .filter((p) => fs.existsSync(p))
      .map((p) => ({ file: path.basename(p), code: fs.readFileSync(p, "utf8") }))
  }

  return { items, item, itemRef, examples, mode: remote ? `remote ${remote}` : "bundled" }
}

export { VERSION }
