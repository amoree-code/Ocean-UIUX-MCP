# shadcn/ui — research notes (2026-09-23)

`verified` = ran it locally or read it from ui.shadcn.com. `unverified` = secondary source only.

## Versions in this repo (verified, local)

- CLI `shadcn@4.21.0` · Next.js 16.3.4 (Turbopack) · React 19.2 · Tailwind v4 · zod 4
- Style `radix-nova`, `rtl: true`, base color neutral, icons lucide
- Presets offered by `init -p`: nova, vega, maia, lyra, mira, luma, sera, rhea
- Bases offered by `init -b`: radix, base (Base UI — the default since Jul 2026), aria
- Official `@shadcn` registry: 62 ui · 65 examples · 30 blocks · 52 fonts · 2 styles
- `npx shadcn` is broken on this machine (corrupt `~/.npm/_npx` ajv); use `pnpm dlx shadcn@latest`

## CLI commands (verified via `--help`)

`init|create` · `apply <preset>` · `add` (`--diff`, `--dry-run`, `--overwrite`) · `docs` · `view` ·
`search|list` · `migrate (cn|icons|base-color|rtl|radix)` · `eject` · `info` · `build` ·
`mcp init --client claude|cursor|vscode|codex` · `preset decode|resolve|url|open` ·
`registry add|validate`

## Registry (verified from docs)

- `registry.json` at the root lists items; `shadcn build` inlines the files into `public/r/<name>.json`.
- Item types: `registry:ui|component|block|hook|lib|page|file|style|theme|base|font|item|example`.
- Consumers add a namespace in `components.json`:

  ```json
  "registries": {
    "@ameer": {
      "url": "https://<host>/r/{name}.json",
      "headers": { "Authorization": "Bearer ${AMEER_REGISTRY_TOKEN}" }
    }
  }
  ```

  `${ENV}` is expanded from the environment (or `.env.local`), so the token never lands in a file.
- Private **GitHub** registries have been supported since Jun 2026, using `gh` credentials or an env token. A private repo can be
  the registry with no hosting at all. Best fit for "personal + StarSphere work".
- `include` (May 2026) composes one registry out of several `registry.json` files, and `registry validate` checks it.

## MCP (verified from docs)

- Official server: `pnpm dlx shadcn@latest mcp`. It works with every registry in the project's
  `components.json`, private ones included. Setup per client: `shadcn mcp init --client claude`.
- `.mcp.json`: `{ "mcpServers": { "shadcn": { "command": "npx", "args": ["shadcn@latest", "mcp"] } } }`
- Exact tool names are `unverified`. To confirm, run the server and list its tools.
- Third-party servers (Jpisnice, magnusrodseth, PrimeDX…) predate registry support. They add nothing we need.

## RTL (verified)

- `init --rtl` or `"rtl": true` makes the CLI rewrite physical classes (`ml-`/`left-`) to logical ones
  (`ms-`/`start-`) on add. Directional icons get `rtl:rotate-180`.
- You still need `DirectionProvider` (`components/ui/direction.tsx`) and `<html dir lang>`. The provider
  does not set `dir` on the DOM.
- Manual RTL review is needed for **Calendar, Pagination, Sidebar**. `tw-animate-css` slide utilities misbehave
  on portaled content, so pass `dir` to portals.
- Existing projects: `shadcn migrate rtl`.

## Upstream example bugs patched here

- `context-menu-example`: used Base UI `side="inline-*"` on Radix, mapped to `left`/`right`.
- `chart-example`: imported the shadcn site's internal `@/app/(create)` hook, replaced with a constant.
- `message-example`, `message-scroller-example`: need the site's AI backend, so they are dropped from the gallery
  (the `message` / `message-scroller` ui components are kept).
- Scaffold's `pnpm lint` crashes because `eslint@10` is incompatible with `eslint-plugin-react@7`. The crash is upstream, not in our code.

## Ecosystem (mostly `unverified` licensing)

| Registry | What | Notes |
|---|---|---|
| Magic UI `@magicui` | animated marketing components | free |
| Aceternity `@aceternity` | hero/effects | free + pro |
| Origin UI / coss | form & input primitives | free |
| Kibo UI `@kibo-ui` | configurable app components | free |
| ReUI (keenthemes) | ~1.6k items | free core |
| animate-ui | animated primitives | open source |
| shadcnblocks, 21st.dev | block marketplaces | paid / membership |
| tweakcn | theme editor (oklch, Tailwind v4) | free, OSS |
| tablecn (sadmann7) | server-side data table (TanStack + Drizzle) | reference for 1M+ row dashboards |

Third-party registries are not RTL-tested. Run `migrate rtl` on anything imported from them.

Directory of ~300 community registries: https://ui.shadcn.com/docs/directory

## Sources

ui.shadcn.com/docs/{cli,registry,registry/registry-item-json,components-json,mcp,rtl,theming,changelog} ·
github.com/shadcn-ui/registry-template · tweakcn.com · registry.directory
