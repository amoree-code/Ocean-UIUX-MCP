"use client"

import {
  Expandable,
  ExpandableCard,
  ExpandableCardContent,
  ExpandableCardHeader,
  ExpandableContent,
  ExpandableTrigger,
} from "@/components/ui/expandable"

export default function ExpandablePreview() {
  return (
    <Expandable expandDirection="vertical">
      {({ isExpanded }) => (
        <ExpandableTrigger>
          <ExpandableCard collapsedSize={{ width: 260, height: 90 }} hoverToExpand>
            <ExpandableCardHeader>
              <div>
                <p className="font-medium">Q3 dashboard revamp</p>
                <p className="text-xs text-muted-foreground">Due Friday</p>
              </div>
            </ExpandableCardHeader>
            <ExpandableContent preset="slide-down">
              <ExpandableCardContent>
                <p className="text-sm text-muted-foreground">
                  {isExpanded
                    ? "Charts, filters and the export flow are done; RTL pass is next."
                    : "Hover to preview…"}
                </p>
              </ExpandableCardContent>
            </ExpandableContent>
          </ExpandableCard>
        </ExpandableTrigger>
      )}
    </Expandable>
  )
}
