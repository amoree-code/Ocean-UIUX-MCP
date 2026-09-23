import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/styles/rhea/ui/accordion"

export default function AccordionPreview() {
  return (
    <Accordion type="single" collapsible defaultValue="item-1" className="w-full max-w-xs">
      <AccordionItem value="item-1">
        <AccordionTrigger>Revenue this quarter</AccordionTrigger>
        <AccordionContent>
          Up 12% over last quarter, driven by new enterprise accounts.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Active users</AccordionTrigger>
        <AccordionContent>
          1,204 users logged in during the last 7 days.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
