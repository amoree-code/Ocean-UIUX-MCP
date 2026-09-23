import Link from "next/link"

import { GalleryControls } from "@/components/gallery/gallery-controls"

export function GalleryHeader({ children }: { children?: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3">
        <Link href="/" className="font-semibold tracking-tight">
          Ocean UI/UX
        </Link>
        {children}
        <div className="ms-auto">
          <GalleryControls />
        </div>
      </div>
    </header>
  )
}
