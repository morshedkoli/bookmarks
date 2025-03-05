import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Block({ data }) {
  return (
    <Accordion type="single" collapsible className="w-full">
      {data?.map((website) => (
        <AccordionItem key={website.id} value={website.id} className="group rounded-xl border border-gray-200/50 hover:border-blue-200/50 dark:border-gray-700 dark:hover:border-blue-800/50 transition-all duration-200">
          <AccordionTrigger className="px-6 py-3 text-sm font-medium [&[data-state=open]]:text-blue-700 dark:[&[data-state=open]]:text-blue-300 hover:no-underline group-hover:bg-blue-50/30 dark:group-hover:bg-blue-900/20">
            <span className="truncate">{website.name.slice(0,20)}</span>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-3 pt-1 text-sm text-gray-600/90 dark:text-gray-300">
            {website.useFor}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
