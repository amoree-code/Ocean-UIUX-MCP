// MCP server: exposes the Ocean UI/UX shadcn registry to any MCP client.
import { spawn } from "node:child_process"
import fs from "node:fs"
import path from "node:path"

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { z } from "zod"

import { VERSION } from "./registry.mjs"

const STOP_WORDS = new Set(["a", "an", "and", "or", "the", "for", "with", "of", "to", "in", "component", "components"])

export const INSTRUCTIONS = [
  "Ocean UI/UX is a shadcn/ui registry: official shadcn components (radix-nova style, RTL-ready",
  "logical classes) plus vetted community components (@kibo-ui, @diceui, @magicui).",
  "Whenever the user names a UI component or asks for UI (button, data table, date picker, kanban,",
  "stepper, sidebar, chart…) in a React/Next.js project, use these tools instead of writing the",
  "component from scratch: search_components → get_component (for usage) → add_components.",
  "If the project has no components.json, call init_project first. Always pass the project root",
  "as an absolute cwd. For Arabic/Kurdish UIs, add `direction`, wrap the app in DirectionProvider",
  "and set <html dir lang> — components use logical classes and flip automatically.",
].join(" ")

function normalise(name) {
  return name.trim().toLowerCase().replace(/^@ocean\//, "").replace(/\s+/g, "-")
}

export function findItem(items, name) {
  const key = normalise(name)
  return items.find((i) => i.name === key || normalise(i.title) === key)
}

export function search(items, { query, category } = {}) {
  const terms = (query ?? "").toLowerCase().split(/\s+/).filter((t) => t && !STOP_WORDS.has(t))
  return items
    .filter((i) => i.categories?.length) // internal dependency items stay hidden
    .filter((i) => !category || i.categories.some((c) => c.toLowerCase() === category.toLowerCase()))
    .map((i) => {
      const hay = [i.name, i.title, i.description, ...i.categories, i.meta?.source].join(" ").toLowerCase()
      const s = terms.length
        ? terms.reduce((n, t) => n + (i.name === t ? 10 : i.name.includes(t) ? 4 : hay.includes(t) ? 1 : 0), 0)
        : 1
      return { i, s }
    })
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s || a.i.name.localeCompare(b.i.name))
    .map(({ i }) => summary(i))
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

async function detectShadcnRunner() {
  if (process.env.OCEAN_UIUX_SHADCN) return process.env.OCEAN_UIUX_SHADCN.split(" ")
  const ok = (cmd) =>
    new Promise((resolve) => {
      const p = spawn(cmd, ["--version"], { stdio: "ignore", shell: process.platform === "win32" })
      p.on("error", () => resolve(false))
      p.on("exit", (code) => resolve(code === 0))
    })
  // pnpm dlx first: it caches cleanly and avoids broken npx caches.
  if (await ok("pnpm")) return ["pnpm", "dlx", "shadcn@latest"]
  return ["npx", "-y", "shadcn@latest"]
}

function run(argv, cwd, timeoutMs = 10 * 60_000) {
  return new Promise((resolve) => {
    const [cmd, ...args] = argv
    const child = spawn(cmd, args, { cwd, env: { ...process.env, CI: "1" }, shell: process.platform === "win32" })
    let out = ""
    child.stdout.on("data", (d) => (out += d))
    child.stderr.on("data", (d) => (out += d))
    const timer = setTimeout(() => child.kill("SIGTERM"), timeoutMs)
    child.on("error", (e) => {
      clearTimeout(timer)
      resolve({ code: -1, out: `${out}\n${e.message}` })
    })
    child.on("exit", (code, signal) => {
      clearTimeout(timer)
      const clean = out.split("\n").filter((l) => !l.startsWith("Progress:")).join("\n").trim()
      resolve({ code: signal ? `killed (${signal}, timeout ${timeoutMs / 1000}s)` : code, out: clean })
    })
  })
}

const text = (value) => ({
  content: [{ type: "text", text: typeof value === "string" ? value : JSON.stringify(value, null, 2) }],
})
const fail = (message) => ({ content: [{ type: "text", text: message }], isError: true })

function projectProblem(cwd) {
  if (!path.isAbsolute(cwd)) return `cwd must be an absolute path, got "${cwd}"`
  if (!fs.existsSync(path.join(cwd, "package.json"))) return `No package.json in ${cwd}. Pass the project root.`
  return null
}

/** @param {ReturnType<import("./registry.mjs").createRegistry>} registry */
export function createServer(registry, { runner } = {}) {
  let shadcn = runner ? Promise.resolve(runner) : null
  const shadcnCmd = () => (shadcn ??= detectShadcnRunner())

  const server = new McpServer({ name: "ocean-uiux-mcp", version: VERSION }, { instructions: INSTRUCTIONS })

  server.registerTool(
    "search_components",
    {
      title: "Search components",
      description:
        "Find components in the Ocean UI/UX registry by name or purpose (English or Arabic keywords). Empty query lists everything.",
      inputSchema: {
        query: z.string().optional().describe("e.g. 'date', 'table', 'drag', 'upload', 'جدول'"),
        category: z
          .string()
          .optional()
          .describe("Forms & Inputs, Overlays, Navigation, Data Display, Feedback, Utilities"),
      },
      annotations: { readOnlyHint: true },
    },
    async (args) => {
      const hits = search(await registry.items(), args)
      return text(hits.length ? hits : `No component matches "${args.query}". Call search_components with no query to list all.`)
    }
  )

  server.registerTool(
    "get_component",
    {
      title: "Get component",
      description:
        "Details for one component: npm and registry dependencies, files, a working usage example, docs link. include_source adds the full source.",
      inputSchema: {
        name: z.string().describe("registry name or title, e.g. 'button', 'tags-input', 'Date Picker'"),
        include_source: z.boolean().optional().describe("include full component source (large)"),
      },
      annotations: { readOnlyHint: true },
    },
    async ({ name, include_source }) => {
      const items = await registry.items()
      const found = findItem(items, name)
      if (!found) {
        const near = search(items, { query: name.replace(/[-_]/g, " ") }).slice(0, 5).map((i) => i.name)
        return fail(`No component "${name}".${near.length ? ` Did you mean: ${near.join(", ")}?` : ""}`)
      }
      const full = await registry.item(found.name)
      const usage = registry.examples(found.meta?.examples)
      return text({
        ...summary(found),
        install: `add_components({ names: ["${found.name}"], cwd: "<project root>" })`,
        dependencies: full.dependencies ?? [],
        registryDependencies: (full.registryDependencies ?? []).map((d) => path.basename(d, ".json")),
        files: full.files.map((f) => f.target ?? f.path),
        usage: usage.length ? usage : "No usage example bundled; call again with include_source.",
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
        "Install Ocean UI/UX components (plus their dependencies and npm packages) into a project via the shadcn CLI. Needs components.json — call init_project first if missing.",
      inputSchema: {
        names: z.array(z.string()).min(1).describe("registry names, e.g. ['button', 'kanban']"),
        cwd: z.string().describe("absolute path to the project root"),
        overwrite: z.boolean().optional().describe("overwrite existing files (default false)"),
      },
      annotations: { destructiveHint: false },
    },
    async ({ names, cwd, overwrite }) => {
      const problem = projectProblem(cwd)
      if (problem) return fail(problem)
      if (!fs.existsSync(path.join(cwd, "components.json"))) {
        return fail(`${cwd} has no components.json. Call init_project with this cwd first.`)
      }
      const items = await registry.items()
      const resolved = names.map((n) => [n, findItem(items, n)])
      const unknown = resolved.filter(([, i]) => !i).map(([n]) => n)
      if (unknown.length) return fail(`Unknown component(s): ${unknown.join(", ")}. Use search_components.`)
      const refs = await Promise.all(resolved.map(([, i]) => registry.itemRef(i.name)))
      const { code, out } = await run([...(await shadcnCmd()), "add", ...refs, "-y", ...(overwrite ? ["--overwrite"] : [])], cwd)
      if (code !== 0) return fail(`shadcn add failed (exit ${code}):\n${out}`)
      return text(`Installed ${resolved.map(([, i]) => i.name).join(", ")} into ${cwd}\n\n${out}`)
    }
  )

  server.registerTool(
    "init_project",
    {
      title: "Set up shadcn in a project",
      description:
        "Initialise shadcn in an existing React project (Next.js, Vite, …) with Radix, the nova style and RTL on — or create a new Next.js app by passing new_project_name.",
      inputSchema: {
        cwd: z.string().describe("absolute path: the project root, or the parent folder when creating a new app"),
        new_project_name: z
          .string()
          .regex(/^[a-z0-9-]+$/)
          .optional()
          .describe("create a new Next.js app with this name inside cwd"),
      },
    },
    async ({ cwd, new_project_name }) => {
      if (!path.isAbsolute(cwd) || !fs.existsSync(cwd)) return fail(`cwd must be an existing absolute path, got "${cwd}"`)
      const args = ["init", "-b", "radix", "-p", "nova", "--rtl", "-y", "--no-monorepo"]
      if (new_project_name) {
        if (fs.existsSync(path.join(cwd, new_project_name))) return fail(`${path.join(cwd, new_project_name)} already exists.`)
        args.push("-t", "next", "-n", new_project_name)
      } else {
        const problem = projectProblem(cwd)
        if (problem) return fail(`${problem} To create a new app, pass new_project_name.`)
        if (fs.existsSync(path.join(cwd, "components.json"))) return text(`${cwd} already has components.json — nothing to do.`)
      }
      const { code, out } = await run([...(await shadcnCmd()), ...args], cwd)
      if (code !== 0) return fail(`shadcn init failed (exit ${code}):\n${out}`)
      const root = new_project_name ? path.join(cwd, new_project_name) : cwd
      return text(
        `${out}\n\nProject ready at ${root}. For Arabic/Kurdish: add_components ["direction"], wrap the app in <DirectionProvider dir="rtl"> and set <html dir="rtl" lang="ar">.`
      )
    }
  )

  return server
}
