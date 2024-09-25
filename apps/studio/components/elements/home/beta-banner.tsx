import { PiHeartSupportSolid } from '@repo/ui/icons/pika'
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@repo/ui/components/ui/alert'

export default function BetaBanner() {
  return (
    <Alert className="max-w-[43rem]">
      <PiHeartSupportSolid className="h-4 w-4" />
      <AlertTitle className="font-bold">We&apos;re in beta</AlertTitle>
      <AlertDescription className="pt-1">
        While we&apos;re working hard to iron out any bugs, but you&apos;ll
        probably find some issues. Please bear with us and don&apos;t hesitate
        to reach out for questions or feedback on anything you&apos;d like to
        see improved.
      </AlertDescription>
    </Alert>
  )
  /*   return (
    <div className=" w-full space-y-4 rounded-lg bg-muted p-6 md:space-y-6 md:p-8 lg:mt-0">
      <div className="flex flex-col items-start gap-3 md:flex-row md:items-center">
        <PiHeartSupportSolid className="hidden size-6 md:block" />
        <h1 className="w-full text-xl font-bold md:w-fit">
          Welcome to our beta program!
        </h1>
      </div>
      <div className="grid-cols-8 space-y-6 text-xs md:grid md:space-y-0 md:text-sm">
        <p className="col-span-4">
          The Studio is in the early stages of development and is only in
          sandbox mode for now. You&apos;ll probably find bugs and missing
          features. Please bear with us and don&apos;t hesitate to reach out for
          questions or feedback on anything you&apos;d like to see improved.
        </p>
        <span className="" />
        <ul className="col-span-3 list-disc space-y-1 pl-6 font-medium md:pl-0 ">
          <li>Please report issues you find</li>
          <li>Suggest new features</li>
          <li>Let us know if somethingis confusing</li>
        </ul>
      </div>
    </div>
  ); */
}
