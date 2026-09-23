import { Button } from "@/styles/luma/ui/button"
import { Spinner } from "@/styles/luma/ui/spinner"

export default function SpinnerPreview() {
  return (
    <div className="flex items-center gap-4">
      <Spinner className="size-6" />
      <Button disabled>
        <Spinner data-icon="inline-start" /> Loading data
      </Button>
    </div>
  )
}
