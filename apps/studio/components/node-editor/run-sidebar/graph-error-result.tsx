import { Button } from '@repo/ui/components/button'
import { useEditorContext } from '@/components/node-editor/editor/editor-provider'
import { PiCrossCross } from '@repo/ui/icons/pika'
import { Focus } from 'lucide-react'

export default function GraphErrorResult() {
  const { error, setError, editor } = useEditorContext()
  if (!error) return null
  return (
    <div className=" flex w-full flex-col justify-center gap-4 p-2 max-md:pr-12 md:p-4">
      <div className="flex w-full justify-between">
        <h2 className="font-bold text-destructive text-lg">
          {error.type === 'graph' ? 'Error' : 'Critical Error'}
        </h2>
        <Button
          variant={'ghost'}
          size={'iconXs'}
          onClick={() => {
            error && error.type === 'graph' && setError(null)
          }}
          className="z-40 p-1 text-destructive"
        >
          <PiCrossCross className="size-4" />
        </Button>
      </div>
      <p className="text-destructive text-sm">{error.message}</p>
    </div>
  )
}
