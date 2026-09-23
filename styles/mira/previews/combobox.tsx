"use client"

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/styles/mira/ui/combobox"

const teams = ["Analytics", "Billing", "Support", "Infrastructure"]

export default function ComboboxPreview() {
  return (
    <div className="flex w-full max-w-xs items-center justify-center">
      <Combobox items={teams}>
        <ComboboxInput placeholder="Assign to team" />
        <ComboboxContent>
          <ComboboxEmpty>No teams found.</ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  )
}
