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
import { Pencil, Tag, Folder, MailCheck, MailPlus, CircleHelp } from "lucide-react";
import { MailCompose } from "@/components/mail/mail-compose"; // Import MailCompose component
import { useState, useEffect } from "react";

export const CommandMenu = () => {
  const [open, setOpen] = useState(false);
  const [composeOpen, setComposeOpen] = useState(false); // Manage compose dialog state

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "c") {
        e.preventDefault();
        setComposeOpen(true);
        setOpen(false); // Close the command menu
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      {/* Command Menu */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command className="rounded-lg border shadow-md md:min-w-[450px]">
          <CommandInput
            placeholder="Type a command or search..."
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "c") {
                e.preventDefault();
                setComposeOpen(true);
                setOpen(false); // Close the command menu
              }
            }}
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setComposeOpen(true);
                  setOpen(false); // Close the command menu
                }}
              >
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

      {/* Compose Message Dialog */}
      <MailCompose open={composeOpen} onClose={() => setComposeOpen(false)} />
    </>
  );
};
