import { BellIcon, HomeIcon, MailIcon, SettingsIcon } from "lucide-react"

import { Dock, DockCard, DockCardInner, DockDivider } from "@/components/ui/dock"

// A blank 1x1 pixel: DockCardInner always renders an <img>, so this avoids an empty src
// while keeping the "icon over a soft background" effect purely as flat color.
const BLANK = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E"

export default function DockPreview() {
  return (
    <div className="relative h-24 w-full">
      <Dock className="static translate-x-0">
        <DockCard id="1">
          <DockCardInner id="1" src={BLANK}>
            <HomeIcon className="size-5" />
          </DockCardInner>
        </DockCard>
        <DockCard id="2">
          <DockCardInner id="2" src={BLANK}>
            <MailIcon className="size-5" />
          </DockCardInner>
        </DockCard>
        <DockDivider />
        <DockCard id="3">
          <DockCardInner id="3" src={BLANK}>
            <BellIcon className="size-5" />
          </DockCardInner>
        </DockCard>
        <DockCard id="4">
          <DockCardInner id="4" src={BLANK}>
            <SettingsIcon className="size-5" />
          </DockCardInner>
        </DockCard>
      </Dock>
    </div>
  )
}
