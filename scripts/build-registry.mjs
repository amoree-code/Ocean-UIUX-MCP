// Builds the @ocean registry into public/r/ from the components in this repo.
//
// Metadata (npm deps, css, cssVars, docs, registry deps) comes from each item's upstream
// registry and is cached in registry/upstream/ so builds are reproducible offline.
// File contents come from THIS repo (radix-nova, RTL-converted), never from upstream.
// Every registry dependency is resolved to an item of this registry, so a consuming
// project needs no other registry configured.
//
//   node scripts/build-registry.mjs            # build from cache (fetches only what's missing)
//   node scripts/build-registry.mjs --refresh  # refetch upstream metadata
//   REGISTRY_BASE=https://host/r node scripts/build-registry.mjs   # when hosted
//   REGISTRY_OUT=dir REGISTRY_BASE={{OCEAN_UIUX_REGISTRY}} …          # npm bundle (see packages/mcp)
import fs from "node:fs"
import path from "node:path"

const root = path.resolve(import.meta.dirname, "..")
const outDir = path.resolve(root, process.env.REGISTRY_OUT ?? "public/r")
const cacheDir = path.join(root, "registry/upstream")
// On Vercel, default to the project's stable production domain (not the per-deployment
// one) so registryDependencies point at real hosted URLs instead of this machine's path.
const vercelBase = process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}/r`
const base = (process.env.REGISTRY_BASE ?? vercelBase ?? outDir).replace(/\/$/, "")
const refresh = process.argv.includes("--refresh")
// Our own purpose + keywords (English and Arabic) so MCP search finds items by intent.
const descriptions = JSON.parse(fs.readFileSync(path.join(root, "registry/descriptions.json"), "utf8"))

const upstream = {
  shadcn: (n) => `https://ui.shadcn.com/r/styles/radix-nova/${n}.json`,
  "@kibo-ui": (n) => `https://www.kibo-ui.com/r/${n}.json`,
  "@diceui": (n) => `https://diceui.com/r/radix-nova/${n}.json`,
  "@magicui": (n) => `https://magicui.design/r/${n}`,
  "@cult-ui": (n) => `https://www.cult-ui.com/r/${n}.json`,
  "@animate-ui": (n) => `https://animate-ui.com/r/${n}.json`,
  "@aceternity": (n) => `https://ui.aceternity.com/registry/${n}.json`,
}

// Parse lib/catalog.ts without a TS toolchain: every entry is a single-line object literal.
const catalog = [...fs.readFileSync(path.join(root, "lib/catalog.ts"), "utf8").matchAll(/^\s*\{ slug: .*\},?$/gm)].map(
  ([line]) => Object.fromEntries([...line.matchAll(/(\w+): ("[^"]*"|null)/g)].map(([, k, v]) => [k, JSON.parse(v)]))
)

async function fetchUpstream(source, name) {
  const cache = path.join(cacheDir, source.replace("@", ""), `${name}.json`)
  if (!refresh && fs.existsSync(cache)) return JSON.parse(fs.readFileSync(cache, "utf8"))
  const url = upstream[source](name)
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${source}/${name}: ${url} → HTTP ${res.status}`)
  const item = await res.json()
  for (const f of item.files ?? []) delete f.content
  fs.mkdirSync(path.dirname(cache), { recursive: true })
  fs.writeFileSync(cache, JSON.stringify(item, null, 2) + "\n")
  return item
}

// Where the upstream file lives in this repo.
function localPath(file, itemName, route) {
  const name = path.basename(file.path)
  // Upstream's own page target is generic (e.g. every login-NN block targets app/login/page.tsx),
  // which collides once more than one variant is vendored — each block gets its own route instead.
  if (file.type === "registry:page" && route) return path.join("app", route.replace(/^\//, ""), name)
  if (file.target) return file.target
  if (file.type === "registry:lib") return `lib/${name}`
  if (file.type === "registry:hook") return `hooks/${name}`
  // A block's own sub-components aren't reusable primitives, so they don't belong in
  // components/ui/ alongside them — keep them namespaced under the block's own folder.
  if (file.type === "registry:component" || file.type === "registry:page") return `components/blocks/${itemName}/${name}`
  return `components/ui/${name}`
}

const bySlug = new Map()
for (const e of catalog.filter((e) => e.ui)) {
  const cur = bySlug.get(e.ui) ?? { ...e, slugs: [] }
  cur.slugs.push(e.slug)
  bySlug.set(e.ui, cur)
}
// Official ui with no gallery page (no official example), shipped so the registry is complete.
const extras = [
  { ui: "direction", title: "Direction", category: "Utilities", source: "shadcn" },
  { ui: "message", title: "Message", category: "Data Display", source: "shadcn" },
  { ui: "message-scroller", title: "Message Scroller", category: "Data Display", source: "shadcn" },
]
for (const e of extras) bySlug.set(e.ui, { ...e, slugs: [] })
const built = new Map() // name → item
const pending = new Map() // name → promise (dedupe concurrent builds)

function parseDep(dep, fallbackSource) {
  if (/^https?:|^\//.test(dep)) throw new Error(`unsupported URL registry dependency: ${dep}`)
  const m = dep.match(/^(@[\w-]+)\/(.+)$/)
  // Un-namespaced names resolve in the item's own registry, as the CLI does.
  return m ? { source: m[1] === "@shadcn" ? "shadcn" : m[1], name: m[2] } : { source: fallbackSource, name: dep }
}

async function build(source, name) {
  // catalog metadata applies even when the item is first reached as another item's dependency
  const extra = bySlug.get(name) ?? {}
  if (built.has(name)) return
  if (pending.has(name)) return pending.get(name)
  const job = (async () => {
    const up = await fetchUpstream(source, name)
    const files = (up.files ?? []).map((f) => {
      const p = localPath(f, name, extra.route)
      const abs = path.join(root, p)
      if (!fs.existsSync(abs)) throw new Error(`${source}/${name}: expected local file ${p}`)
      // A route override replaces upstream's (possibly colliding) install target too — otherwise
      // `shadcn add` would install every login-NN variant to the same app/login/page.tsx.
      const target = f.type === "registry:page" && extra.route ? p : f.target
      return { path: p, type: f.type, ...(target ? { target } : {}), content: fs.readFileSync(abs, "utf8") }
    })
    const deps = (up.registryDependencies ?? []).map((d) => parseDep(d, source))
    // Dependencies that another registry would supply are rebuilt from our copies too.
    await Promise.all(deps.map((d) => build(d.source, d.name)))
    const item = {
      $schema: "https://ui.shadcn.com/schema/registry-item.json",
      name,
      type: up.type,
      title: extra.title ?? up.title ?? name,
      description: descriptions[name] ?? up.description ?? "",
      ...(up.author ? { author: up.author } : {}),
      ...(up.dependencies?.length ? { dependencies: up.dependencies } : {}),
      ...(up.devDependencies?.length ? { devDependencies: up.devDependencies } : {}),
      ...(deps.length ? { registryDependencies: deps.map((d) => `${base}/${d.name}.json`) } : {}),
      ...(up.tailwind && Object.keys(up.tailwind).length ? { tailwind: up.tailwind } : {}),
      ...(up.cssVars && Object.keys(up.cssVars).length ? { cssVars: up.cssVars } : {}),
      ...(up.css && Object.keys(up.css).length ? { css: up.css } : {}),
      ...(up.docs ? { docs: up.docs } : {}),
      ...(extra.category ? { categories: [extra.category] } : {}),
      files,
      meta: { source, upstream: upstream[source](name), ...(extra.slugs ? { examples: extra.slugs } : {}), ...(up.meta ?? {}) },
    }
    built.set(name, item)
  })()
  pending.set(name, job)
  return job
}

for (const e of bySlug.values()) await build(e.source, e.ui)

fs.rmSync(outDir, { recursive: true, force: true })
fs.mkdirSync(outDir, { recursive: true })
for (const item of built.values()) fs.writeFileSync(path.join(outDir, `${item.name}.json`), JSON.stringify(item, null, 2) + "\n")

const index = {
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: "ocean",
  homepage: "https://github.com/amoree-code/Ocean-UIUX-MCP",
  items: [...built.values()]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(({ files, $schema, ...rest }) => ({ ...rest, files: files.map(({ content, ...f }) => f) })),
}
fs.writeFileSync(path.join(outDir, "registry.json"), JSON.stringify(index, null, 2) + "\n")
console.log(`built ${built.size} items (${bySlug.size} catalog + ${built.size - bySlug.size} dependencies) → ${path.relative(root, outDir)}  base=${base}`)
