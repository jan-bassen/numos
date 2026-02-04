import { Skeleton } from '@repo/ui/components/skeleton'

export function ExampleSkeleton() {
  return (
    <div className="flex flex-col space-y-3 w-full max-w-[250px]">
      <Skeleton className="h-[30px] w-[250px] rounded-lg" />
      <Skeleton className="h-[20px] w-[200px] rounded-lg" />
      <Skeleton className="h-[20px] w-[180px] rounded-lg" />
      <div className="flex space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-4 w-[80px]" />
        </div>
      </div>
    </div>
  )
}
