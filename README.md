# Ameer UI

A personal shadcn/ui registry with a demo gallery, exposed to every AI client through MCP.

- **79 components**: 61 official shadcn (radix-nova, RTL logical classes) and 18 vetted community
  components (`@kibo-ui`, `@diceui`, `@magicui`).
- **Gallery**: live previews by category, all 8 official styles side by side, RTL/LTR, dark mode,
  accent and radius controls.
- **Registry**: `public/r/*.json`, self-contained. Every dependency resolves inside this registry.
- **MCP server**: `mcp/server.mjs`. Name a component in any AI client and it gets installed.

## Use it from any AI client

Registered (user scope) in Claude Code, Codex and Claude Desktop. In any project, ask for a
component by name. For example, "add a kanban board and a tags input", or "set up shadcn here".

| Tool | Does |
|---|---|
| `search_components` | find by name, purpose or category |
| `get_component` | deps, files, a working usage example, optional source |
| `add_components` | installs into the project (`shadcn add` with local registry paths) |
| `init_project` | shadcn init with Radix, nova and `--rtl`; or creates a new Next.js app |

Register it in another client:

```json
{ "mcpServers": { "ameer-ui": {
  "command": "/opt/homebrew/bin/node",
  "args": ["/Users/amer.abdulkareem/Documents/ameer/MCP-Shadcn/mcp/server.mjs"],
  "env": { "PATH": "/opt/homebrew/bin:/usr/bin:/bin" }
} } }
```

Without MCP, the CLI works directly:

```bash
pnpm dlx shadcn@latest add /Users/amer.abdulkareem/Documents/ameer/MCP-Shadcn/public/r/kanban.json
```

## Develop

```bash
pnpm dev --port 3100          # gallery
pnpm registry:build           # rebuild public/r from components/ (after any component change)
pnpm gen:styles               # regenerate style loaders after editing components/previews
pnpm sync:styles              # re-vendor all 8 official styles from shadcn (slow)
```

Layout:

- `components/ui`, `components/kibo-ui`: the registry's source. These files are shipped as-is.
- `styles/<style>/`: official ui and examples per style. They are only used for comparison in the gallery.
- `components/previews/<slug>.tsx`: one compact usage example per component. It drives both the gallery cards and `get_component`.
- `registry/upstream/`: cached upstream metadata (npm deps, css). Run `node scripts/build-registry.mjs --refresh` to update it.
- `research/shadcn.md`: what was verified about shadcn, the registry, MCP, RTL and the ecosystem.

## Adding a community component

Install it in a scratch copy first, never directly: `@coss` overwrote our Radix `button`/`input` with
Base UI versions. Diff, copy only the new files, add a catalog entry and a preview, then run
`pnpm registry:build`.

## Hosting later

The registry is local, so it works offline on this machine. To share it with other machines or a team,
push this repo privately and rebuild with `REGISTRY_BASE=<raw URL>/public/r`. The shadcn CLI supports
private GitHub registries via `gh` auth.
