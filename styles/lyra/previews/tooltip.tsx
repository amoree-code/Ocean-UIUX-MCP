import { Button } from "@/styles/lyra/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/styles/lyra/ui/tooltip"
import { RefreshCwIcon } from "lucide-react"

export default function TooltipPreview() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline" size="icon-sm">
          <RefreshCwIcon />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Refresh dashboard data</p>
      </TooltipContent>
    </Tooltip>
  )
}
