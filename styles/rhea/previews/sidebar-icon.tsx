"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/styles/rhea/ui/sidebar"
import { BarChartIcon, HomeIcon, SettingsIcon, UsersIcon } from "lucide-react"

export default function SidebarIconPreview() {
  return (
    <div className="h-44 w-full overflow-hidden rounded-lg border">
      <SidebarProvider
        className="h-full min-h-0"
        style={{ "--sidebar-width": "3rem" } as React.CSSProperties}
      >
        <Sidebar collapsible="none" className="h-full items-center">
          <SidebarContent>
            <SidebarGroup className="p-1">
              <SidebarGroupContent>
                <SidebarMenu className="items-center gap-1">
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive className="size-8 justify-center p-0">
                      <HomeIcon />
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton className="size-8 justify-center p-0">
                      <BarChartIcon />
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton className="size-8 justify-center p-0">
                      <UsersIcon />
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton className="size-8 justify-center p-0">
                      <SettingsIcon />
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <div className="flex-1 p-3 text-xs text-muted-foreground">
          Content area
        </div>
      </SidebarProvider>
    </div>
  )
}
