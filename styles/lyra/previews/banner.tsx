import { Megaphone } from "lucide-react"

import { Banner, BannerAction, BannerClose, BannerIcon, BannerTitle } from "@/components/kibo-ui/banner"

export default function BannerPreview() {
  return (
    <Banner inset className="rounded-md">
      <BannerIcon icon={Megaphone} />
      <BannerTitle>New analytics dashboard is live.</BannerTitle>
      <BannerAction>View</BannerAction>
      <BannerClose />
    </Banner>
  )
}
