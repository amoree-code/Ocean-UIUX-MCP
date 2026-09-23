#!/bin/bash
# Vendors every official shadcn style (ui + examples) into styles/<style>/ through the CLI,
# so the RTL class rewrite and alias rewrite are applied exactly as `shadcn add` would.
# Runs in a throwaway copy of the repo; only styles/ is copied back.
set -euo pipefail
REPO=$(cd "$(dirname "$0")/.." && pwd)
W=$(mktemp -d)
trap 'rm -rf "$W"' EXIT
STYLES=${STYLES:-nova vega maia lyra mira luma sera rhea}
# Examples that need the shadcn site's AI backend are skipped.
SKIP='message-example|message-scroller-example'

rsync -a --exclude node_modules --exclude .next --exclude .git --exclude styles "$REPO/" "$W/"
cd "$W"
pnpm install --frozen-lockfile >/dev/null 2>&1
EXAMPLES=$(pnpm dlx shadcn@latest search @shadcn --limit 500 2>/dev/null \
  | grep '(example)' | sed 's/- //;s/ (example).*//' | grep -vE "$SKIP" | tr '\n' ' ')

for s in $STYLES; do
  node -e '
    const fs = require("fs"); const s = process.argv[1]
    const c = JSON.parse(fs.readFileSync("components.json", "utf8"))
    c.style = `radix-${s}`
    c.aliases.components = `@/styles/${s}`
    c.aliases.ui = `@/styles/${s}/ui`
    fs.writeFileSync("components.json", JSON.stringify(c, null, 2))' "$s"
  CI=1 pnpm dlx shadcn@latest add --all -y --overwrite >"$W/$s.log" 2>&1
  CI=1 pnpm dlx shadcn@latest add $EXAMPLES -y --overwrite >>"$W/$s.log" 2>&1
  rm -rf "$REPO/styles/$s" && mkdir -p "$REPO/styles/$s"
  cp -R "styles/$s/" "$REPO/styles/$s/"
  echo "$s: $(ls styles/$s/ui | wc -l | tr -d ' ') ui, $(ls styles/$s/*.tsx | wc -l | tr -d ' ') examples"
done
node "$REPO/scripts/gen-style-loaders.mjs"
