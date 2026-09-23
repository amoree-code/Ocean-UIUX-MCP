# Previews

One compact, live preview per catalog slug, shown in the gallery cards and in the
style comparison. `scripts/gen-styles.mjs` copies each file into `styles/<style>/previews/`
with `@/components/ui/` rewritten to `@/styles/<style>/ui/`.

Rules:
- File name = catalog slug (`button.tsx`), default export, no props.
- Import only from `@/components/ui/*`, `lucide-react`, `react`, `@/lib/utils`.
- Fits a ~320×200 card: one representative use, not every variant.
- Logical classes only (`ms-/me-/ps-/pe-/start-/end-/text-start`), so RTL flips.
- Overlays (dialog, sheet, popover…) render their trigger; do not render open by default.
