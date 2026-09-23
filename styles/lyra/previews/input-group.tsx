import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/styles/lyra/ui/input-group"
import { SearchIcon } from "lucide-react"

export default function InputGroupPreview() {
  return (
    <div className="flex w-full max-w-xs items-center justify-center">
      <InputGroup>
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        <InputGroupInput placeholder="Search customers..." />
      </InputGroup>
    </div>
  )
}
