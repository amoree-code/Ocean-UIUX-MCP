// Registers (or removes) the server in AI clients' MCP config.
import { execFileSync, spawnSync } from "node:child_process"
import fs from "node:fs"
import os from "node:os"
import path from "node:path"

export const SERVER_NAME = "ocean-uiux"
const PKG = "ocean-uiux-mcp"
const CLI_PATH = path.resolve(import.meta.dirname, "../bin/cli.mjs")

const home = () => os.homedir()
const appData = () => process.env.APPDATA || path.join(home(), "AppData", "Roaming")
const platformDir = (mac, win, linux) =>
  process.platform === "darwin" ? mac() : process.platform === "win32" ? win() : linux()

function which(cmd) {
  const r = spawnSync(process.platform === "win32" ? "where" : "which", [cmd], { encoding: "utf8" })
  return r.status === 0 ? r.stdout.split(/\r?\n/)[0].trim() : null
}

/**
 * How clients should launch the server.
 * npx/pnpm → the published package; local → this checkout (dev or before publishing).
 * Absolute binaries + PATH so GUI apps (which don't inherit the shell PATH) can start it.
 */
export function launchSpec(runner = "npx") {
  if (runner === "local") {
    const node = stableNode()
    return { command: node, args: [CLI_PATH], env: { PATH: pathEnv([node]) } }
  }
  const bin = runner === "pnpm" ? "pnpm" : "npx"
  const args = runner === "pnpm" ? ["dlx", `${PKG}@latest`] : ["-y", `${PKG}@latest`]
  const abs = which(bin)
  if (!abs) throw new Error(`${bin} not found on PATH. Install it or use --runner local.`)
  if (process.platform === "win32") return { command: "cmd", args: ["/c", bin, ...args], env: {} }
  return { command: abs, args, env: { PATH: pathEnv([abs, process.execPath]) } }
}

// process.execPath can be version-pinned (Homebrew Cellar) or per-shell (fnm multishells) and
// break on upgrade; prefer a stable path that runs the same binary.
function stableNode() {
  const real = (p) => {
    try {
      return fs.realpathSync(p)
    } catch {
      return null
    }
  }
  const target = real(process.execPath)
  const candidates = [which("node"), "/opt/homebrew/bin/node", "/usr/local/bin/node", "/usr/bin/node"]
  const stable = candidates.find((c) => c && !/fnm_multishells|[\\/]Cellar[\\/]/.test(c) && real(c) === target)
  return stable ?? process.execPath
}

function pathEnv(bins) {
  const dirs = [...bins.map((b) => path.dirname(b)), "/opt/homebrew/bin", "/usr/local/bin", "/usr/bin", "/bin"]
  return [...new Set(dirs)].join(path.delimiter)
}

function backup(file) {
  if (fs.existsSync(file)) fs.copyFileSync(file, `${file}.bak`)
}

function readJson(file) {
  if (!fs.existsSync(file)) return {}
  const raw = fs.readFileSync(file, "utf8").trim()
  if (!raw) return {}
  try {
    return JSON.parse(raw)
  } catch (e) {
    throw new Error(`${file} is not valid JSON (${e.message}); fix it or remove it first.`)
  }
}

function jsonClient({ id, label, file, key, entry = (s) => s, detect }) {
  return {
    id,
    label,
    file,
    detect: detect ?? (() => fs.existsSync(path.dirname(file()))),
    status() {
      return Boolean(readJson(file())[key]?.[SERVER_NAME])
    },
    install(spec, { force }) {
      const f = file()
      const data = readJson(f)
      data[key] ??= {}
      if (data[key][SERVER_NAME] && !force) return "already registered (use --force to replace)"
      backup(f)
      data[key][SERVER_NAME] = entry(spec)
      fs.mkdirSync(path.dirname(f), { recursive: true })
      fs.writeFileSync(f, JSON.stringify(data, null, 2) + "\n")
      return `registered in ${f}`
    },
    uninstall() {
      const f = file()
      const data = readJson(f)
      if (!data[key]?.[SERVER_NAME]) return "not registered"
      backup(f)
      delete data[key][SERVER_NAME]
      fs.writeFileSync(f, JSON.stringify(data, null, 2) + "\n")
      return `removed from ${f}`
    },
  }
}

const tomlString = (s) => JSON.stringify(s) // TOML basic strings share JSON escaping for our inputs

function stripTomlServer(src) {
  // Drop [mcp_servers.ocean-uiux] and its sub-tables, up to the next unrelated table header.
  const lines = src.split("\n")
  const out = []
  let skipping = false
  for (const line of lines) {
    const header = line.match(/^\s*\[([^\]]+)\]\s*$/)
    if (header) skipping = header[1] === `mcp_servers.${SERVER_NAME}` || header[1].startsWith(`mcp_servers.${SERVER_NAME}.`)
    if (!skipping) out.push(line)
  }
  return out.join("\n").replace(/\n{3,}/g, "\n\n")
}

const codex = {
  id: "codex",
  label: "Codex",
  file: () => path.join(process.env.CODEX_HOME || path.join(home(), ".codex"), "config.toml"),
  detect() {
    return fs.existsSync(path.dirname(this.file())) || Boolean(which("codex"))
  },
  status() {
    const f = this.file()
    return fs.existsSync(f) && fs.readFileSync(f, "utf8").includes(`[mcp_servers.${SERVER_NAME}]`)
  },
  install(spec, { force }) {
    const f = this.file()
    const src = fs.existsSync(f) ? fs.readFileSync(f, "utf8") : ""
    if (src.includes(`[mcp_servers.${SERVER_NAME}]`) && !force) return "already registered (use --force to replace)"
    backup(f)
    const env = Object.entries(spec.env)
    const block = [
      `[mcp_servers.${SERVER_NAME}]`,
      `command = ${tomlString(spec.command)}`,
      `args = [${spec.args.map(tomlString).join(", ")}]`,
      ...(env.length ? ["", `[mcp_servers.${SERVER_NAME}.env]`, ...env.map(([k, v]) => `${k} = ${tomlString(v)}`)] : []),
    ].join("\n")
    const next = `${stripTomlServer(src).trimEnd()}\n\n${block}\n`
    fs.mkdirSync(path.dirname(f), { recursive: true })
    fs.writeFileSync(f, next.trimStart())
    return `registered in ${f}`
  },
  uninstall() {
    const f = this.file()
    if (!this.status()) return "not registered"
    backup(f)
    fs.writeFileSync(f, stripTomlServer(fs.readFileSync(f, "utf8")).trimEnd() + "\n")
    return `removed from ${f}`
  },
}

const claudeCode = {
  id: "claude",
  label: "Claude Code",
  file: () => "(claude mcp, user scope)",
  detect: () => Boolean(which("claude")),
  status() {
    return spawnSync("claude", ["mcp", "get", SERVER_NAME], { encoding: "utf8", timeout: 60_000 }).status === 0
  },
  install(spec, { force }) {
    if (this.status()) {
      if (!force) return "already registered (use --force to replace)"
      execFileSync("claude", ["mcp", "remove", "--scope", "user", SERVER_NAME], { stdio: "ignore" })
    }
    const envArgs = Object.entries(spec.env).flatMap(([k, v]) => ["-e", `${k}=${v}`])
    execFileSync("claude", ["mcp", "add", "--scope", "user", SERVER_NAME, ...envArgs, "--", spec.command, ...spec.args], {
      stdio: "ignore",
    })
    return "registered (user scope — every project)"
  },
  uninstall() {
    if (!this.status()) return "not registered"
    execFileSync("claude", ["mcp", "remove", "--scope", "user", SERVER_NAME], { stdio: "ignore" })
    return "removed"
  },
}

const desktopFile = () =>
  path.join(
    platformDir(
      () => path.join(home(), "Library", "Application Support", "Claude"),
      () => path.join(appData(), "Claude"),
      () => path.join(home(), ".config", "Claude")
    ),
    "claude_desktop_config.json"
  )

function desktopRunning() {
  if (process.platform !== "darwin") return false
  // `pgrep` misses the app on macOS (and inside sandboxes); read the process table instead.
  const ps = spawnSync("ps", ["-axo", "command"], { encoding: "utf8" })
  return /\/Claude\.app\/Contents\/MacOS\/Claude(\s|$)/m.test(ps.stdout ?? "")
}

const claudeDesktop = {
  ...jsonClient({ id: "desktop", label: "Claude Desktop", file: desktopFile, key: "mcpServers" }),
  warning: () =>
    desktopRunning()
      ? "Claude Desktop is running and rewrites this file from memory — quit it (Cmd+Q) and run install again, or add the entry via Settings → Developer → Edit Config."
      : null,
}

export const clients = [
  claudeCode,
  codex,
  jsonClient({ id: "cursor", label: "Cursor", file: () => path.join(home(), ".cursor", "mcp.json"), key: "mcpServers" }),
  jsonClient({
    id: "vscode",
    label: "VS Code",
    file: () =>
      path.join(
        platformDir(
          () => path.join(home(), "Library", "Application Support", "Code", "User"),
          () => path.join(appData(), "Code", "User"),
          () => path.join(home(), ".config", "Code", "User")
        ),
        "mcp.json"
      ),
    key: "servers",
    entry: (s) => ({ type: "stdio", ...s }),
  }),
  jsonClient({
    id: "windsurf",
    label: "Windsurf",
    file: () => path.join(home(), ".codeium", "windsurf", "mcp_config.json"),
    key: "mcpServers",
  }),
  claudeDesktop,
]

export function selectClients(ids) {
  if (!ids || ids === "all") return clients
  const wanted = ids.split(",").map((s) => s.trim())
  const unknown = wanted.filter((w) => !clients.some((c) => c.id === w))
  if (unknown.length) throw new Error(`Unknown client(s): ${unknown.join(", ")}. Known: ${clients.map((c) => c.id).join(", ")}`)
  return clients.filter((c) => wanted.includes(c.id))
}
