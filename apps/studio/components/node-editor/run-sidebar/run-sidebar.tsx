import { SidebarContent } from '@repo/ui/components/ui/sidebar'
import {
  SecondarySidebar,
  SecondarySidebarRail,
  useSecondarySidebar,
} from '@repo/ui/components/ui/sidebar-secondary'
import { useEditorContext } from '@/components/node-editor/editor/editor-provider'
import { cn } from '@repo/ui/lib/utils'
import { Button } from '@repo/ui/components/ui/button'
import { PiPlayBigStroke } from '@repo/ui/icons/pika'
import SimulationForm from '@/components/node-editor/run-sidebar/simulation-form/simulation-form'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@repo/ui/components/ui/resizable'
import { useEffect } from 'react'
import { useMediaQuery } from '@/lib/hooks/media-query'
import GraphErrorResult from './graph-error-result'

export default function RunSidebar({
  resultClassName,
}: { resultClassName?: string }) {
  const { result, error } = useEditorContext()
  const { open, setOpen } = useSecondarySidebar()
  const isMediumScreen = useMediaQuery('(min-width: 768px)')
  console.log(error)

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setOpen(
      isMediumScreen /*  &&
        localStorage.getItem('node-editor-run-open') !== 'false', */,
    )
  }, [isMediumScreen])

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!isMediumScreen) {
      setOpen(false)
    }
  }, [isMediumScreen])

  /*   useEffect(() => {
    localStorage.setItem('node-editor-run-open', open ? 'true' : 'false')
  }, [open]) */

  return (
    <SecondarySidebar side="right">
      <SecondarySidebarRail />
      <SidebarContent className="gap-0">
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel minSize={10} defaultSize={50}>
            <div
              className={cn(
                'scrollbar-none w-full overflow-y-scroll p-3 pb-8',
                resultClassName,
              )}
            >
              <GraphErrorResult />
              {result}
            </div>
          </ResizablePanel>
          <ResizableHandle className="!h-[0.5px] bg-sidebar-border" />
          <div className="-translate-y-4 z-50 flex h-0 justify-center overflow-visible">
            <Button
              type="submit"
              className="flex h-8 w-fit gap-2 rounded-full shadow-lg"
              form="editor-form"
            >
              <PiPlayBigStroke className="size-4" /> Simulate
            </Button>
          </div>
          <ResizablePanel minSize={10} defaultSize={50}>
            <SimulationForm id="editor-form" />
          </ResizablePanel>
        </ResizablePanelGroup>
      </SidebarContent>
    </SecondarySidebar>
  )
}
