"use client"

import { useGallery } from "@/components/gallery/gallery-provider"
import { StyledModule } from "@/components/gallery/styled-module"

export function ExampleView({ slug, community }: { slug: string; community: boolean }) {
  const { settings } = useGallery()
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
