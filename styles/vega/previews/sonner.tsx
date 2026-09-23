"use client"

import { toast } from "sonner"

import { Button } from "@/styles/vega/ui/button"

export default function SonnerPreview() {
  return (
    <Button
      onClick={() =>
        toast("Report exported", {
          description: "Your dashboard report is ready to download.",
        })
      }
      variant="outline"
      className="w-fit"
    >
      Export Report
    </Button>
  )
}
