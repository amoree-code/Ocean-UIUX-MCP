import { Checkbox } from "@/styles/sera/ui/checkbox"
import { Label } from "@/styles/sera/ui/label"

export default function CheckboxPreview() {
  return (
    <div className="flex w-full max-w-xs flex-col items-start justify-center gap-3">
      <div className="flex items-center gap-2">
        <Checkbox id="preview-notify" defaultChecked />
        <Label htmlFor="preview-notify">Email me weekly reports</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="preview-sync" />
        <Label htmlFor="preview-sync">Sync with calendar</Label>
      </div>
    </div>
  )
}
