import { Toggle } from "@/styles/rhea/ui/toggle"
import { BellIcon, PinIcon, StarIcon } from "lucide-react"

export default function TogglePreview() {
  return (
    <div className="flex w-full max-w-xs items-center justify-center gap-2">
      <Toggle aria-label="Toggle pin" variant="outline">
        <PinIcon />
      </Toggle>
      <Toggle aria-label="Toggle star" variant="outline" defaultPressed>
        <StarIcon />
      </Toggle>
      <Toggle aria-label="Toggle notifications" variant="outline">
        <BellIcon />
      </Toggle>
    </div>
  )
}
