// Copies the registry (built with a path placeholder) and the usage examples into this package.
import { execFileSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"

const pkg = path.resolve(import.meta.dirname, "..")
const repo = path.resolve(pkg, "../..")
const registryDir = path.join(pkg, "registry")
const previewsDir = path.join(pkg, "previews")

execFileSync(process.execPath, [path.join(repo, "scripts/build-registry.mjs")], {
  cwd: repo,
  stdio: "inherit",
  env: { ...process.env, REGISTRY_OUT: registryDir, REGISTRY_BASE: "{{OCEAN_UIUX_REGISTRY}}" },
})

const items = JSON.parse(fs.readFileSync(path.join(registryDir, "registry.json"), "utf8")).items
fs.rmSync(previewsDir, { recursive: true, force: true })
fs.mkdirSync(previewsDir)
let copied = 0
for (const slug of items.flatMap((i) => i.meta?.examples ?? [])) {
  const src = path.join(repo, "components/previews", `${slug}.tsx`)
  if (!fs.existsSync(src)) throw new Error(`missing preview for example "${slug}": ${src}`)
  fs.copyFileSync(src, path.join(previewsDir, `${slug}.tsx`))
  copied++
}
console.log(`bundled ${items.length} registry items and ${copied} usage examples into ${path.relative(repo, pkg)}`)
