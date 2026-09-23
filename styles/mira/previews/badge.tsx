import { Badge } from "@/styles/mira/ui/badge"

export default function BadgePreview() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge>Active</Badge>
      <Badge variant="secondary">Pending</Badge>
      <Badge variant="destructive">Failed</Badge>
      <Badge variant="outline">Draft</Badge>
    </div>
  )
}
