"use client"

import * as React from "react"
import Link from "next/link"
import { CheckIcon, SearchIcon } from "lucide-react"

import { usePicks } from "@/components/gallery/use-picks"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { catalog, categories } from "@/lib/catalog"
import { cn } from "@/lib/utils"

export function CatalogGrid() {
  const { picks, toggle } = usePicks()
  const [query, setQuery] = React.useState("")
  const [filter, setFilter] = React.useState<"all" | "picked" | "unpicked">("all")

  const visible = catalog.filter((e) => {
    if (query && !e.title.toLowerCase().includes(query.toLowerCase())) return false
    if (filter === "picked") return picks.includes(e.slug)
    if (filter === "unpicked") return !picks.includes(e.slug)
    return true
  })

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">Pick your components</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Open any component to see every official variant. Flip RTL, dark mode, accent and
          radius from the header. Picked items go into your registry — saved to{" "}
          <code className="font-mono">picks.json</code>.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <InputGroup className="max-w-xs">
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="Search components…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </InputGroup>
        <ToggleGroup
          type="single"
          variant="outline"
          size="sm"
          value={filter}
          onValueChange={(v) => v && setFilter(v as typeof filter)}
        >
          <ToggleGroupItem value="all">All {catalog.length}</ToggleGroupItem>
          <ToggleGroupItem value="picked">Picked {picks.length}</ToggleGroupItem>
          <ToggleGroupItem value="unpicked">Not picked</ToggleGroupItem>
        </ToggleGroup>
      </div>

      {categories.map((category) => {
        const entries = visible.filter((e) => e.category === category)
        if (!entries.length) return null
        return (
          <section key={category} className="flex flex-col gap-3">
            <h2 className="text-sm font-medium text-muted-foreground">{category}</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {entries.map((entry) => {
                const picked = picks.includes(entry.slug)
                return (
                  <div
                    key={entry.slug}
                    className={cn(
                      "group relative flex flex-col gap-3 rounded-xl border bg-card p-4 transition-colors hover:border-primary/50",
                      picked && "border-primary ring-1 ring-primary"
                    )}
                  >
                    <Link href={`/c/${entry.slug}`} className="font-medium after:absolute after:inset-0">
                      {entry.title}
                    </Link>
                    <div className="flex items-center justify-between gap-2">
                      {entry.ui ? (
                        <Badge variant="secondary" className="font-mono">
                          {entry.ui}
                        </Badge>
                      ) : (
                        <Badge variant="outline">overview</Badge>
                      )}
                      <Button
                        size="xs"
                        variant={picked ? "default" : "outline"}
                        className="relative z-10"
                        onClick={() => toggle(entry.slug)}
                      >
                        {picked && <CheckIcon />}
                        {picked ? "Picked" : "Pick"}
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )
      })}
    </div>
  )
}
