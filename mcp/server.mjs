#!/usr/bin/env node
// Ameer UI MCP server — exposes the local @ameer shadcn registry (public/r) to any MCP client.
// stdio transport; register once per client (see README "MCP").
import { spawn } from "node:child_process"
import fs from "node:fs"
import path from "node:path"

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { z } from "zod"

const REPO = path.resolve(import.meta.dirname, "..")
const REGISTRY_DIR = path.join(REPO, "public/r")
const PREVIEWS_DIR = path.join(REPO, "components/previews")

function loadIndex() {
  const file = path.join(REGISTRY_DIR, "registry.json")
  if (!fs.existsSync(file)) {
    throw new Error(`Registry not built: ${file} is missing. Run \`pnpm registry:build\` in ${REPO}.`)
  }
  return JSON.parse(fs.readFileSync(file, "utf8")).items
}

function findItem(items, name) {
  const key = name.trim().toLowerCase().replace(/^@ameer\//, "").replace(/\s+/g, "-")
  return items.find((i) => i.name === key || i.title.toLowerCase().replace(/\s+/g, "-") === key)
}

function score(item, terms) {
  const hay = [item.name, item.title, item.description, ...(item.categories ?? []), item.meta?.source]
    .join(" ")
    .toLowerCase()
  return terms.reduce((s, t) => s + (item.name === t ? 10 : item.name.includes(t) ? 4 : hay.includes(t) ? 1 : 0), 0)
}

function summary(i) {
  return {
    name: i.name,
    title: i.title,
    category: i.categories?.[0] ?? "Dependency",
    source: i.meta?.source,
    description: i.description,
  }
}

const hasPnpm = await new Promise((resolve) => {
  const p = spawn("pnpm", ["--version"], { stdio: "ignore" })
  p.on("error", () => resolve(false))
  p.on("exit", (code) => resolve(code === 0))
})
const cli = hasPnpm ? ["pnpm", ["dlx", "shadcn@latest"]] : ["npx", ["-y", "shadcn@latest"]]

function runShadcn(args, cwd) {
  return new Promise((resolve) => {
    const child = spawn(cli[0], [...cli[1], ...args], { cwd, env: { ...process.env, CI: "1" } })
    let out = ""
    child.stdout.on("data", (d) => (out += d))
    child.stderr.on("data", (d) => (out += d))
    const timer = setTimeout(() => child.kill("SIGTERM"), 5 * 60_000)
    child.on("error", (e) => {
      clearTimeout(timer)
      resolve({ code: -1, out: `${out}\n${e.message}` })
    })
    child.on("exit", (code) => {
      clearTimeout(timer)
      // pnpm progress lines are noise for the model
      resolve({ code, out: out.split("\n").filter((l) => !l.startsWith("Progress:")).join("\n").trim() })
    })
  })
}

const text = (value) => ({ content: [{ type: "text", text: typeof value === "string" ? value : JSON.stringify(value, null, 2) }] })
const fail = (message) => ({ content: [{ type: "text", text: message }], isError: true })

function projectCheck(cwd) {
  if (!path.isAbsolute(cwd)) return `cwd must be an absolute path, got "${cwd}"`
  if (!fs.existsSync(path.join(cwd, "package.json"))) return `No package.json in ${cwd}. Pass the project root.`
  return null
}

const server = new McpServer(
  { name: "ameer-ui", version: "1.0.0" },
  {
    instructions: [
      "Ameer UI is AMEER's personal shadcn/ui registry: official shadcn components (radix-nova style,",
      "RTL-ready logical classes) plus vetted community components (@kibo-ui, @diceui, @magicui).",
      "Whenever the user names a UI component or asks for UI (button, data table, date picker, kanban,",
      "stepper, sidebar, chart…) in a React/Next.js project, use these tools instead of writing the",
      "component from scratch: search_components → get_component (for usage) → add_components.",
      "If the project has no components.json, call init_project first. Always pass the project root",
      "as an absolute cwd. For Arabic/Kurdish UIs, wrap the app in DirectionProvider (item `direction`)",
      "and set <html dir> — components use logical classes and flip automatically.",
    ].join(" "),
  }
)

server.registerTool(
  "search_components",
  {
    title: "Search components",
    description:
      "Find components in the Ameer UI registry. Empty query lists everything. Matches name, title, description, category and source.",
    inputSchema: {
      query: z.string().optional().describe("e.g. 'date', 'table', 'drag', 'upload'"),
      category: z.string().optional().describe("Forms & Inputs, Overlays, Navigation, Data Display, Feedback, Utilities"),
    },
  },
  async ({ query, category }) => {
    const items = loadIndex().filter((i) => i.categories?.length) // hide internal dependency items
    const stop = new Set(["a", "an", "and", "or", "the", "for", "with", "of", "to", "in", "component", "components"])
    const terms = (query ?? "").toLowerCase().split(/\s+/).filter((t) => t && !stop.has(t))
    const hits = items
      .filter((i) => !category || i.categories.some((c) => c.toLowerCase() === category.toLowerCase()))
      .map((i) => ({ i, s: terms.length ? score(i, terms) : 1 }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s || a.i.name.localeCompare(b.i.name))
      .map((x) => summary(x.i))
    return text(hits.length ? hits : `No component matches "${query}". Call search_components with no query to list all.`)
  }
)

server.registerTool(
  "get_component",
  {
    title: "Get component",
    description:
      "Details for one component: dependencies, files, install command, and a working usage example. Set include_source to also get the component source.",
    inputSchema: {
      name: z.string().describe("registry name or title, e.g. 'button', 'tags-input', 'Date Picker'"),
      include_source: z.boolean().optional().describe("include full component source (large)"),
    },
  },
  async ({ name, include_source }) => {
    const items = loadIndex()
    const item = findItem(items, name)
    if (!item) {
      const near = items.filter((i) => i.name.includes(name.toLowerCase().split(/[\s-]/)[0])).map((i) => i.name)
      return fail(`No component "${name}".${near.length ? ` Did you mean: ${near.join(", ")}?` : ""}`)
    }
    const full = JSON.parse(fs.readFileSync(path.join(REGISTRY_DIR, `${item.name}.json`), "utf8"))
    const examples = (item.meta?.examples ?? [])
      .map((slug) => path.join(PREVIEWS_DIR, `${slug}.tsx`))
      .filter((p) => fs.existsSync(p))
      .map((p) => ({ file: path.basename(p), code: fs.readFileSync(p, "utf8") }))
    return text({
      ...summary(item),
      install: `add_components({ names: ["${item.name}"], cwd: "<project root>" })`,
      dependencies: full.dependencies ?? [],
      registryDependencies: (full.registryDependencies ?? []).map((d) => path.basename(d, ".json")),
      files: full.files.map((f) => f.target ?? f.path),
      usage: examples.length ? examples : "No example in the gallery; see source.",
      docs: full.meta?.links?.docs ?? full.meta?.upstream,
      ...(include_source ? { source: full.files.map((f) => ({ path: f.path, content: f.content })) } : {}),
    })
  }
)

server.registerTool(
  "add_components",
  {
    title: "Add components to a project",
    description:
      "Install one or more Ameer UI components (and their dependencies) into a project with the shadcn CLI. Requires components.json (run init_project first).",
    inputSchema: {
      names: z.array(z.string()).min(1).describe("registry names, e.g. ['button', 'kanban']"),
      cwd: z.string().describe("absolute path to the project root"),
      overwrite: z.boolean().optional().describe("overwrite existing files (default false)"),
    },
  },
  async ({ names, cwd, overwrite }) => {
    const problem = projectCheck(cwd)
    if (problem) return fail(problem)
    if (!fs.existsSync(path.join(cwd, "components.json"))) {
      return fail(`${cwd} has no components.json. Call init_project with this cwd first.`)
    }
    const items = loadIndex()
    const resolved = names.map((n) => [n, findItem(items, n)])
    const unknown = resolved.filter(([, i]) => !i).map(([n]) => n)
    if (unknown.length) return fail(`Unknown component(s): ${unknown.join(", ")}. Use search_components.`)
    const paths = resolved.map(([, i]) => path.join(REGISTRY_DIR, `${i.name}.json`))
    const { code, out } = await runShadcn(["add", ...paths, "-y", ...(overwrite ? ["--overwrite"] : [])], cwd)
    if (code !== 0) return fail(`shadcn add failed (exit ${code}):\n${out}`)
    return text(`Installed ${resolved.map(([, i]) => i.name).join(", ")} into ${cwd}\n\n${out}`)
  }
)

server.registerTool(
  "init_project",
  {
    title: "Set up shadcn in a project",
    description:
      "Initialise shadcn in an existing React project (Next.js, Vite, …) with Ameer's defaults: Radix, nova style, RTL on. Or create a new Next.js app by passing new_project_name.",
    inputSchema: {
      cwd: z.string().describe("absolute path: the project root, or the parent folder when creating a new app"),
      new_project_name: z.string().regex(/^[a-z0-9-]+$/).optional().describe("create a new Next.js app with this name inside cwd"),
    },
  },
  async ({ cwd, new_project_name }) => {
    if (!path.isAbsolute(cwd) || !fs.existsSync(cwd)) return fail(`cwd must be an existing absolute path, got "${cwd}"`)
    const args = ["init", "-b", "radix", "-p", "nova", "--rtl", "-y", "--no-monorepo"]
    if (new_project_name) args.push("-t", "next", "-n", new_project_name)
    else {
      const problem = projectCheck(cwd)
      if (problem) return fail(`${problem} To create a new app, pass new_project_name.`)
      if (fs.existsSync(path.join(cwd, "components.json"))) return text(`${cwd} already has components.json — nothing to do.`)
    }
    const { code, out } = await runShadcn(args, cwd)
    if (code !== 0) return fail(`shadcn init failed (exit ${code}):\n${out}`)
    return text(
      `${out}\n\nNext: wrap the app in <DirectionProvider dir="rtl"> (add_components ["direction"]) and set <html dir lang> for Arabic/Kurdish.`
    )
  }
)

await server.connect(new StdioServerTransport())
