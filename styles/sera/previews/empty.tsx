import { InboxIcon } from "lucide-react"

import { Button } from "@/styles/sera/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/styles/sera/ui/empty"

export default function EmptyPreview() {
  return (
    <Empty className="border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <InboxIcon />
        </EmptyMedia>
        <EmptyTitle>No reports yet</EmptyTitle>
        <EmptyDescription>
          Generate your first dashboard report to see it here.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button size="sm">Create report</Button>
      </EmptyContent>
    </Empty>
  )
}
