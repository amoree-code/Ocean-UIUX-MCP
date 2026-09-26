import Link from "next/link"
import { notFound } from "next/navigation"
import { Columns3Icon, ExternalLinkIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import { ExampleView } from "@/components/gallery/example-view"
import { Button } from "@/components/ui/button"
import { catalog, findEntry } from "@/lib/catalog"

export function generateStaticParams() {
  return catalog.map((e) => ({ slug: e.slug }))
}

export default async function ComponentPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const entry = findEntry(slug)
  if (!entry) notFound()

  const index = catalog.indexOf(entry)
  const prev = catalog[index - 1]
  const next = catalog[index + 1]

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <h1 className="text-lg font-semibold tracking-tight">{entry.title}</h1>
        {entry.ui && (
          <code className="hidden rounded bg-muted px-1.5 py-0.5 font-mono text-xs md:inline">
            pnpm dlx shadcn add @ocean/{entry.ui}
            {entry.source !== "shadcn" && ` · from ${entry.source}`}
          </code>
        )}
        <div className="ms-auto flex flex-wrap items-center gap-2">
          {entry.route && (
            <Button asChild variant="outline" size="sm">
              <Link href={entry.route}>
                <ExternalLinkIcon /> Open live page
              </Link>
            </Button>
          )}
          {entry.ui && entry.source === "shadcn" && !entry.route && (
            <Button asChild variant="outline" size="sm">
              <Link href={`/compare/${slug}`}>
                <Columns3Icon />
                Compare styles
              </Link>
            </Button>
          )}
        </div>
      </div>

      <ExampleView slug={slug} community={entry.source !== "shadcn"} isBlock={Boolean(entry.route)} />

      <div className="flex flex-wrap items-center gap-2 pt-2">
        {prev && (
          <Button asChild variant="ghost" size="sm">
            <Link href={`/c/${prev.slug}`}>
              <ChevronLeftIcon className="rtl:rotate-180" />
              {prev.title}
            </Link>
          </Button>
        )}
        {next && (
          <Button asChild variant="ghost" size="sm" className="ms-auto">
            <Link href={`/c/${next.slug}`}>
              {next.title}
              <ChevronRightIcon className="rtl:rotate-180" />
            </Link>
          </Button>
        )}
      </div>
    </div>
  )
}
