import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectTriggerThick,
} from '@repo/ui/components/ui/select'

export default function Intro() {
  return (
    <div className="grid w-full place-items-center pb-36 pt-16">
      <h1 className="inline w-full text-balance text-center text-2xl leading-loose text-secondary-foreground/50  sm:text-3xl md:text-4xl">
        Create
        <Select defaultValue="pfps">
          <SelectTriggerThick className="mx-1 inline-flex h-fit w-fit gap-1.5 border-none bg-transparent text-2xl font-bold text-foreground focus:rounded-none focus:ring-0 sm:text-3xl md:text-4xl">
            <SelectValue />
          </SelectTriggerThick>
          <SelectContent className="min-w-52">
            <SelectItem value="pfps">Profile Pictures</SelectItem>
            <SelectItem value="traits">Collectibles</SelectItem>
            <SelectItem value="art">Art</SelectItem>
            <SelectItem value="game">Game Items</SelectItem>
            <SelectItem value="tickets">Tickets</SelectItem>
          </SelectContent>
        </Select>
        that change their
        <Select defaultValue="image">
          <SelectTriggerThick className="mx-1 inline-flex w-fit gap-1.5 overflow-visible border-none bg-transparent text-2xl font-extrabold text-foreground outline-transparent ring-transparent focus:rounded-none focus:ring-0 sm:text-3xl md:text-4xl">
            <SelectValue />
          </SelectTriggerThick>
          <SelectContent className="min-w-52">
            <SelectItem value="image">Image</SelectItem>
            <SelectItem value="traits">Traits</SelectItem>
            <SelectItem value="metadata">Metadata</SelectItem>
            <SelectItem value="owner">Utility</SelectItem>
          </SelectContent>
        </Select>
        based on
        <Select defaultValue="interaction">
          <SelectTriggerThick className="mx-1  inline-flex h-fit w-fit gap-1.5 border-none bg-transparent text-2xl font-extrabold text-foreground focus:rounded-none focus:ring-0 sm:text-3xl md:text-4xl">
            <SelectValue />
          </SelectTriggerThick>
          <SelectContent className="min-w-52">
            <SelectItem value="interaction">User Interaction</SelectItem>
            <SelectItem value="twitter">Twitter Engagement</SelectItem>
            <SelectItem value="traits">Time</SelectItem>
            <SelectItem value="metadata">Blockchain Events</SelectItem>
            <SelectItem value="wheater">Weather</SelectItem>
            <SelectItem value="game">Game Actions</SelectItem>
          </SelectContent>
        </Select>
        easily.
      </h1>
    </div>
  )
}
