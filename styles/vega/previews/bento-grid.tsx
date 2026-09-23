import { BarChart3, Bell, Settings, Users } from "lucide-react"

import { BentoCard, BentoGrid } from "@/components/ui/bento-grid"

export default function BentoGridPreview() {
  return (
    <div className="h-full w-full overflow-hidden">
      <div className="w-[640px] origin-top-left scale-50">
        <BentoGrid className="grid-cols-2 auto-rows-[9rem] gap-3">
          <BentoCard
            name="Active users"
            className="col-span-1"
            background={<div className="h-full w-full bg-primary/5" />}
            Icon={Users}
            description="1,204 online now"
            href="#"
            cta="View"
          />
          <BentoCard
            name="Revenue"
            className="col-span-1"
            background={<div className="h-full w-full bg-primary/5" />}
            Icon={BarChart3}
            description="$48.2k this month"
            href="#"
            cta="View"
          />
          <BentoCard
            name="Alerts"
            className="col-span-1"
            background={<div className="h-full w-full bg-primary/5" />}
            Icon={Bell}
            description="3 need attention"
            href="#"
            cta="View"
          />
          <BentoCard
            name="Settings"
            className="col-span-1"
            background={<div className="h-full w-full bg-primary/5" />}
            Icon={Settings}
            description="2 pending updates"
            href="#"
            cta="View"
          />
        </BentoGrid>
      </div>
    </div>
  )
}
