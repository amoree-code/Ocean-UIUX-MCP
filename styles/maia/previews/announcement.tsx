import { ArrowRight } from "lucide-react"

import { Announcement, AnnouncementTag, AnnouncementTitle } from "@/components/kibo-ui/announcement"

export default function AnnouncementPreview() {
  return (
    <Announcement>
      <AnnouncementTag>New</AnnouncementTag>
      <AnnouncementTitle>
        Realtime sync shipped
        <ArrowRight className="size-3" />
      </AnnouncementTitle>
    </Announcement>
  )
}
