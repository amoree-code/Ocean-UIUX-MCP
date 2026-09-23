import { Button } from "@/styles/nova/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/styles/nova/ui/field"
import { Input } from "@/styles/nova/ui/input"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/styles/nova/ui/sheet"

export default function SheetPreview() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Edit Column</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit column</SheetTitle>
          <SheetDescription>
            Update this table column&apos;s label and visibility.
          </SheetDescription>
        </SheetHeader>
        <div className="px-4">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="sheet-preview-label">Label</FieldLabel>
              <Input id="sheet-preview-label" defaultValue="Total Revenue" />
            </Field>
          </FieldGroup>
        </div>
        <SheetFooter>
          <Button type="submit">Save changes</Button>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
