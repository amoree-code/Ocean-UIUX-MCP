"use client"

import { useGallery } from "@/components/gallery/gallery-provider"
import { StyledModule } from "@/components/gallery/styled-module"

export function ExampleView({
  slug,
  community,
  isBlock,
}: {
  slug: string
  community: boolean
  isBlock?: boolean
}) {
  const { settings } = useGallery()
  if (isBlock) {
    // A full page in miniature. Most blocks render their own <Sidebar>, which shadcn/ui
    // positions with `fixed` relative to the viewport — without `contain: layout` here it
    // would break out of this pane and cover the real nav sidebar instead of sitting inside it.
    return (
      <div
        className="relative w-full overflow-hidden rounded-xl border bg-muted/40 dark:bg-background"
        style={{ contain: "layout" }}
      >
        <StyledModule kind="preview" style={settings.style} slug={slug} className="min-h-[70vh] w-full" />
      </div>
    )
  }
  if (community) {
    // Community items ship one demo, not a per-style variant sheet.
    return (
      <div className="w-full bg-muted py-12 dark:bg-background">
        <StyledModule
          kind="preview"
          style={settings.style}
          slug={slug}
          className="mx-auto flex max-w-3xl items-center justify-center rounded-xl bg-card p-12"
        />
      </div>
    )
  }
  return <StyledModule kind="example" style={settings.style} slug={slug} />
}
