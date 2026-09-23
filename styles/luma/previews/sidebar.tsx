"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/styles/luma/ui/sidebar"
import { BarChartIcon, HomeIcon, UsersIcon } from "lucide-react"

export default function SidebarPreview() {
  return (
    <div className="h-44 w-full overflow-hidden rounded-lg border">
      <SidebarProvider
        className="h-full min-h-0"
        style={{ "--sidebar-width": "9rem" } as React.CSSProperties}
      >
        <Sidebar collapsible="none" className="h-full">
          <SidebarHeader>
            <span className="px-2 text-xs font-semibold">Dashboard</span>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Menu</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive>
                      <HomeIcon />
                      <span>Overview</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <BarChartIcon />
                      <span>Reports</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <UsersIcon />
                      <span>Users</span>
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
