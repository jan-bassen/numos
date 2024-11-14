import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@repo/ui/components/ui/accordion'
import type { LegacyResolvedFolder } from '@/types/database.types'

export default function FolderView({
  folder,
}: { folder: LegacyResolvedFolder }) {
  return (
    <div>
      <Accordion type="multiple" className="w-full">
        {folder.subfolders.map((subfolder) => (
          <AccordionItem key={subfolder.id} value={subfolder.id}>
            <AccordionTrigger>{subfolder.name}</AccordionTrigger>
            <AccordionContent>
              <FolderView folder={subfolder} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      {folder.layers.map((layer) => (
        <div key={layer.id}>{layer.name}</div>
      ))}
    </div>
  )
}
