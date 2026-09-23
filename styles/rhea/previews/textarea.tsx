import { Textarea } from "@/styles/rhea/ui/textarea"

export default function TextareaPreview() {
  return (
    <div className="flex w-full max-w-xs items-center justify-center">
      <Textarea placeholder="Leave a note for the on-call team..." />
    </div>
  )
}
