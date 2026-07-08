'use client'

import SpeechbubbleTick from '@/public/graphics/speechbubble-tick'
import type { Props } from '@/types/nodes.types'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@repo/ui/components/context-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/ui/components/dialog'
import { Textarea } from '@repo/ui/components/textarea'
import {
  PiAnnotationDefaultStroke,
  PiCopyDefaultStroke,
  PiDeleteDustbin02Stroke,
  PiInformationCircleStroke,
  PiThreeByTwoDotsVertical,
} from '@repo/ui/icons/pika'
import { cn } from '@repo/ui/lib/utils'
import { useEffect, useRef, useState } from 'react'
import { Drag } from 'rete-react-plugin'
import Control from './control'
import Input from './input'
import Output from './output'

function sortByIndex<T extends [string, undefined | { index?: number }][]>(
  entries: T,
) {
  return entries.sort((a, b) => {
    const ai = a[1]?.index || 0
    const bi = b[1]?.index || 0
    return ai - bi
  })
}

export function NodeComponent(props: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const commentRef = useRef<HTMLTextAreaElement | null>(null)
  const [showComment, setShowComment] = useState(!!props.data.comment)

  useEffect(() => {
    const nodeRef = ref.current
    const handleMouseDown = (e: MouseEvent) => {
      if (!nodeRef) return
      nodeRef.style.cursor = 'grabbing'
    }
    const handleMouseUp = (e: MouseEvent) => {
      if (!nodeRef) return
      nodeRef.style.cursor = 'grab'
    }
    if (nodeRef) {
      nodeRef.addEventListener('mousedown', handleMouseDown)
      nodeRef.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      if (nodeRef) {
        nodeRef.removeEventListener('mousedown', handleMouseDown)
        nodeRef.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [])

  Drag.useNoDrag(commentRef)

  const node = props.data
  const inputs = Object.entries(node.getInputs())
  const outputs = Object.entries(node.getOutputs())
  const controls = Object.entries(node.getControls())
  const { id, label, definition, displayData, error, context, comment } =
    props.data
  const root = definition.root
  const selected = context.editor.selector.isSelected('node', id)

  return (
    <Dialog>
      <ContextMenu>
        <ContextMenuTrigger
          asChild
          disabled={root}
          onContextMenu={(e) => {
            root && e.preventDefault()
          }}
        >
          {/* TODO: Check Border Radius */}
          <div
            className={cn(
              'relative box-border flex cursor-grab select-none rounded-lg shadow-md',
              root
                ? 'border-2 border-secondary-100 bg-secondary-50 hover:border-secondary-100 hover:bg-secondary-100 '
                : 'border border-border bg-card hover:border-primary-100 hover:bg-primary-50',
              selected && 'border-primary-300',
              definition.componentType === 'input'
                ? 'flex-row items-center justify-between gap-1'
                : 'min-w-48 flex-col gap-2 pb-4',
              error && 'border-destructive',
            )}
            data-testid="node"
            key={id}
            ref={ref}
          >
            <div
              className={cn(
                '-translate-x-1/2 -translate-y-[calc(100%+0.2rem)] absolute top-0 left-1/2 z-20 w-6',
                !showComment && 'hidden',
              )}
            >
              <SpeechbubbleTick
                className="fill-background stroke-[11px] stroke-border"
                rectClassName="stroke-none"
              />
            </div>
            <Textarea
              autoFocus
              rows={2}
              className={cn(
                '-translate-y-[calc(100%+0.825rem)] absolute top-0 left-0 min-h-12 w-full resize-none rounded-xl text-muted-foreground text-xs',
                !showComment && 'hidden',
              )}
              placeholder="Comment"
              value={comment}
              onChange={(e) => {
                node.setComment(e.target.value)
              }}
              onBlur={(e) => {
                if (e.target.value === '') {
                  setShowComment(false)
                }
              }}
              ref={commentRef}
            />

            {definition.componentType !== 'input' ? (
              <div
                className={cn(
                  'flex justify-between px-3 pt-2 pb-1 font-semibold',
                  error ? 'text-destructive' : 'text-foreground',
                )}
                data-testid="title"
              >
                {label}
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center pl-1">
                <PiThreeByTwoDotsVertical className="h-5 w-5 stroke-border" />
              </div>
            )}
            {controls.length > 0 && (
              <div
                className={cn(
                  'h-fit',
                  definition.componentType === 'input' ? 'py-1' : 'px-3 pb-3',
                )}
              >
                {controls.map(([key, control]) => (
                  <Control
                    key={key}
                    controlKey={key}
                    control={control}
                    emit={props.emit}
                    error={
                      error?.location.component?.type === 'control' &&
                      error?.location.component?.key === control.definition.key
                    }
                  />
                ))}
              </div>
            )}
            {inputs.length > 0 && (
              <div className="flex flex-col gap-1.5">
                {inputs.map(([key, input]) => (
                  <Input
                    key={key}
                    socketKey={key}
                    input={input}
                    error={
                      error?.location.component?.type === 'input' &&
                      error?.location.component?.key === input.definition.key
                    }
                    nodeId={id}
                    emit={props.emit}
                  />
                ))}
              </div>
            )}
            {outputs.length > 0 && (
              <div
                className={cn(
                  'flex flex-col gap-1.5',
                  definition.componentType !== 'input' && 'pt-1.5',
                )}
              >
                {outputs.map(([key, output]) => {
                  return (
                    <Output
                      key={key}
                      socketKey={key}
                      output={output}
                      nodeId={id}
                      nodeDefinition={definition}
                      error={
                        error?.location.component?.type === 'output' &&
                        error?.location.component?.key === output.definition.key
                      }
                      emit={props.emit}
                    />
                  )
                })}
              </div>
            )}
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="p-0">
          <ContextMenuItem
            onClick={() => {
              node.remove()
            }}
            className="flex w-full flex-row items-center gap-2 rounded-none"
          >
            <PiDeleteDustbin02Stroke className="h-4 w-4" />
            Delete
          </ContextMenuItem>
          <ContextMenuItem
            onClick={() => {
              node.duplicate()
            }}
            className="flex w-full flex-row items-center gap-2 rounded-none"
          >
            <PiCopyDefaultStroke className="h-4 w-4" />
            Duplicate
          </ContextMenuItem>

          <ContextMenuItem
            onClick={() => {
              setShowComment(!showComment)
            }}
            className="flex w-full flex-row items-center gap-2 rounded-none"
          >
            <PiAnnotationDefaultStroke className="h-4 w-4" />
            {showComment
              ? 'Hide Comment'
              : node.comment || node.comment !== ''
                ? 'Show Comment'
                : 'Comment'}
          </ContextMenuItem>
          <DialogTrigger asChild>
            <ContextMenuItem className="flex w-full flex-row items-center gap-2 rounded-none">
              <PiInformationCircleStroke className="h-4 w-4" />
              Info
            </ContextMenuItem>
          </DialogTrigger>
        </ContextMenuContent>
      </ContextMenu>
      <DialogContent className="max-w-96">
        <DialogHeader className="space-y-4">
          <DialogTitle>{label}</DialogTitle>
          <DialogDescription className="text-base">
            {definition.nodeInfo.description}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
