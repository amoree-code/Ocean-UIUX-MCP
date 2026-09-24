"use client"

import * as React from "react"
import Link from "next/link"
import { CheckIcon, Columns3Icon, PlugZapIcon, SearchIcon, TerminalIcon } from "lucide-react"

import { CopyCommandBlock, CopyCommandButton } from "@/components/gallery/copy-command"
import { useGallery } from "@/components/gallery/gallery-provider"
import { StyledModule, WhenVisible } from "@/components/gallery/styled-module"
import { usePicks } from "@/components/gallery/use-picks"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { catalog, categories } from "@/lib/catalog"
import { cn } from "@/lib/utils"

export function CatalogGrid() {
  const { picks, toggle } = usePicks()
  const { settings } = useGallery()
  const [query, setQuery] = React.useState("")
  const [filter, setFilter] = React.useState<"all" | "picked" | "unpicked">("all")
  const [category, setCategory] = React.useState<string>("all")
  const [source, setSource] = React.useState<"all" | "official" | "community">("all")
  // Read after mount only: the deployed origin varies (preview URL, custom domain, localhost),
  // so the command must reflect wherever this page is actually being served from.
  const [origin, setOrigin] = React.useState("")
  React.useEffect(() => setOrigin(window.location.origin), [])

  const visible = catalog.filter((e) => {
    if (query && !e.title.toLowerCase().includes(query.toLowerCase())) return false
    if (category !== "all" && e.category !== category) return false
    if (source === "official" && e.source !== "shadcn") return false
    if (source === "community" && e.source === "shadcn") return false
    if (filter === "picked") return picks.includes(e.slug)
    if (filter === "unpicked") return !picks.includes(e.slug)
    return true
  })

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">Pick your components</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Every card is the live component. Switch style, RTL, dark mode, accent and radius
          from the header; open a card for every official variant, or compare it across all
          styles. Picked items go into your registry — saved to{" "}
          <code className="font-mono">picks.json</code>.
        </p>
      </div>

      <div className="flex flex-col gap-2 rounded-xl border bg-card p-4">
        <div className="flex items-center gap-2 text-sm font-medium">
          <PlugZapIcon className="size-4 text-muted-foreground" />
          Connect this registry to an AI client
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <CopyCommandBlock command="npx -y ocean-uiux-mcp install" />
          <CopyCommandBlock command={`${origin || "https://ocean-uiux-mcp.vercel.app"}/api/mcp`} />
        </div>
        <p className="text-xs text-muted-foreground">
          Left: installs the full local MCP server (search, install, RTL setup) into every AI
          client on your machine. Right: a remote read-only endpoint — search and inspect
          components by URL alone, no install. Every card below also has its own{" "}
          <TerminalIcon className="inline size-3" /> button with the plain shadcn install command
          for that one component.
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
        <ToggleGroup
          type="single"
          variant="outline"
          size="sm"
          value={source}
          onValueChange={(v) => v && setSource(v as typeof source)}
        >
          <ToggleGroupItem value="all">All sources</ToggleGroupItem>
          <ToggleGroupItem value="official">Official</ToggleGroupItem>
          <ToggleGroupItem value="community">
            Community {catalog.filter((e) => e.source !== "shadcn").length}
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="flex flex-wrap gap-2">
        {["all", ...categories].map((c) => (
          <Button
            key={c}
            size="sm"
            variant={category === c ? "default" : "secondary"}
            onClick={() => setCategory(c)}
          >
            {c === "all" ? "All categories" : c}
            <span className="text-xs opacity-60">
              {c === "all" ? catalog.length : catalog.filter((e) => e.category === c).length}
            </span>
          </Button>
        ))}
      </div>

      {categories.map((group) => {
        const entries = visible.filter((e) => e.category === group)
        if (!entries.length) return null
        return (
          <section key={group} className="flex flex-col gap-3">
            <h2 className="text-lg font-semibold tracking-tight">
              {group} <span className="text-sm font-normal text-muted-foreground">{entries.length}</span>
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {entries.map((entry) => {
                const picked = picks.includes(entry.slug)
                return (
                  <div
                    key={entry.slug}
                    className={cn(
                      "flex flex-col overflow-hidden rounded-xl border bg-card transition-colors hover:border-primary/50",
                      picked && "border-primary ring-1 ring-primary"
                    )}
                  >
                    <WhenVisible className="flex h-56 items-center justify-center overflow-hidden border-b bg-muted/40 p-4 dark:bg-background">
                      {entry.ui ? (
                        <StyledModule
                          kind="preview"
                          style={settings.style}
                          slug={entry.slug}
                          className="flex w-full items-center justify-center"
                        />
                      ) : (
                        <Button asChild variant="outline">
                          <Link href={`/c/${entry.slug}`}>Open full overview</Link>
                        </Button>
                      )}
                    </WhenVisible>
                    <div className="flex items-center gap-2 p-3">
                      <Link href={`/c/${entry.slug}`} className="font-medium hover:underline">
                        {entry.title}
                      </Link>
                      {entry.source !== "shadcn" && (
                        <Badge variant="outline" className="font-mono">
                          {entry.source}
                        </Badge>
                      )}
                      <div className="ms-auto flex items-center gap-1">
                        {entry.ui && (
                          <CopyCommandButton
                            command={`npx shadcn@latest add ${origin || "https://ocean-uiux-mcp.vercel.app"}/r/${entry.ui}.json`}
                            label={`Copy npx install command for ${entry.title}`}
                            icon={<TerminalIcon />}
                          />
                        )}
                        {entry.ui && entry.source === "shadcn" && (
                          <Button asChild size="icon-xs" variant="ghost" aria-label={`Compare ${entry.title} across styles`}>
                            <Link href={`/compare/${entry.slug}`}>
                              <Columns3Icon />
                            </Link>
                          </Button>
                        )}
                        <Button
                          size="xs"
                          variant={picked ? "default" : "outline"}
                          onClick={() => toggle(entry.slug)}
                        >
                          {picked && <CheckIcon />}
                          {picked ? "Picked" : "Pick"}
                        </Button>
                      </div>
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
