'use client'

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@repo/ui/components/ui/tabs'
import {
  PiBarchartDefaultSolid,
  PiChevronBigRightStroke,
  PiNftDefaultStroke,
  PiTagSolid,
  PiTerminalConsoleSquareStroke,
} from '@repo/ui/icons/pika'
import type { SimulatedTokenStateResult } from '@/types/database.types'
import { isEqual } from 'lodash'
import { useState } from 'react'
import LogsList from './log-list'
import { GenericDisplay } from '@/components/datatypes/generic-display'
import LoadingSpinner from '@repo/ui/components/loading/loading-spinner'
import { Separator } from '@repo/ui/components/ui/separator'

export default function TokenResult({
  result,
  loading,
}: {
  result?: SimulatedTokenStateResult
  loading?: boolean
}) {
  const [page, setPage] = useState('changes')
  if (loading) return <LoadingSpinner containerClassName="!h-full" />
  if (!result) return null
  const changedMetadata = Object.entries(result.metadataChange)
  const changedValues = Object.entries(result.stateChange).filter(
    ([key, v]) => !isEqual(v.new, v.old),
  )
  return (
    <Tabs value={page} onValueChange={setPage} className="h-full">
      <div className="h-full space-y-4 rounded-lg p-2 md:p-4">
        <div className="flex items-end justify-between">
          {/* biome-ignore lint/nursery/useSortedClasses: <explanation> */}
          <h3 className="h-fit pl-1 text-xl font-extrabold">
            {page === 'changes' ? 'Changes' : 'Logs'}
          </h3>
          <TabsList className="z-50 h-8 bg-muted px-0.5">
            <TabsTrigger value="changes">
              <PiNftDefaultStroke className="size-4" />
            </TabsTrigger>
            <TabsTrigger value="log">
              <PiTerminalConsoleSquareStroke className="size-4" />
            </TabsTrigger>
          </TabsList>
        </div>
        <div className="h-full">
          <TabsContent value="changes" className="space-y-3 pb-8">
            {changedMetadata.length > 0 && (
              <ul className="relative flex flex-col gap-2 pl-2 text-sm">
                <PiTagSolid className="absolute top-1 right-2 size-3.5" />
                {changedMetadata.map(([key, value]) => (
                  <li key={key} className="space-y-0.5">
                    <h3 className=" w-full font-semibold capitalize underline">
                      {value.label || key}
                    </h3>
                    <div className="flex items-center justify-start gap-2">
                      <GenericDisplay value={value.old} />
                      <PiChevronBigRightStroke className="size-3" />
                      <GenericDisplay value={value.new} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {changedMetadata.length > 0 && changedValues.length > 0 && (
              <Separator />
            )}
            {changedValues.length > 0 && (
              <ul className="relative flex flex-col gap-2 pt-1 text-sm">
                <PiBarchartDefaultSolid className="absolute top-0 right-2 size-3.5" />
                {changedValues.map(([key, value]) => (
                  <li key={key} className="space-y-0.5 pl-2">
                    <h3 className=" w-full font-semibold capitalize underline">
                      {value.label || key}
                    </h3>
                    <div className="flex items-center justify-start gap-2">
                      <GenericDisplay value={value.old} />
                      <PiChevronBigRightStroke className="size-3" />
                      <GenericDisplay value={value.new} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {changedValues.length === 0 && changedMetadata.length === 0 && (
              <p className="text-center text-sm text-muted-foreground">
                No changes
              </p>
            )}
          </TabsContent>
          <TabsContent value="log">
            <LogsList logs={result.logs || []} />
          </TabsContent>
        </div>
      </div>
    </Tabs>
  )
}
