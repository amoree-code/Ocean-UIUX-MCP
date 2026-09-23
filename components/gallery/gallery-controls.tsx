"use client"

import { MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"

import {
  accents,
  radii,
  useGallery,
  type Accent,
  type Radius,
} from "@/components/gallery/gallery-provider"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { styles, type Style } from "@/lib/style-loaders"

const swatch: Record<Accent, string> = {
  neutral: "oklch(0.205 0 0)",
  blue: "oklch(0.546 0.245 262.881)",
  green: "oklch(0.596 0.145 163.225)",
  violet: "oklch(0.541 0.281 293.009)",
  orange: "oklch(0.646 0.222 41.116)",
  rose: "oklch(0.586 0.253 17.585)",
}

export function GalleryControls() {
  const { settings, update } = useGallery()
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <div className="flex flex-wrap items-center gap-2">
      <ToggleGroup
        type="single"
        variant="outline"
        size="sm"
        value={settings.dir}
        onValueChange={(v) => v && update({ dir: v as "ltr" | "rtl" })}
      >
        <ToggleGroupItem value="ltr">EN · LTR</ToggleGroupItem>
        <ToggleGroupItem value="rtl">عربي · RTL</ToggleGroupItem>
      </ToggleGroup>

      <Select value={settings.style} onValueChange={(v) => update({ style: v as Style })}>
        <SelectTrigger size="sm" className="w-28" aria-label="Style">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {styles.map((s) => (
            <SelectItem key={s} value={s}>
              style {s}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={settings.accent} onValueChange={(v) => update({ accent: v as Accent })}>
        <SelectTrigger size="sm" className="w-32" aria-label="Accent color">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {accents.map((a) => (
            <SelectItem key={a} value={a}>
              <span className="size-3 rounded-full" style={{ background: swatch[a] }} />
              {a}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={settings.radius} onValueChange={(v) => update({ radius: v as Radius })}>
        <SelectTrigger size="sm" className="w-28" aria-label="Radius">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {radii.map((r) => (
            <SelectItem key={r} value={r}>
              radius {r}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        variant="outline"
        size="icon-sm"
        aria-label="Toggle dark mode"
        onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      >
        <SunIcon className="dark:hidden" />
        <MoonIcon className="hidden dark:block" />
      </Button>
    </div>
  )
}
