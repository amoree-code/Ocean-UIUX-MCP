# ocean-uiux-mcp

An MCP server for a curated [shadcn/ui](https://ui.shadcn.com) registry. Name a component in any
AI client (Claude Code, Codex, Cursor, VS Code, Windsurf, Claude Desktop) and it gets searched, explained
and installed into your project with the shadcn CLI.

- **79 components.** 61 official shadcn components in the `radix-nova` style, plus 18 vetted community
  components (Kibo UI, Dice UI, Magic UI): kanban, gantt, tree, stepper, timeline, tags-input,
  file-upload, dropzone, color-picker, rating, sortable, number-ticker, marquee and more.
- **RTL-ready.** Components use logical classes (`ms-`, `pe-`, `start-`), so they flip for Arabic
  and Kurdish. `init_project` turns RTL on.
- **Self-contained.** The registry ships inside the package, with every dependency resolved in it.
  It needs no hosting, no `components.json` registry entries and no tokens.
- **Usage examples.** Each component comes with a small working example, so the model wires it
  up correctly instead of guessing the API.

## Install

```bash
npx -y ocean-uiux-mcp install
```

This registers the server in every AI client it finds on the machine and backs up each config file
first. Restart open clients afterwards.

```bash
npx -y ocean-uiux-mcp install --client claude,cursor      # only some clients
npx -y ocean-uiux-mcp install --runner pnpm               # clients launch it with pnpm dlx
npx -y ocean-uiux-mcp uninstall
npx -y ocean-uiux-mcp doctor                              # what's registered where
```

Manual config, for any MCP client:

```json
{ "mcpServers": { "ocean-uiux-mcp": { "command": "npx", "args": ["-y", "ocean-uiux-mcp@latest"] } } }
```

> Claude Desktop rewrites its config file while it runs. Quit it before `install`, or paste the
> entry via **Settings → Developer → Edit Config**.

## Use

Ask in plain words, in any project:

- "add a kanban board and a tags input"
- "I need a date picker and a data table on this page"
- "set up shadcn here with RTL" or "create a new Next.js app called dashboard with a sidebar"
- "ضيفلي جدول وسحب وإفلات": descriptions carry Arabic keywords too

| Tool | What it does |
|---|---|
| `search_components` | find components by name, purpose or category |
| `get_component` | npm and registry dependencies, files, a usage example, the docs link, optional source |
| `add_components` | `shadcn add` for one or more components and all their dependencies |
| `init_project` | `shadcn init` with Radix, nova and RTL, or creates a new Next.js app |

## RTL apps

```tsx
// app/layout.tsx
import { DirectionProvider } from "@/components/ui/direction" // add_components ["direction"]

<html lang="ar" dir="rtl">
  <body>
    <DirectionProvider dir="rtl">{children}</DirectionProvider>
  </body>
</html>
```

Sidebar, Calendar and Pagination carry side-specific classes (`data-[side=left]`). Review them in RTL
layouts, as shadcn's own RTL guide recommends.

## Environment

| Variable | Default | Purpose |
|---|---|---|
| `OCEAN_UIUX_REGISTRY_URL` | (bundled) | use a hosted build of the registry, e.g. `https://host/r` |
| `OCEAN_UIUX_SHADCN` | `pnpm dlx shadcn@latest` if pnpm exists, else `npx -y shadcn@latest` | command used to run the shadcn CLI |
| `OCEAN_UIUX_CACHE_DIR` | `~/.cache/ocean-uiux-mcp` | where the bundled registry is unpacked |

Requires Node.js 20 or newer. Components target React 19, Tailwind CSS v4 and the unified
`radix-ui` package.

## Develop

This package lives in [MCP-Shadcn](https://github.com/amoree-code/Ocean-UIUX-MCP), next to the gallery
that previews every component and style.

```bash
pnpm --filter ocean-uiux-mcp bundle      # rebuild registry + examples from the repo
pnpm --filter ocean-uiux-mcp test        # unit + protocol + installer tests
pnpm --filter ocean-uiux-mcp test:e2e    # real shadcn CLI: new app, install, tsc (minutes)
```

## License

MIT. Bundled components come from MIT-licensed projects. See
[THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
