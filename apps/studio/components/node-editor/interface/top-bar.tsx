import type { InputMode, Shape } from '@/types/editor.types'
import { Button } from '@repo/ui/components/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@repo/ui/components/dropdown-menu'
import { Separator } from '@repo/ui/components/separator'
import { useSecondarySidebar } from '@repo/ui/components/sidebar-secondary'
import {
  PiPlusSquareStroke,
  PiPointerCursorDefaultStroke,
  PiSettings02Stroke,
  PiSwipeDefaultStroke,
} from '@repo/ui/icons/pika'
import { cn } from '@repo/ui/lib/utils'
import { Copy, LassoSelect, Mouse, MousePointer, Touchpad } from 'lucide-react'
import { toast } from 'sonner'
import { useEditorContext } from '../editor/editor-provider'
import { AddNodeMenu } from '../menus/add-node-menu'
import { NodeGroupsBar } from '../menus/node-groups-bar'

export default function TopBar() {
  const { editor, settings, setSettings } = useEditorContext()
  const { open: sidebarOpen, setOpen: setSidebarOpen } = useSecondarySidebar()

  async function copyGraphJson() {
    const graph = editor?.editor.getGraph()
    if (!graph) {
      toast.error('No graph available to copy')
      return
    }
    const nodeIds = new Set(graph.nodes.map((node) => node.id))
    const danglingConnections = graph.connections.filter(
      (connection) =>
        !nodeIds.has(connection.source) || !nodeIds.has(connection.target),
    )
    const invalidSocketConnections = graph.connections.filter((connection) => {
      const source = editor?.editor.getNode(connection.source)
      const target = editor?.editor.getNode(connection.target)
      if (!source || !target) return false
      return (
        !source.getOutput(connection.sourceOutput) ||
        !target.getInput(connection.targetInput)
      )
    })

    if (danglingConnections.length > 0) {
      console.warn('Graph JSON has dangling connections', danglingConnections)
      toast.error(
        `Graph has ${danglingConnections.length} stale connection${danglingConnections.length === 1 ? '' : 's'}`,
      )
      return
    }
    if (invalidSocketConnections.length > 0) {
      console.warn(
        'Graph JSON has invalid socket connections',
        invalidSocketConnections,
      )
      toast.error(
        `Graph has ${invalidSocketConnections.length} invalid connection${invalidSocketConnections.length === 1 ? '' : 's'}`,
      )
      return
    }

    try {
      await navigator.clipboard.writeText(JSON.stringify(graph, null, 2))
      toast.success(
        `Graph JSON copied (${graph.nodes.length} nodes, ${graph.connections.length} edges)`,
      )
    } catch {
      toast.error('Could not copy graph JSON')
    }
  }

  return (
    <div className="size-full items-center gap-1.5 rounded-lg border border-border bg-background pr-1.5 pl-1 shadow-xs md:flex">
      <div className="flex w-fit items-center gap-0.5">
        <Button
          variant={'ghost'}
          size={'none'}
          className={cn(
            'size-8 rounded-md focus-visible:ring-0',
            settings.mode === 'select' && 'bg-muted',
          )}
          onClick={() => {
            setSettings({ ...settings, mode: 'select' })
          }}
        >
          <PiPointerCursorDefaultStroke className="size-4.5" />
        </Button>
        <Button
          variant={'ghost'}
          size={'none'}
          className={cn(
            'size-8 rounded-md focus-visible:ring-0',
            settings.mode === 'drag' && 'bg-muted',
          )}
          onClick={() => {
            setSettings({ ...settings, mode: 'drag' })
          }}
        >
          <PiSwipeDefaultStroke className="size-4.5" />
        </Button>
      </div>
      <Separator orientation="vertical" className="h-6 w-[1.5px]" />
      <NodeGroupsBar
        className={cn(sidebarOpen ? 'max-xl:hidden' : 'max-lg:hidden')}
        items={editor?.editor.nodelist || []}
        onHide={() => {}}
        position="center"
      />
      <AddNodeMenu
        mode="dropdown"
        items={editor?.editor.nodelist || []}
        delay={0}
        searchBar={false}
        onHide={() => {}}
        className={cn(sidebarOpen ? 'xl:hidden' : 'lg:hidden')}
        position="center"
        asChild
      >
        <Button
          variant={'ghost'}
          size={'none'}
          className="size-8 rounded-md focus-visible:ring-0"
        >
          <PiPlusSquareStroke className="size-5" />
        </Button>
      </AddNodeMenu>
      <Separator orientation="vertical" className="h-6 w-[1.5px]" />
      <div className="w-fit items-center gap-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={'ghost'}
              size={'none'}
              className="size-8 rounded-md focus-visible:ring-0"
            >
              <PiSettings02Stroke className="size-4.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent sideOffset={8} className="min-w-40 space-y-1">
            <DropdownMenuRadioGroup
              className="space-y-0.5"
              value={settings.shape}
              onValueChange={(v) => {
                setSettings({ ...settings, shape: v as Shape })
              }}
            >
              <DropdownMenuRadioItem value="marquee" className={cn('gap-2')}>
                <MousePointer className="size-4" />
                Rectangle
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="lasso" className={cn('gap-2')}>
                <LassoSelect className="size-4" />
                Lasso
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              className="space-y-0.5"
              value={settings.input}
              onValueChange={(v) => {
                setSettings({ ...settings, input: v as InputMode })
              }}
            >
              <DropdownMenuRadioItem value="mouse" className={cn('gap-2')}>
                <Mouse className="size-4" />
                Mouse
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="touchpad" className={cn('gap-2')}>
                <Touchpad className="size-4" />
                Touchpad
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2" onClick={copyGraphJson}>
              <Copy className="size-4" />
              Copy Graph JSON
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
