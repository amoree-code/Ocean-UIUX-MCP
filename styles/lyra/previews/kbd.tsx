import { Kbd, KbdGroup } from "@/styles/lyra/ui/kbd"

export default function KbdPreview() {
  return (
    <div className="flex items-center gap-3 text-sm text-muted-foreground">
      <span>Search dashboard</span>
      <KbdGroup>
        <Kbd>Ctrl</Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>
    </div>
  )
}
