import { SidebarContent } from '@repo/ui/components/ui/sidebar'
import {
  SecondarySidebar,
  SecondarySidebarRail,
  useSecondarySidebar,
} from '@repo/ui/components/ui/sidebar-secondary'
import { useEditorContext } from './editor-provider'
import { cn } from '@repo/ui/lib/utils'
import { Button } from '@repo/ui/components/ui/button'
import { PiCrossCross, PiPlayBigStroke } from '@repo/ui/icons/pika'
import SimulationForm from './simulation-form'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@repo/ui/components/ui/resizable'
import { useEffect } from 'react'
import { useMediaQuery } from '@/lib/hooks/media-query'

export default function RunSidebar({
  resultClassName,
}: { resultClassName?: string }) {
  const { editor, result, error, setError } = useEditorContext()
  const { open, setOpen } = useSecondarySidebar()
  const isMediumScreen = useMediaQuery('(min-width: 768px)')

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setOpen(
      isMediumScreen &&
        localStorage.getItem('node-editor-run-open') !== 'false',
    )
  }, [isMediumScreen])

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!isMediumScreen) {
      setOpen(false)
    }
  }, [isMediumScreen])

  useEffect(() => {
    localStorage.setItem('node-editor-run-open', open ? 'true' : 'false')
  }, [open])

  return (
    <SecondarySidebar side="right">
      <SecondarySidebarRail />
      <SidebarContent className="gap-0">
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel minSize={10} defaultSize={50}>
            <div
              className={cn(
                'scrollbar-none w-full overflow-y-scroll border-b p-3 pb-8',
                resultClassName,
              )}
            >
              {error ? (
                <div className=" flex w-full flex-col justify-center gap-4 p-2 -md:pr-12 md:p-4">
                  <div className="flex w-full justify-between">
                    <h2 className="font-bold text-destructive text-lg">
                      {error.type === 'graph' ? 'Error' : 'Critical Error'}
                    </h2>
                    <Button
                      variant={'ghost'}
                      size={'iconSmall'}
                      onClick={() => {
                        error &&
                          error.type === 'graph' &&
                          editor?.editor.clearError(error.location.node)
                        setError(null)
                      }}
                      className="z-40 p-1 text-destructive"
                    >
                      <PiCrossCross className="size-4" />
                    </Button>
                  </div>
                  <p className="text-destructive text-sm">{error.message}</p>
                </div>
              ) : (
                result
              )}
            </div>
          </ResizablePanel>
          <ResizableHandle className=" h-[0.5px] bg-sidebar-border" />
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
