"use client"

import * as React from "react"
import { CheckIcon } from "lucide-react"

import { useGallery } from "@/components/gallery/gallery-provider"
import { StyledModule } from "@/components/gallery/styled-module"
import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { styles } from "@/lib/style-loaders"
import { cn } from "@/lib/utils"

export function StyleCompare({ slug }: { slug: string }) {
  const { settings, update } = useGallery()
  const [kind, setKind] = React.useState<"preview" | "example">("preview")

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6">
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-sm text-muted-foreground">
          Same component, every official style. The active style drives the whole gallery.
        </p>
        <ToggleGroup
          type="single"
          variant="outline"
          size="sm"
          className="ms-auto"
          value={kind}
          onValueChange={(v) => v && setKind(v as typeof kind)}
        >
          <ToggleGroupItem value="preview">Compact</ToggleGroupItem>
          <ToggleGroupItem value="example">All variants</ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div className={cn("grid gap-4", kind === "preview" ? "sm:grid-cols-2 xl:grid-cols-4" : "grid-cols-1")}>
        {styles.map((style) => {
          const active = settings.style === style
          return (
            <div
              key={style}
              className={cn(
                "flex flex-col overflow-hidden rounded-xl border bg-card",
                active && "border-primary ring-1 ring-primary"
              )}
            >
              <div className="flex items-center gap-2 border-b px-3 py-2">
                <span className="font-medium capitalize">{style}</span>
                <Button
                  size="xs"
                  className="ms-auto"
                  variant={active ? "default" : "outline"}
                  onClick={() => update({ style })}
                >
                  {active && <CheckIcon />}
                  {active ? "Active style" : "Use this style"}
                </Button>
              </div>
              <StyledModule
                kind={kind}
                style={style}
                slug={slug}
                className={cn(
                  kind === "preview" &&
                    "flex h-60 items-center justify-center overflow-hidden bg-muted/40 p-4 dark:bg-background"
                )}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
