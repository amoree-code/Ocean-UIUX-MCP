import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/styles/sera/ui/resizable"

export default function ResizablePreview() {
  return (
    <ResizablePanelGroup
      orientation="horizontal"
      className="h-40 w-full max-w-xs rounded-lg border"
    >
      <ResizablePanel defaultSize="40%">
        <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
          Sidebar
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize="60%">
        <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
          Dashboard
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
