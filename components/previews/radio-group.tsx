import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function RadioGroupPreview() {
  return (
    <RadioGroup defaultValue="daily" className="w-full max-w-xs">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="daily" id="preview-radio-daily" />
        <Label htmlFor="preview-radio-daily">Daily digest</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="weekly" id="preview-radio-weekly" />
        <Label htmlFor="preview-radio-weekly">Weekly digest</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="off" id="preview-radio-off" />
        <Label htmlFor="preview-radio-off">Off</Label>
      </div>
    </RadioGroup>
  )
}
