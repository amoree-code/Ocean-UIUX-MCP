import { Input } from "@/styles/maia/ui/input"
import { Label } from "@/styles/maia/ui/label"

export default function LabelPreview() {
  return (
    <div className="flex w-full max-w-xs flex-col items-start justify-center gap-1.5">
      <Label htmlFor="preview-label-email">Work email</Label>
      <Input id="preview-label-email" type="email" placeholder="you@company.com" />
    </div>
  )
}
