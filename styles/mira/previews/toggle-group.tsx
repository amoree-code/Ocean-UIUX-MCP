import { ToggleGroup, ToggleGroupItem } from "@/styles/mira/ui/toggle-group"

export default function ToggleGroupPreview() {
  return (
    <div className="flex w-full max-w-xs items-center justify-center">
      <ToggleGroup type="single" defaultValue="week" variant="outline">
        <ToggleGroupItem value="day">Day</ToggleGroupItem>
        <ToggleGroupItem value="week">Week</ToggleGroupItem>
        <ToggleGroupItem value="month">Month</ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}
