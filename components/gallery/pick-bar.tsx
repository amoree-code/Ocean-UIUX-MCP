"use client"

import * as React from "react"
import { CheckIcon } from "lucide-react"

import { usePicks } from "@/components/gallery/use-picks"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function PickBar({ slug }: { slug: string }) {
  const { picks, notes, loaded, toggle, setNote } = usePicks()
  const picked = picks.includes(slug)
  const [draft, setDraft] = React.useState("")

  React.useEffect(() => setDraft(notes[slug] ?? ""), [loaded, notes, slug])

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Input
        className="h-7 w-64 text-xs"
        placeholder="Note, e.g. only outline + ghost"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => draft !== (notes[slug] ?? "") && setNote(slug, draft)}
      />
      <Button size="sm" variant={picked ? "default" : "outline"} onClick={() => toggle(slug)}>
        {picked && <CheckIcon />}
        {picked ? "Picked" : "Pick for registry"}
      </Button>
    </div>
  )
}
