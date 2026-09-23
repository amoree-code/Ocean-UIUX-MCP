import { Slider } from "@/styles/rhea/ui/slider"

export default function SliderPreview() {
  return (
    <div className="flex w-full max-w-xs flex-col items-center justify-center gap-2">
      <div className="flex w-full justify-between text-xs text-muted-foreground">
        <span>Alert threshold</span>
        <span>72%</span>
      </div>
      <Slider defaultValue={[72]} max={100} step={1} />
    </div>
  )
}
