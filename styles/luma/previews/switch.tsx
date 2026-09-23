import { Label } from "@/styles/luma/ui/label"
import { Switch } from "@/styles/luma/ui/switch"

export default function SwitchPreview() {
  return (
    <div className="flex w-full max-w-xs flex-col items-start justify-center gap-3">
      <div className="flex items-center gap-2">
        <Switch id="preview-switch-alerts" defaultChecked />
        <Label htmlFor="preview-switch-alerts">Real-time alerts</Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch id="preview-switch-maintenance" />
        <Label htmlFor="preview-switch-maintenance">Maintenance mode</Label>
      </div>
    </div>
  )
}
