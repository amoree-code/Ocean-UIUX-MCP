"use client"

import { useState } from "react"
import { GripVertical } from "lucide-react"

import { Sortable, SortableContent, SortableItem, SortableItemHandle } from "@/components/ui/sortable"

const initialItems = [
  { id: "homepage", label: "Homepage banner" },
  { id: "pricing", label: "Pricing table" },
  { id: "footer", label: "Footer links" },
]

export default function SortablePreview() {
  const [items, setItems] = useState(initialItems)

  return (
    <Sortable
      value={items}
      onValueChange={setItems}
      getItemValue={(item) => item.id}
    >
      <SortableContent className="flex w-full max-w-[280px] flex-col gap-2">
        {items.map((item) => (
          <SortableItem
            key={item.id}
            value={item.id}
            className="flex items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm"
          >
            <SortableItemHandle className="text-muted-foreground">
              <GripVertical className="size-4" />
            </SortableItemHandle>
            {item.label}
          </SortableItem>
        ))}
      </SortableContent>
    </Sortable>
  )
}
