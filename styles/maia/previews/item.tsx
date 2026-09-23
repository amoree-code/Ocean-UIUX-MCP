import { ActivityIcon } from "lucide-react"

import { Badge } from "@/styles/maia/ui/badge"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/styles/maia/ui/item"

export default function ItemPreview() {
  return (
    <ItemGroup className="w-full max-w-xs">
      <Item variant="outline">
        <ItemMedia variant="icon">
          <ActivityIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Server uptime</ItemTitle>
          <ItemDescription>99.98% over 30 days</ItemDescription>
        </ItemContent>
        <Badge variant="secondary">Healthy</Badge>
      </Item>
    </ItemGroup>
  )
}
