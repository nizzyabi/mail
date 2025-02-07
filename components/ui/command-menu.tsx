"use client";

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command";
import { Tag, Pencil, Folder, MailCheck, MailPlus, CircleHelp } from "lucide-react";

import { useState, useEffect } from "react";

export const CommandMenu = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <Command className="rounded-lg border shadow-md md:min-w-[450px]">
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup>
            <CommandItem>
              <Pencil />
              <span>Compose message</span>
              <CommandShortcut>⌘C</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <Tag />
              <span>Create label</span>
            </CommandItem>
            <CommandItem>
              <Folder />
              <span>Create folder</span>
            </CommandItem>
            <CommandItem>
              <MailCheck />
              <span>Mark inbox as read</span>
            </CommandItem>
            <CommandItem>
              <MailPlus />
              <span>Import mail</span>
            </CommandItem>
            <CommandItem>
              <CircleHelp />
              <span>Help with shortcuts</span>
              <CommandShortcut>⌘?</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
};
