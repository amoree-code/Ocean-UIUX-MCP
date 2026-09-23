import { Bubble, BubbleContent, BubbleGroup } from "@/styles/nova/ui/bubble"

export default function BubblePreview() {
  return (
    <BubbleGroup className="w-full max-w-xs">
      <Bubble variant="secondary">
        <BubbleContent>How is traffic looking today?</BubbleContent>
      </Bubble>
      <Bubble align="end">
        <BubbleContent>Up 8% versus yesterday, no alerts.</BubbleContent>
      </Bubble>
    </BubbleGroup>
  )
}
