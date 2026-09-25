import { GallerySidebar } from "@/components/gallery/sidebar-nav"
import { GalleryControls } from "@/components/gallery/gallery-controls"
import { HeaderInstall } from "@/components/gallery/header-install"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

export default function BrowseLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <GallerySidebar />
      <SidebarInset>
        <header className="sticky top-0 z-40 flex flex-wrap items-center gap-2 border-b bg-background/85 px-4 py-3 backdrop-blur">
          <SidebarTrigger />
          <div className="ms-auto flex flex-wrap items-center gap-2">
            <GalleryControls />
            <HeaderInstall />
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
