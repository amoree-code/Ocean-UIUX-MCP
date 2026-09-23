"use client"

import * as React from "react"
import { toast } from "sonner"

import type { PicksData } from "@/app/api/picks/route"

export function usePicks() {
  const [data, setData] = React.useState<PicksData>({ picks: [], notes: {} })
  const [loaded, setLoaded] = React.useState(false)

  React.useEffect(() => {
    fetch("/api/picks")
      .then((r) => r.json())
      .then((d: PicksData) => {
        setData(d)
        setLoaded(true)
      })
      .catch((e) => toast.error(`Could not load picks: ${e}`))
  }, [])

  const save = React.useCallback(async (next: PicksData) => {
    const previous = data
    setData(next)
    const res = await fetch("/api/picks", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(next),
    })
    if (!res.ok) {
      setData(previous)
      toast.error(`Saving picks failed (${res.status})`)
    }
  }, [data])

  const toggle = React.useCallback(
    (slug: string) => {
      const picks = data.picks.includes(slug)
        ? data.picks.filter((p) => p !== slug)
        : [...data.picks, slug]
      return save({ ...data, picks })
    },
    [data, save]
  )

  const setNote = React.useCallback(
    (slug: string, note: string) => {
      const notes = { ...data.notes }
      if (note.trim()) notes[slug] = note
      else delete notes[slug]
      return save({ ...data, notes })
    },
    [data, save]
  )

  return { ...data, loaded, toggle, setNote }
}
