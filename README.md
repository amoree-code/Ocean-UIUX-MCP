# Ocean UI/UX

A personal shadcn/ui registry with a demo gallery, exposed to every AI client through MCP.

- **116 components**: 90 official shadcn (radix-nova, RTL logical classes — including 27 full-page
  blocks: `dashboard-01`, 5 login and 5 signup pages, and 16 sidebar variants, live at
  [`/dashboard`](https://ocean-uiux-mcp.vercel.app/dashboard) and friends) and
  26 vetted community components (`@kibo-ui`, `@diceui`, `@magicui`, `@cult-ui`, `@animate-ui`,
  `@aceternity`).
- **Gallery**: docs-style browser — sidebar nav with search grouped by category, click a component
  or block for its live preview, all 8 official styles side by side, RTL/LTR, dark mode, accent
  and radius controls.
- **Registry**: self-contained. Every dependency resolves inside it, so it needs no hosting.
- **MCP server**: `packages/mcp` (npm `ocean-uiux-mcp`). Name a component in any AI client and it gets installed.

## Use it from any AI client

The MCP server is the npm package [`ocean-uiux-mcp`](packages/mcp/README.md). It bundles the registry, so it
works on any machine with no hosting:

```bash
npx -y ocean-uiux-mcp install      # registers in Claude Code, Codex, Cursor, VS Code, Windsurf, Claude Desktop
npx -y ocean-uiux-mcp doctor
```

Then ask for a component by name in any project, for example "add a kanban board and a tags input".
Tools: `search_components`, `get_component`, `add_components`, `init_project`,
`search_design_inspiration`, `clone_style_from_url`.

`clone_style_from_url` clones a live site's real design tokens (colors, radius, font) into a
shadcn theme (light + dark), via headless Chromium. Point it at this repo as `cwd` and the
cloned site becomes a new accent in the live gallery, right alongside blue/green/violet/etc —
same components, same styles, just its palette.

## Develop

```bash
pnpm dev --port 3100          # gallery
pnpm registry:build           # local registry in public/r (gitignored, absolute paths)
pnpm mcp:bundle               # rebuild the npm package's bundled registry + examples (commit it)
pnpm mcp:test                 # package tests; `pnpm --filter ocean-uiux-mcp test:e2e` for the slow e2e
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

## Hosting later (optional)

The package needs no hosting. For a team that wants one shared, updatable registry without
republishing, deploy the gallery (e.g. Vercel). Build the registry into `public/r` with
`REGISTRY_BASE=https://<host>/r`, then point clients at it with
`OCEAN_UIUX_REGISTRY_URL=https://<host>/r`. The shadcn CLI also supports private GitHub
registries through `gh` auth.
