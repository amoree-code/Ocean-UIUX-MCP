import Link from "next/link"
import { notFound } from "next/navigation"

import { GalleryHeader } from "@/components/gallery/gallery-header"
import { StyleCompare } from "@/components/gallery/style-compare"
import { catalog, findEntry } from "@/lib/catalog"

export function generateStaticParams() {
  return catalog.filter((e) => e.ui && e.source === "shadcn" && !e.route).map((e) => ({ slug: e.slug }))
}

export default async function ComparePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const entry = findEntry(slug)
  if (!entry?.ui || entry.source !== "shadcn" || entry.route) notFound()

  return (
    <>
      <GalleryHeader>
        <span className="text-muted-foreground">/</span>
        <Link href={`/c/${slug}`} className="font-medium hover:underline">
          {entry.title}
        </Link>
        <span className="text-muted-foreground">/ styles</span>
      </GalleryHeader>
      <StyleCompare slug={slug} />
    </>
  )
}
