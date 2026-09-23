"use client"

import { toast } from "sonner"

import { Button } from "@/styles/lyra/ui/button"

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
