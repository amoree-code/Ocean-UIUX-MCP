import { Button } from "@/styles/vega/ui/button"
import { PlusIcon } from "lucide-react"

export default function ButtonPreview() {
  return (
    <div className="flex w-full max-w-xs flex-wrap items-center justify-center gap-2">
      <Button>New report</Button>
      <Button variant="outline">Export</Button>
      <Button variant="ghost" size="icon">
        <PlusIcon />
      </Button>
    </div>
  )
}
