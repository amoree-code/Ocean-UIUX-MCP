"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboardIcon } from "lucide-react"

import { CommandSearch } from "@/components/gallery/command-search"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { catalog, categories } from "@/lib/catalog"

export function GallerySidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader className="gap-3 border-b px-3 py-3">
        <div className="flex items-baseline justify-between px-1">
          <Link href="/" className="font-semibold tracking-tight">
            Ocean UI/UX
          </Link>
          <span className="text-xs text-muted-foreground">{catalog.length} total</span>
        </div>
        <CommandSearch />
      </SidebarHeader>
      <SidebarContent>
        {categories.map((group) => {
          const entries = catalog.filter((e) => e.category === group)
          if (!entries.length) return null
          return (
            <SidebarGroup key={group}>
              <SidebarGroupLabel>
                {group} <span className="ms-1 opacity-60">{entries.length}</span>
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {entries.map((entry) => {
                    const href = `/c/${entry.slug}`
                    return (
                      <SidebarMenuItem key={entry.slug} className="group/item relative">
                        <SidebarMenuButton asChild isActive={pathname === href}>
                          <Link href={href}>
                            {entry.route && <LayoutDashboardIcon />}
                            <span>{entry.title}</span>
                          </Link>
                        </SidebarMenuButton>
                        {entry.source !== "shadcn" && (
                          <SidebarMenuBadge className="font-mono text-[10px] font-normal">
                            {entry.source.replace("@", "")}
                          </SidebarMenuBadge>
                        )}
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )
        })}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
