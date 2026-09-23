#!/usr/bin/env node
import { parseArgs } from "node:util"

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"

import { launchSpec, selectClients } from "../src/install.mjs"
import { createRegistry, materialize, VERSION } from "../src/registry.mjs"
import { createServer } from "../src/server.mjs"

const HELP = `ameer-ui-mcp ${VERSION} — shadcn/ui registry (radix-nova, RTL) for AI clients

Usage:
  ameer-ui-mcp                      start the MCP server on stdio (what clients run)
  ameer-ui-mcp install [options]    register the server in AI clients
  ameer-ui-mcp uninstall [options]  remove it from AI clients
  ameer-ui-mcp doctor               check node, registry, shadcn runner and clients

Options (install / uninstall):
  --client <ids>   all (default: every client found) or a list:
                   claude, codex, cursor, vscode, windsurf, desktop
  --runner <r>     how clients launch the server: npx (default), pnpm, local
  --force          replace an existing registration
  -h, --help       show this help
  -v, --version    print the version

Environment:
  AMEER_UI_REGISTRY_URL   use a hosted registry (https://host/r) instead of the bundled one
  AMEER_UI_SHADCN         shadcn command, e.g. "npx -y shadcn@latest" (default: pnpm dlx if available)
  AMEER_UI_CACHE_DIR      where the bundled registry is unpacked (default: ~/.cache/ameer-ui-mcp)`

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    client: { type: "string" },
    runner: { type: "string", default: "npx" },
    force: { type: "boolean", default: false },
    help: { type: "boolean", short: "h" },
    version: { type: "boolean", short: "v" },
  },
})

const log = (...a) => console.error(...a) // stdout belongs to the MCP protocol

async function serve() {
  const server = createServer(createRegistry())
  await server.connect(new StdioServerTransport())
}

function manage(action) {
  if (!["npx", "pnpm", "local"].includes(values.runner)) throw new Error(`--runner must be npx, pnpm or local`)
  const explicit = values.client && values.client !== "all"
  const targets = selectClients(values.client)
  const spec = action === "install" ? launchSpec(values.runner) : null
  if (spec) log(`launch: ${spec.command} ${spec.args.join(" ")}\n`)
  let failures = 0
  for (const c of targets) {
    if (!explicit && !c.detect()) {
      log(`- ${c.label.padEnd(15)} not found, skipped`)
      continue
    }
    try {
      const warning = action === "install" ? c.warning?.() : null
      if (warning) {
        log(`! ${c.label.padEnd(15)} ${warning}`)
        failures++
        continue
      }
      log(`✓ ${c.label.padEnd(15)} ${action === "install" ? c.install(spec, values) : c.uninstall()}`)
    } catch (e) {
      failures++
      log(`✗ ${c.label.padEnd(15)} ${e.message}`)
    }
  }
  if (action === "install") log(`\nRestart open clients, then ask for a component by name.`)
  process.exitCode = failures ? 1 : 0
}

async function doctor() {
  log(`ameer-ui-mcp ${VERSION} · node ${process.version}`)
  if (Number(process.versions.node.split(".")[0]) < 20) log("✗ node >= 20 required")
  const registry = createRegistry()
  try {
    if (registry.mode === "bundled") log(`✓ registry     ${materialize()}`)
    const items = await registry.items()
    log(`✓ items        ${items.filter((i) => i.categories?.length).length} components (${registry.mode})`)
  } catch (e) {
    log(`✗ registry     ${e.message}`)
    process.exitCode = 1
  }
  for (const c of selectClients("all")) {
    const found = c.detect()
    log(`${found ? (c.status() ? "✓" : "·") : "-"} ${c.label.padEnd(12)} ${found ? (c.status() ? "registered" : "not registered") : "not installed"}`)
  }
}

try {
  if (values.help) console.log(HELP)
  else if (values.version) console.log(VERSION)
  else if (!positionals.length || positionals[0] === "serve") await serve()
  else if (positionals[0] === "install" || positionals[0] === "uninstall") manage(positionals[0])
  else if (positionals[0] === "doctor") await doctor()
  else {
    log(`Unknown command "${positionals[0]}".\n\n${HELP}`)
    process.exitCode = 2
  }
} catch (e) {
  log(`ameer-ui-mcp: ${e.message}`)
  process.exitCode = 1
}
