"use client"

import { ChevronsUpDownIcon } from "lucide-react"

import { Button } from "@/styles/nova/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/styles/nova/ui/collapsible"

export default function CollapsiblePreview() {
  return (
    <Collapsible defaultOpen className="w-full max-w-xs space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Recent alerts (3)</span>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="icon-sm">
            <ChevronsUpDownIcon />
          </Button>
        </CollapsibleTrigger>
      </div>
      <div className="rounded-md border px-3 py-2 text-sm">CPU usage spiked</div>
      <CollapsibleContent className="space-y-2">
        <div className="rounded-md border px-3 py-2 text-sm">Disk 92% full</div>
        <div className="rounded-md border px-3 py-2 text-sm">Backup delayed</div>
      </CollapsibleContent>
    </Collapsible>
  )
}
