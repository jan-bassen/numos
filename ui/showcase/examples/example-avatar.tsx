import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/components/avatar'

export function ExampleAvatar() {
  return (
    <div className="flex gap-4">
      <Avatar>
        <AvatarImage src="/placeholder.svg" alt="Avatar" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src="/placeholder.svg" alt="Avatar" />
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>MK</AvatarFallback>
      </Avatar>
    </div>
  )
}
