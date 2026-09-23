// Full path through the real shadcn CLI and network: creates a Next.js app and installs components.
// Slow (minutes); runs only with E2E=1 (pnpm test:e2e).
import assert from "node:assert/strict"
import { spawnSync } from "node:child_process"
import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import { test } from "node:test"

import { Client } from "@modelcontextprotocol/sdk/client/index.js"
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js"

const CLI = path.resolve(import.meta.dirname, "../bin/cli.mjs")

test("init_project + add_components over stdio produce a project that typechecks", { skip: !process.env.E2E, timeout: 20 * 60_000 }, async () => {
  const parent = fs.mkdtempSync(path.join(os.tmpdir(), "ameer-ui-e2e-"))
  const client = new Client({ name: "e2e", version: "0" })
  await client.connect(
    new StdioClientTransport({
      command: process.execPath,
      args: [CLI],
      env: { ...process.env, OCEAN_UIUX_CACHE_DIR: path.join(parent, ".cache") },
    })
  )
  const call = async (name, args) => {
    const r = await client.callTool({ name, arguments: args }, undefined, { timeout: 15 * 60_000 })
    assert.ok(!r.isError, r.content[0].text)
    return r.content[0].text
  }

  await call("init_project", { cwd: parent, new_project_name: "app" })
  const app = path.join(parent, "app")
  assert.ok(JSON.parse(fs.readFileSync(path.join(app, "components.json"), "utf8")).rtl)

  await call("add_components", { names: ["kanban", "Tags Input", "dialog", "direction", "marquee", "sidebar"], cwd: app })
  for (const f of ["components/kibo-ui/kanban/index.tsx", "components/ui/tags-input.tsx", "components/ui/card.tsx", "hooks/use-mobile.ts"]) {
    assert.ok(fs.existsSync(path.join(app, f)), `missing ${f}`)
  }
  assert.match(fs.readFileSync(path.join(app, "app/globals.css"), "utf8"), /@keyframes marquee/)
  await client.close()

  const tsc = spawnSync("pnpm", ["exec", "tsc", "--noEmit"], { cwd: app, encoding: "utf8" })
  assert.equal(tsc.status, 0, tsc.stdout + tsc.stderr)
  fs.rmSync(parent, { recursive: true, force: true })
})
