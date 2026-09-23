"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/styles/lyra/ui/chart"

const data = [
  { day: "Mon", visits: 186 },
  { day: "Tue", visits: 305 },
  { day: "Wed", visits: 237 },
  { day: "Thu", visits: 273 },
  { day: "Fri", visits: 209 },
]

const config = {
  visits: {
    label: "Visits",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export default function ChartPreview() {
  return (
    <ChartContainer config={config} className="h-[140px] w-full">
      <BarChart data={data}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="day"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <ChartTooltip content={<ChartTooltipContent indicator="dashed" />} />
        <Bar dataKey="visits" fill="var(--color-visits)" radius={4} />
      </BarChart>
    </ChartContainer>
  )
}
