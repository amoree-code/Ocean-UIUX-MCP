import { readFile, writeFile } from "node:fs/promises"
import path from "node:path"

import { z } from "zod"

import { catalog } from "@/lib/catalog"

// Picks are written to the repo so the registry build (and Claude) can read them.
// Dev-only: a deployed build is read-only and has no reason to accept writes.
const PICKS_FILE = path.join(process.cwd(), "picks.json")

const slugs = catalog.map((e) => e.slug) as [string, ...string[]]

const Picks = z.object({
  picks: z.array(z.enum(slugs)),
  notes: z.partialRecord(z.enum(slugs), z.string().max(500)).default({}),
})

export type PicksData = z.infer<typeof Picks>

async function readPicks(): Promise<PicksData> {
  try {
    return Picks.parse(JSON.parse(await readFile(PICKS_FILE, "utf8")))
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return { picks: [], notes: {} }
    throw error
  }
}

export async function GET() {
  return Response.json(await readPicks())
}

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return Response.json({ error: "picks are only editable in dev" }, { status: 403 })
  }
  const parsed = Picks.safeParse(await request.json())
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues }, { status: 400 })
  }
  const data = { ...parsed.data, picks: [...new Set(parsed.data.picks)].sort() }
  await writeFile(PICKS_FILE, JSON.stringify(data, null, 2) + "\n")
  return Response.json(data)
}
