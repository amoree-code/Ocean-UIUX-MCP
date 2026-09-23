import { Field, FieldLabel } from "@/styles/vega/ui/field"
import { Progress } from "@/styles/vega/ui/progress"

export default function ProgressPreview() {
  return (
    <Field>
      <FieldLabel htmlFor="progress-preview">
        <span>Storage used</span>
        <span className="ms-auto">72%</span>
      </FieldLabel>
      <Progress value={72} className="w-full" id="progress-preview" />
    </Field>
  )
}
