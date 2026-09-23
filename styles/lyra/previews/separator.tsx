import { Separator } from "@/styles/lyra/ui/separator"

export default function SeparatorPreview() {
  return (
    <div className="w-full max-w-xs">
      <div className="space-y-1">
        <p className="text-sm font-medium">Dashboard</p>
        <p className="text-sm text-muted-foreground">Overview and analytics</p>
      </div>
      <Separator className="my-3" />
      <div className="flex h-5 items-center gap-3 text-sm">
        <span>Reports</span>
        <Separator orientation="vertical" />
        <span>Settings</span>
      </div>
    </div>
  )
}
