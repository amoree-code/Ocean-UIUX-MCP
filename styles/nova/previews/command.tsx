import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/styles/nova/ui/command"
import { BarChartIcon, SettingsIcon, UsersIcon } from "lucide-react"

export default function CommandPreview() {
  return (
    <Command className="w-full border">
      <CommandInput placeholder="Search dashboards..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Reports">
          <CommandItem>
            <BarChartIcon />
            <span>Revenue Overview</span>
          </CommandItem>
          <CommandItem>
            <UsersIcon />
            <span>Active Users</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem>
            <SettingsIcon />
            <span>Preferences</span>
            <CommandShortcut>⌘,</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
