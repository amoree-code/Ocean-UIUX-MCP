"use client"

import { useState } from "react"

import { Button } from "@/styles/rhea/ui/button"
import { Timer } from "@/components/ui/timer"

export default function TimerPreview() {
  const [running, setRunning] = useState(false)

  return (
    <div className="flex flex-col items-center gap-3">
      <Timer loading={running} format="MM:SS" />
      <Button size="sm" variant="outline" onClick={() => setRunning((r) => !r)}>
        {running ? "Stop" : "Start"}
      </Button>
    </div>
  )
}
