// Pulls official shadcn blocks (full-page: login/signup/sidebar variants) not yet vendored
// here, one at a time in a throwaway copy of the repo (so each block's generically-named
// files — components/app-sidebar.tsx, app/login/page.tsx, etc. — never collide with another
// block's files of the same name), then namespaces them under components/blocks/<slug>/ and
// app/<slug>/ exactly like dashboard-01 was done by hand. Run: node scripts/sync-blocks.mjs
import { execFileSync, spawnSync } from "node:child_process"
import fs from "node:fs"
import os from "node:os"
import path from "node:path"

const REPO = path.resolve(import.meta.dirname, "..")

// The 3 "preview*" blocks are empty docs-site placeholders; login/signup/sidebar are real pages.
export const BLOCKS = {
  "login-01": "A simple login form.",
  "login-02": "A two column login page with a cover image.",
  "login-03": "A login page with a muted background color.",
  "login-04": "A login page with form and image.",
  "login-05": "A simple email-only login page.",
  "signup-01": "A simple signup form.",
  "signup-02": "A two column signup page with a cover image.",
  "signup-03": "A signup page with a muted background color.",
  "signup-04": "A signup page with form and image.",
  "signup-05": "A simple signup form with social providers.",
  "sidebar-01": "A simple sidebar with navigation grouped by section.",
  "sidebar-02": "A sidebar with collapsible sections.",
  "sidebar-03": "A sidebar with submenus.",
  "sidebar-04": "A floating sidebar with submenus.",
  "sidebar-05": "A sidebar with collapsible submenus.",
  "sidebar-06": "A sidebar with submenus as dropdowns.",
  "sidebar-07": "A sidebar that collapses to icons.",
  "sidebar-08": "An inset sidebar with secondary navigation.",
  "sidebar-09": "Collapsible nested sidebars.",
  "sidebar-10": "A sidebar in a popover.",
  "sidebar-11": "A sidebar with a collapsible file tree.",
  "sidebar-12": "A sidebar with a calendar.",
  "sidebar-13": "A sidebar in a dialog.",
  "sidebar-14": "A sidebar on the right.",
  "sidebar-15": "A left and right sidebar.",
  "sidebar-16": "A sidebar with a sticky site header.",
}

function sh(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, { encoding: "utf8", ...opts })
  if (r.status !== 0 && !opts.allowFail) throw new Error(`${cmd} ${args.join(" ")} failed:\n${r.stdout}\n${r.stderr}`)
  return r.stdout + r.stderr
}

function parseDryRun(output) {
  const files = []
  for (const line of output.split("\n")) {
    const m = line.match(/^\s*[│|]\s*([+~])\s+(\S+)\s+(create|overwrite)/)
    if (m) files.push(m[2])
  }
  return files
}

function relocate(slug, relFiles, workspace) {
  const moved = [] // { from: original relPath, to: new relPath, basename (no ext) }
  for (const rel of relFiles) {
    const segments = rel.split("/")
    let dest
    if (segments[0] === "app") {
      // one page (+ sibling data files) per block; fold whatever route it targeted into /<slug>
      dest = path.join("app", slug, segments.slice(-1)[0])
    } else {
      // components/*.tsx or hooks/*.ts with no subfolder (ui/* is always shared -> never "own")
      dest = path.join("components/blocks", slug, path.basename(rel))
    }
    const from = path.join(workspace, rel)
    const to = path.join(REPO, dest)
    fs.mkdirSync(path.dirname(to), { recursive: true })
    fs.copyFileSync(from, to)
    moved.push({ to, basename: path.basename(rel).replace(/\.(tsx?|json)$/, "") })
  }
  return moved
}

function rewriteImports(slug, moved) {
  const names = moved.map((m) => m.basename)
  for (const { to } of moved) {
    let src = fs.readFileSync(to, "utf8")
    for (const name of names) {
      src = src.replaceAll(`@/components/${name}"`, `@/components/blocks/${slug}/${name}"`)
      src = src.replaceAll(`@/components/${name}'`, `@/components/blocks/${slug}/${name}'`)
    }
    // Known upstream RTL gaps the shadcn CLI's --rtl flag doesn't rewrite (physical text-align).
    src = src.replace(/\btext-left\b/g, "text-start").replace(/\btext-right\b/g, "text-end")
    fs.writeFileSync(to, src)
  }
}

function syncOne(slug) {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), `ocean-block-${slug}-`))
  try {
    execFileSync("rsync", ["-a", "--exclude", "node_modules", "--exclude", ".next", "--exclude", ".git", "--exclude", "styles", `${REPO}/`, `${workspace}/`])
    sh("pnpm", ["install", "--frozen-lockfile", "--silent"], { cwd: workspace })
    const dry = sh("pnpm", ["dlx", "shadcn@latest", "add", slug, "--dry-run", "-y"], { cwd: workspace, env: { ...process.env, CI: "1" } })
    const relFiles = parseDryRun(dry)
    if (!relFiles.length) return { slug, files: 0, note: "nothing new (already covered by shared ui)" }
    sh("pnpm", ["dlx", "shadcn@latest", "add", slug, "-y", "--overwrite"], { cwd: workspace, env: { ...process.env, CI: "1" } })
    const moved = relocate(slug, relFiles, workspace)
    rewriteImports(slug, moved)
    return { slug, files: moved.length }
  } finally {
    fs.rmSync(workspace, { recursive: true, force: true })
  }
}

const targets = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(BLOCKS)
for (const slug of targets) {
  process.stdout.write(`${slug}... `)
  try {
    const r = syncOne(slug)
    console.log(r.note ? r.note : `${r.files} files`)
  } catch (e) {
    console.log(`FAILED: ${e.message.split("\n")[0]}`)
  }
}
