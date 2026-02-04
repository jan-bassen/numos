import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@repo/ui/components/command'
import { FileIcon, FolderIcon, HomeIcon, SettingsIcon } from 'lucide-react'

export function ExampleCommand() {
  return (
    <Command className="rounded-lg border shadow-md w-full max-w-[300px]">
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>
            <HomeIcon className="mr-2 h-4 w-4" />
            <span>Home</span>
          </CommandItem>
          <CommandItem>
            <FileIcon className="mr-2 h-4 w-4" />
            <span>Documents</span>
          </CommandItem>
          <CommandItem>
            <FolderIcon className="mr-2 h-4 w-4" />
            <span>Projects</span>
          </CommandItem>
          <CommandItem>
            <SettingsIcon className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
