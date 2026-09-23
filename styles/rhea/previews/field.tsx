import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/styles/rhea/ui/field"
import { Input } from "@/styles/rhea/ui/input"

export default function FieldPreview() {
  return (
    <div className="w-full max-w-xs">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="preview-project">Project name</FieldLabel>
          <Input id="preview-project" placeholder="Q3 dashboard revamp" />
          <FieldDescription>Visible to your whole workspace.</FieldDescription>
        </Field>
      </FieldGroup>
    </div>
  )
}
