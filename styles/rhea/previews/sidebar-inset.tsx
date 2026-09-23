"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/styles/rhea/ui/sidebar"
import { BarChartIcon, HomeIcon, UsersIcon } from "lucide-react"

export default function SidebarInsetPreview() {
  return (
    <div className="h-44 w-full overflow-hidden rounded-lg border bg-sidebar">
      <SidebarProvider
        className="h-full min-h-0"
        style={{ "--sidebar-width": "8rem" } as React.CSSProperties}
      >
        <Sidebar collapsible="none" className="h-full bg-sidebar">
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
        <SidebarInset className="m-1.5 ms-0 flex-1 rounded-lg border p-3 text-xs text-muted-foreground shadow-sm">
          Content area
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
