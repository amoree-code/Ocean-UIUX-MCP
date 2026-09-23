"use client"

import { useState } from "react"

import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger,
} from "@/components/ui/file-upload"
import { Button } from "@/styles/maia/ui/button"

export default function FileUploadPreview() {
  const [files, setFiles] = useState<File[]>(() =>
    typeof File !== "undefined"
      ? [new File(["invoice"], "invoice.pdf", { type: "application/pdf" })]
      : [],
  )

  return (
    <FileUpload
      value={files}
      onValueChange={setFiles}
      accept="image/*,application/pdf"
      maxFiles={3}
      className="w-full max-w-[280px] gap-3"
    >
      <FileUploadDropzone className="gap-1 p-3">
        <FileUploadTrigger asChild>
          <Button variant="outline" size="sm">
            Choose file
          </Button>
        </FileUploadTrigger>
        <p className="text-xs text-muted-foreground">or drag and drop</p>
      </FileUploadDropzone>
      <FileUploadList>
        {files.map((file) => (
          <FileUploadItem key={file.name} value={file}>
            <FileUploadItemPreview />
            <FileUploadItemMetadata size="sm" />
          </FileUploadItem>
        ))}
      </FileUploadList>
    </FileUpload>
  )
}
