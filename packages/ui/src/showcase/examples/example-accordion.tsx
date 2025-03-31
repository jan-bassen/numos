import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@repo/ui/components/accordion'

export function ExampleAccordion() {
  return (
    <Accordion type="single" collapsible className="w-full max-w-[300px]">
      <AccordionItem value="item-1">
        <AccordionTrigger>Section 1</AccordionTrigger>
        <AccordionContent>Content for section 1 goes here.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Section 2</AccordionTrigger>
        <AccordionContent>Content for section 2 goes here.</AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
