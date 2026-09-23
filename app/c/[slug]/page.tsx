import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronLeftIcon, ChevronRightIcon, Columns3Icon } from "lucide-react"

import { ExampleView } from "@/components/gallery/example-view"
import { GalleryHeader } from "@/components/gallery/gallery-header"
import { PickBar } from "@/components/gallery/pick-bar"
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
    <>
      <GalleryHeader>
        <span className="text-muted-foreground">/</span>
        <span className="font-medium">{entry.title}</span>
        {entry.ui && (
          <code className="hidden rounded bg-muted px-1.5 py-0.5 font-mono text-xs md:inline">
            pnpm dlx shadcn add @ameer/{entry.ui}
            {entry.source !== "shadcn" && ` · from ${entry.source}`}
          </code>
        )}
      </GalleryHeader>
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-4 pt-4">
        {prev && (
          <Button asChild variant="ghost" size="sm">
            <Link href={`/c/${prev.slug}`}>
              <ChevronLeftIcon className="rtl:rotate-180" />
              {prev.title}
            </Link>
          </Button>
        )}
        {next && (
          <Button asChild variant="ghost" size="sm">
            <Link href={`/c/${next.slug}`}>
              {next.title}
              <ChevronRightIcon className="rtl:rotate-180" />
            </Link>
          </Button>
        )}
        <div className="ms-auto flex flex-wrap items-center gap-2">
          {entry.ui && entry.source === "shadcn" && (
            <Button asChild variant="outline" size="sm">
              <Link href={`/compare/${slug}`}>
                <Columns3Icon />
                Compare styles
              </Link>
            </Button>
          )}
          <PickBar slug={slug} />
        </div>
      </div>
      <ExampleView slug={slug} community={entry.source !== "shadcn"} />
    </>
  )
}
