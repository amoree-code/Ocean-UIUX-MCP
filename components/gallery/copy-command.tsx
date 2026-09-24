"use client"

import * as React from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

async function copy(command: string) {
  try {
    await navigator.clipboard.writeText(command)
    toast.success("Copied to clipboard", { description: command })
  } catch {
    // Clipboard access can be denied (insecure context, permissions policy, browser quirk) —
    // still show the command so it can be selected and copied by hand.
    toast.error("Couldn't access the clipboard", { description: command })
  }
}

/** Icon-only copy button, e.g. next to a card title. */
export function CopyCommandButton({
  command,
  label,
  icon,
  className,
}: {
  command: string
  label: string
  icon: React.ReactNode
  className?: string
}) {
  return (
    <Button
      size="icon-xs"
      variant="ghost"
      aria-label={label}
      className={className}
      onClick={() => copy(command)}
    >
      {icon}
    </Button>
  )
}

/** A code block styled as a terminal command, click (or the button) copies it. */
export function CopyCommandBlock({ command, className }: { command: string; className?: string }) {
  return (
    <button
      type="button"
      onClick={() => copy(command)}
      className={cn(
        "group flex w-full items-center justify-between gap-3 rounded-lg border bg-muted/40 px-3 py-2 text-start font-mono text-xs",
        "hover:bg-muted/70",
        className
      )}
    >
      <code className="overflow-x-auto whitespace-nowrap">{command}</code>
      <span className="shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100">Copy</span>
    </button>
  )
}
