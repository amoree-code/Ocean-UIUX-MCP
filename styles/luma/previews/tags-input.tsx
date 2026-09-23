"use client"

import { useState } from "react"

import {
  TagsInput,
  TagsInputInput,
  TagsInputItem,
  TagsInputLabel,
  TagsInputList,
} from "@/components/ui/tags-input"

export default function TagsInputPreview() {
  const [tags, setTags] = useState(["billing", "urgent"])

  return (
    <div className="w-full max-w-[280px]">
      <TagsInput value={tags} onValueChange={setTags}>
        <TagsInputLabel className="text-xs text-muted-foreground">
          Ticket labels
        </TagsInputLabel>
        <TagsInputList>
          {tags.map((tag) => (
            <TagsInputItem key={tag} value={tag}>
              {tag}
            </TagsInputItem>
          ))}
          <TagsInputInput placeholder="Add label..." />
        </TagsInputList>
      </TagsInput>
    </div>
  )
}
