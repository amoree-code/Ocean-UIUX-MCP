"use client"

import * as React from "react"

import { DirectionProvider } from "@/components/ui/direction"
import { TooltipProvider } from "@/components/ui/tooltip"
import { styles, type Style } from "@/lib/style-loaders"

export const accents = ["neutral", "blue", "green", "violet", "orange", "rose"] as const
export const radii = ["0", "0.3", "0.5", "0.625", "0.75", "1"] as const

export type Accent = (typeof accents)[number]
export type Radius = (typeof radii)[number]
export type Dir = "ltr" | "rtl"

type Settings = { dir: Dir; accent: Accent; radius: Radius; style: Style }

const defaults: Settings = { dir: "ltr", accent: "neutral", radius: "0.625", style: "nova" }
const STORAGE_KEY = "gallery-settings"

const GalleryContext = React.createContext<{
  settings: Settings
  update: (patch: Partial<Settings>) => void
} | null>(null)

export function useGallery() {
  const ctx = React.useContext(GalleryContext)
  if (!ctx) throw new Error("useGallery must be used inside <GalleryProvider>")
  return ctx
}

// Per-viewer convenience only; the gallery renders fine with the defaults.
function readStored(): Settings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const stored = raw ? { ...defaults, ...JSON.parse(raw) } : defaults
    // a style removed since the last visit falls back to the default
    return styles.includes(stored.style) ? stored : { ...stored, style: defaults.style }
  } catch {
    return defaults
  }
}

export function GalleryProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = React.useState<Settings>(defaults)

  React.useEffect(() => setSettings(readStored()), [])

  React.useEffect(() => {
    const html = document.documentElement
    html.dir = settings.dir
    html.lang = settings.dir === "rtl" ? "ar" : "en"
    html.dataset.accent = settings.accent
    html.style.setProperty("--radius", `${settings.radius}rem`)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    } catch {
      // storage unavailable (private mode); settings still apply for this visit
    }
  }, [settings])

  const update = React.useCallback(
    (patch: Partial<Settings>) => setSettings((s) => ({ ...s, ...patch })),
    []
  )

  return (
    <GalleryContext.Provider value={{ settings, update }}>
      <DirectionProvider dir={settings.dir}>
        <TooltipProvider>{children}</TooltipProvider>
      </DirectionProvider>
    </GalleryContext.Provider>
  )
}
