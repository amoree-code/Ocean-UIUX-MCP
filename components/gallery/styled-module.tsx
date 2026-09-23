"use client"

import * as React from "react"

import { Skeleton } from "@/components/ui/skeleton"
import { exampleLoaders, previewLoaders, type Style } from "@/lib/style-loaders"
import { cn } from "@/lib/utils"

type Kind = "example" | "preview"

const cache = new Map<string, React.LazyExoticComponent<React.ComponentType>>()

function lazyFor(kind: Kind, style: Style, slug: string) {
  const key = `${kind}:${style}:${slug}`
  let Comp = cache.get(key)
  if (!Comp) {
    const load = (kind === "example" ? exampleLoaders : previewLoaders)[style][slug]
    if (!load) return null
    Comp = React.lazy(load)
    cache.set(key, Comp)
  }
  return Comp
}

class ModuleBoundary extends React.Component<
  { label: string; children: React.ReactNode },
  { error: Error | null }
> {
  state = { error: null as Error | null }
  static getDerivedStateFromError(error: Error) {
    return { error }
  }
  render() {
    if (this.state.error) {
      return (
        <p className="p-4 text-xs text-destructive">
          {this.props.label} failed to render: {this.state.error.message}
        </p>
      )
    }
    return this.props.children
  }
}

export function StyledModule({
  kind,
  style,
  slug,
  className,
}: {
  kind: Kind
  style: Style
  slug: string
  className?: string
}) {
  const Comp = lazyFor(kind, style, slug)
  if (!Comp) {
    return <p className="p-4 text-xs text-muted-foreground">No {kind} for {slug} yet.</p>
  }
  return (
    <div className={cn(`style-${style}`, className)} data-style={style}>
      <ModuleBoundary key={`${style}:${slug}`} label={`${slug} (${style})`}>
        <React.Suspense fallback={<Skeleton className="h-full min-h-24 w-full" />}>
          <Comp />
        </React.Suspense>
      </ModuleBoundary>
    </div>
  )
}

/** Renders children only once the element scrolls near the viewport. */
export function WhenVisible({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [visible, setVisible] = React.useState(false)

  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          io.disconnect()
        }
      },
      { rootMargin: "300px" }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} className={className}>
      {visible ? children : null}
    </div>
  )
}
