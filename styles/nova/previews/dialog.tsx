import { Button } from "@/styles/nova/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/styles/nova/ui/dialog"
import { Field, FieldGroup, FieldLabel } from "@/styles/nova/ui/field"
import { Input } from "@/styles/nova/ui/input"

export default function DialogPreview() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Widget</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit widget</DialogTitle>
          <DialogDescription>
            Update this dashboard widget&apos;s name and data source.
          </DialogDescription>
        </DialogHeader>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="widget-name">Name</FieldLabel>
            <Input id="widget-name" defaultValue="Active Users" />
          </Field>
        </FieldGroup>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
