import { PiCloudExclamationDuoSolid } from '@repo/ui/icons/pika'

export function Maintanance() {
  return (
    <div className="m-auto flex h-screen w-full flex-col items-center justify-center gap-6">
      <div className="space-y-3 pl-3">
        <div className="flex flex-row gap-2">
          <PiCloudExclamationDuoSolid className="my-auto size-9" />
          <h1 className="font-bold text-4xl">Maintenance</h1>
        </div>
        <div className="mx-auto flex flex-row gap-2">
          <h2 className=" text-lg">
            We are currently performing some updates on the platform. <br />
            Please check back later.
          </h2>
        </div>
      </div>
    </div>
  )
}
