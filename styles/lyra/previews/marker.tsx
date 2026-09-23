import { CheckIcon, ClockIcon } from "lucide-react"

import { Marker, MarkerContent, MarkerIcon } from "@/styles/lyra/ui/marker"

export default function MarkerPreview() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-4">
      <Marker>
        <MarkerIcon>
          <ClockIcon />
        </MarkerIcon>
        <MarkerContent>Sync started 2m ago</MarkerContent>
      </Marker>
      <Marker variant="separator">
        <MarkerIcon>
          <CheckIcon />
        </MarkerIcon>
        <MarkerContent>Data synced</MarkerContent>
      </Marker>
    </div>
  )
}
