"use client"

import { Calendar } from "@/styles/lyra/ui/calendar"

export default function CalendarPreview() {
  return (
    <div className="flex w-full max-w-xs items-center justify-center [--cell-size:1.75rem]">
      <Calendar mode="single" className="p-0" />
    </div>
  )
}
