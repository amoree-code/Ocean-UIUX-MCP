import assert from "node:assert/strict"
import { spawnSync } from "node:child_process"
import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import { test } from "node:test"

const CLI = path.resolve(import.meta.dirname, "../bin/cli.mjs")
// Clients whose config lives in plain files under HOME; claude (CLI) and desktop (running app) are
// exercised manually.
const CLIENTS = "codex,cursor,vscode,windsurf"

function cli(home, ...args) {
  const r = spawnSync(process.execPath, [CLI, ...args], {
    encoding: "utf8",
    env: { ...process.env, HOME: home, USERPROFILE: home, APPDATA: path.join(home, "AppData"), CODEX_HOME: "" },
  })
  return { code: r.status, out: r.stderr + r.stdout }
}

const vscodeFile = (home) =>
  process.platform === "darwin"
    ? path.join(home, "Library/Application Support/Code/User/mcp.json")
    : process.platform === "win32"
      ? path.join(home, "AppData/Code/User/mcp.json")
      : path.join(home, ".config/Code/User/mcp.json")

test("install writes every file-based client, keeps existing config, is idempotent", () => {
  const home = fs.mkdtempSync(path.join(os.tmpdir(), "ameer-ui-home-"))
  fs.mkdirSync(path.join(home, ".codex"))
  fs.writeFileSync(path.join(home, ".codex/config.toml"), 'model = "x"\n\n[mcp_servers.other]\ncommand = "other"\n')
  fs.mkdirSync(path.join(home, ".cursor"))
  fs.writeFileSync(path.join(home, ".cursor/mcp.json"), JSON.stringify({ mcpServers: { other: { command: "o" } } }))

  const first = cli(home, "install", "--client", CLIENTS, "--runner", "local")
  assert.equal(first.code, 0, first.out)

  const toml = fs.readFileSync(path.join(home, ".codex/config.toml"), "utf8")
  assert.match(toml, /model = "x"/)
  assert.match(toml, /\[mcp_servers\.other\]/)
  assert.match(toml, /\[mcp_servers\.ameer-ui\]\ncommand = ".+node.*"\nargs = \[".+cli\.mjs"\]/)
  assert.ok(fs.existsSync(path.join(home, ".codex/config.toml.bak")))

  const cursor = JSON.parse(fs.readFileSync(path.join(home, ".cursor/mcp.json"), "utf8"))
  assert.ok(cursor.mcpServers.other, "existing server kept")
  assert.equal(cursor.mcpServers["ameer-ui"].args[0], CLI)

  const vscode = JSON.parse(fs.readFileSync(vscodeFile(home), "utf8"))
  assert.equal(vscode.servers["ameer-ui"].type, "stdio")
  assert.ok(fs.existsSync(path.join(home, ".codeium/windsurf/mcp_config.json")))

  const again = cli(home, "install", "--client", CLIENTS, "--runner", "local")
  assert.match(again.out, /already registered/)
  assert.equal((fs.readFileSync(path.join(home, ".codex/config.toml"), "utf8").match(/mcp_servers\.ameer-ui\]/g) ?? []).length, 1)

  const forced = cli(home, "install", "--client", "codex", "--runner", "local", "--force")
  assert.equal(forced.code, 0, forced.out)
  assert.equal((fs.readFileSync(path.join(home, ".codex/config.toml"), "utf8").match(/mcp_servers\.ameer-ui\]/g) ?? []).length, 1)

  const removed = cli(home, "uninstall", "--client", CLIENTS)
  assert.equal(removed.code, 0, removed.out)
  const tomlAfter = fs.readFileSync(path.join(home, ".codex/config.toml"), "utf8")
  assert.doesNotMatch(tomlAfter, /ameer-ui/)
  assert.match(tomlAfter, /\[mcp_servers\.other\]/)
  assert.equal(JSON.parse(fs.readFileSync(path.join(home, ".cursor/mcp.json"), "utf8")).mcpServers["ameer-ui"], undefined)
  fs.rmSync(home, { recursive: true, force: true })
})

test("rejects unknown clients and runners", () => {
  const home = fs.mkdtempSync(path.join(os.tmpdir(), "ameer-ui-home-"))
  assert.match(cli(home, "install", "--client", "notepad").out, /Unknown client/)
  assert.match(cli(home, "install", "--runner", "yarn").out, /--runner must be/)
  fs.rmSync(home, { recursive: true, force: true })
})

test("help, version and unknown command", () => {
  assert.match(cli(os.tmpdir(), "--help").out, /Usage:/)
  assert.match(cli(os.tmpdir(), "--version").out, /^\d+\.\d+\.\d+/)
  assert.equal(cli(os.tmpdir(), "bogus").code, 2)
})
