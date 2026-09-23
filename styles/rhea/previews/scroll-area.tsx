import { ScrollArea } from "@/styles/rhea/ui/scroll-area"

const events = [
  "Deploy succeeded — main",
  "New signup — Layla Kareem",
  "Payment received — $240",
  "Alert cleared — CPU normal",
  "Backup completed",
  "New signup — Omar Hassan",
]

export default function ScrollAreaPreview() {
  return (
    <ScrollArea className="h-40 w-full max-w-xs rounded-md border p-3">
      <div className="flex flex-col gap-2 text-sm">
        {events.map((event) => (
          <div key={event} className="text-muted-foreground">
            {event}
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}
