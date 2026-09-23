import assert from "node:assert/strict"
import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import { after, before, test } from "node:test"

import { Client } from "@modelcontextprotocol/sdk/client/index.js"
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js"

const cache = fs.mkdtempSync(path.join(os.tmpdir(), "ameer-ui-cache-"))
process.env.AMEER_UI_CACHE_DIR = cache
delete process.env.AMEER_UI_REGISTRY_URL

const { createRegistry } = await import("../src/registry.mjs")
const { createServer } = await import("../src/server.mjs")

let client
before(async () => {
  const [a, b] = InMemoryTransport.createLinkedPair()
  // A runner that must never be reached by these tests: add/init paths here fail validation first.
  await createServer(createRegistry(), { runner: ["false"] }).connect(a)
  client = new Client({ name: "test", version: "0" })
  await client.connect(b)
})
after(async () => {
  await client.close()
  fs.rmSync(cache, { recursive: true, force: true })
})

async function call(name, args) {
  const r = await client.callTool({ name, arguments: args })
  const body = r.content[0].text
  return { error: Boolean(r.isError), body, json: () => JSON.parse(body) }
}

test("exposes the four tools and usage instructions", async () => {
  const { tools } = await client.listTools()
  assert.deepEqual(tools.map((t) => t.name).sort(), ["add_components", "get_component", "init_project", "search_components"])
  assert.match(client.getInstructions(), /search_components/)
})

test("empty search lists every component but hides dependency-only items", async () => {
  const all = (await call("search_components", {})).json()
  assert.equal(all.length, 79)
  assert.ok(!all.some((i) => i.name === "use-as-ref"))
})

test("search by intent, including Arabic keywords", async () => {
  const drag = (await call("search_components", { query: "drag and drop" })).json().map((i) => i.name)
  for (const n of ["kanban", "sortable", "dropzone", "file-upload"]) assert.ok(drag.includes(n), `drag missing ${n}`)
  assert.ok(!drag.includes("button"), "stop words must not match everything")
  const table = (await call("search_components", { query: "جدول" })).json().map((i) => i.name)
  assert.ok(table.includes("table"))
})

test("category filter", async () => {
  const overlays = (await call("search_components", { category: "overlays" })).json()
  assert.ok(overlays.length > 5)
  assert.ok(overlays.every((i) => i.category === "Overlays"))
})

test("get_component returns deps, files and a usage example; finds by title", async () => {
  const k = (await call("get_component", { name: "Kanban" })).json()
  assert.equal(k.source, "@kibo-ui")
  assert.deepEqual(k.registryDependencies.sort(), ["card", "scroll-area"])
  assert.deepEqual(k.files, ["components/kibo-ui/kanban/index.tsx"])
  assert.match(k.usage[0].code, /Kanban/)
  assert.equal(k.source_code, undefined)
  const withSrc = (await call("get_component", { name: "button", include_source: true })).json()
  assert.match(withSrc.source[0].content, /buttonVariants/)
})

test("get_component suggests near matches for unknown names", async () => {
  const r = await call("get_component", { name: "date picker" })
  assert.ok(r.error)
  assert.match(r.body, /Did you mean: .*calendar/)
})

test("add_components validates before running the CLI", async () => {
  assert.match((await call("add_components", { names: ["button"], cwd: "relative/path" })).body, /absolute path/)
  const empty = fs.mkdtempSync(path.join(os.tmpdir(), "ameer-ui-proj-"))
  assert.match((await call("add_components", { names: ["button"], cwd: empty })).body, /No package.json/)
  fs.writeFileSync(path.join(empty, "package.json"), "{}")
  assert.match((await call("add_components", { names: ["button"], cwd: empty })).body, /init_project/)
  fs.writeFileSync(path.join(empty, "components.json"), "{}")
  const unknown = await call("add_components", { names: ["button", "nope"], cwd: empty })
  assert.ok(unknown.error)
  assert.match(unknown.body, /Unknown component\(s\): nope/)
  fs.rmSync(empty, { recursive: true, force: true })
})

test("init_project refuses to clobber an existing folder", async () => {
  const parent = fs.mkdtempSync(path.join(os.tmpdir(), "ameer-ui-parent-"))
  fs.mkdirSync(path.join(parent, "app"))
  const r = await call("init_project", { cwd: parent, new_project_name: "app" })
  assert.ok(r.error)
  assert.match(r.body, /already exists/)
  fs.rmSync(parent, { recursive: true, force: true })
})

test("materialised registry points dependencies at real files", () => {
  const dir = fs.readdirSync(cache).map((v) => path.join(cache, v, "r"))[0]
  const dialog = JSON.parse(fs.readFileSync(path.join(dir, "dialog.json"), "utf8"))
  for (const dep of dialog.registryDependencies) assert.ok(fs.existsSync(dep), `missing ${dep}`)
})
