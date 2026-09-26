"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { SearchIcon } from "lucide-react"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { catalog, categories } from "@/lib/catalog"

/** Ranks an exact/prefix/substring match well above a sparse fuzzy one, so "side" surfaces
 * "Sidebar" (a real substring) before "Slider" (only a scattered subsequence match) — cmdk's
 * default filter is pure fuzzy-subsequence and doesn't make that distinction. */
function scoreMatch(value: string, search: string): number {
  if (!search) return 1
  const v = value.toLowerCase()
  const s = search.toLowerCase()
  if (v === s) return 1
  if (v.startsWith(s)) return 0.9
  const idx = v.indexOf(s)
  if (idx !== -1) return Math.max(0.5, 0.7 - idx * 0.01)

  let cursor = 0
  let first = -1
  let last = -1
  for (const ch of s) {
    const found = v.indexOf(ch, cursor)
    if (found === -1) return 0
    if (first === -1) first = found
    last = found
    cursor = found + 1
  }
  const density = s.length / (last - first + 1)
  return 0.3 * density
}

/** Highlights the query substring inside title, when it appears contiguously — cmdk's own
 * fuzzy scoring still drives which items show and their order; this only marks *where* a
 * plain substring match landed, so the reason an item is on screen is visible at a glance. */
function Highlighted({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>
  const i = text.toLowerCase().indexOf(query.toLowerCase())
  if (i === -1) return <>{text}</>
  return (
    <>
      {text.slice(0, i)}
      <mark className="rounded-xs bg-primary/20 text-inherit">{text.slice(i, i + query.length)}</mark>
      {text.slice(i + query.length)}
    </>
  )
}

export function CommandSearch() {
  const [open, setOpen] = React.useState(false)
  // Mounts the palette's contents (cmdk's Command tree) only once actually opened: skips the
  // work on every page load, and sidesteps a dev-mode cmdk/React double-render race that logs
  // a harmless "reading 'subscribe'" error on an idle, never-opened instance.
  const [everOpened, setEverOpened] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const router = useRouter()

  const openPalette = () => {
    setEverOpened(true)
    setOpen(true)
  }

  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setEverOpened(true)
        setOpen((v) => !v)
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [])

  const go = (href: string) => {
    setOpen(false)
    setQuery("")
    router.push(href)
  }

  // While searching: one flat list, ranked purely by match quality — the whole point of a
  // score is that it decides order, which a fixed category-group layout can't express (a
  // strong match in a later group would otherwise still render below a weak one in an
  // earlier group). Empty query: back to normal browse-by-category.
  const results = query
    ? catalog
        .map((entry) => ({ entry, score: scoreMatch(entry.title, query) }))
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 40)
        .map(({ entry }) => entry)
    : null

  return (
    <>
      <Button
        variant="outline"
        className="w-full justify-start gap-2 text-muted-foreground"
        onClick={openPalette}
      >
        <SearchIcon className="size-4" />
        Search components…
        <kbd className="ms-auto rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px]">⌘K</kbd>
      </Button>
      {everOpened && (
        <CommandDialog
          open={open}
          onOpenChange={setOpen}
          title="Search components"
          description="Jump to any component, block or style by name"
          shouldFilter={false}
        >
          <CommandInput placeholder="Search components…" value={query} onValueChange={setQuery} />
          <CommandList>
            <CommandEmpty>No matches for &ldquo;{query}&rdquo;.</CommandEmpty>
            {results ? (
              <CommandGroup heading={`${results.length} match${results.length === 1 ? "" : "es"}`}>
                {results.map((entry) => (
                  <CommandItem
                    key={entry.slug}
                    value={entry.slug}
                    onSelect={() => go(entry.route ?? `/c/${entry.slug}`)}
                  >
                    <span>
                      <Highlighted text={entry.title} query={query} />
                    </span>
                    <span className="ms-1 text-xs text-muted-foreground">{entry.category}</span>
                    {entry.source !== "shadcn" && (
                      <span className="ms-auto font-mono text-[10px] text-muted-foreground">{entry.source}</span>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : (
              categories.map((group) => (
                <CommandGroup key={group} heading={group}>
                  {catalog
                    .filter((e) => e.category === group)
                    .map((entry) => (
                      <CommandItem
                        key={entry.slug}
                        value={entry.slug}
                        onSelect={() => go(entry.route ?? `/c/${entry.slug}`)}
                      >
                        <span>{entry.title}</span>
                        {entry.source !== "shadcn" && (
                          <span className="ms-auto font-mono text-[10px] text-muted-foreground">{entry.source}</span>
                        )}
                      </CommandItem>
                    ))}
                </CommandGroup>
              ))
            )}
          </CommandList>
        </CommandDialog>
      )}
    </>
  )
}
