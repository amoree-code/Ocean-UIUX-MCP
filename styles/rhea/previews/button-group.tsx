import { Button } from "@/styles/rhea/ui/button"
import { ButtonGroup, ButtonGroupText } from "@/styles/rhea/ui/button-group"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

export default function ButtonGroupPreview() {
  return (
    <div className="flex w-full max-w-xs items-center justify-center">
      <ButtonGroup>
        <Button variant="outline" size="icon">
          <ChevronLeftIcon />
        </Button>
        <ButtonGroupText>Page 3 of 12</ButtonGroupText>
        <Button variant="outline" size="icon">
          <ChevronRightIcon />
        </Button>
      </ButtonGroup>
    </div>
  )
}
