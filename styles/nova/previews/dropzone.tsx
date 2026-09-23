import { Dropzone, DropzoneEmptyState } from "@/components/kibo-ui/dropzone"

export default function DropzonePreview() {
  return (
    <div className="w-full max-w-[280px]">
      <Dropzone accept={{ "image/*": [] }} maxFiles={5} className="h-32 p-4">
        <DropzoneEmptyState />
      </Dropzone>
    </div>
  )
}
