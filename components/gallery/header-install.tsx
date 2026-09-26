"use client"

import { usePathname } from "next/navigation"
import { PlugZapIcon } from "lucide-react"

import { CopyCommandBlock } from "@/components/gallery/copy-command"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { findEntry } from "@/lib/catalog"

/** Two copy-paste snippets, always one click away from the header: the MCP server (works
 * anywhere, any AI client) and, when the current page is a component, the plain shadcn CLI
 * command for that one item — no separate "download from shadcn" step. */
export function HeaderInstall() {
  const pathname = usePathname()
  const slug = pathname.startsWith("/c/") ? pathname.slice("/c/".length) : null
  const entry = slug ? findEntry(slug) : null

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <PlugZapIcon className="size-4" />
          Install
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 space-y-3">
        <div>
          <p className="text-xs font-medium text-muted-foreground">MCP server — any AI client</p>
          <CopyCommandBlock command="npx -y ocean-uiux-mcp install" className="mt-1.5" />
        </div>
        {entry?.ui && (
          <div>
            <p className="text-xs font-medium text-muted-foreground">This component — plain shadcn CLI</p>
            <CopyCommandBlock command={`pnpm dlx shadcn add @ocean/${entry.ui}`} className="mt-1.5" />
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
