import { Button } from "@/styles/rhea/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/styles/rhea/ui/hover-card"

export default function HoverCardPreview() {
  return (
    <HoverCard openDelay={100} closeDelay={100}>
      <HoverCardTrigger asChild>
        <Button variant="outline">@ocean</Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-64">
        <div className="flex flex-col gap-1">
          <h4 className="font-medium">Nova Islander</h4>
          <p className="text-muted-foreground">
            Front-end developer. Owns the dashboard workspace.
          </p>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
