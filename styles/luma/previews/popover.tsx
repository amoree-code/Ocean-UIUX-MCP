import { Button } from "@/styles/luma/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/styles/luma/ui/field"
import { Input } from "@/styles/luma/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/styles/luma/ui/popover"

export default function PopoverPreview() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Set Goal</Button>
      </PopoverTrigger>
      <PopoverContent className="w-64" align="start">
        <PopoverHeader>
          <PopoverTitle>Revenue Goal</PopoverTitle>
          <PopoverDescription>
            Set the target for this quarter.
          </PopoverDescription>
        </PopoverHeader>
        <FieldGroup className="gap-4">
          <Field orientation="horizontal">
            <FieldLabel htmlFor="goal-amount" className="w-1/2">
              Amount
            </FieldLabel>
            <Input id="goal-amount" defaultValue="$50,000" />
          </Field>
        </FieldGroup>
      </PopoverContent>
    </Popover>
  )
}
