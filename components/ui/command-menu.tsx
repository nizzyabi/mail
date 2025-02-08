"use client";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  Pencil,
  Tag,
  MailCheck,
  MailPlus,
  CircleHelp,
  FolderPlus,
  ArrowUpRight,
} from "lucide-react";
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
              <Pencil size={16} strokeWidth={2} className="opacity-60" aria-hidden="true" />
              <span>Compose message</span>
              <CommandShortcut>⌘C</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <Tag size={16} strokeWidth={2} className="opacity-60" aria-hidden="true" />
              <span>Create label</span>
            </CommandItem>
            <CommandItem>
              <FolderPlus size={16} strokeWidth={2} className="opacity-60" aria-hidden="true" />
              <span>Create folder</span>
            </CommandItem>
            <CommandItem>
              <MailCheck size={16} strokeWidth={2} className="opacity-60" aria-hidden="true" />
              <span>Mark inbox as read</span>
            </CommandItem>
            <CommandItem>
              <MailPlus size={16} strokeWidth={2} className="opacity-60" aria-hidden="true" />
              <span>Import mail</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Help">
            <CommandItem>
              <CircleHelp size={16} strokeWidth={2} className="opacity-60" aria-hidden="true" />
              <span>Help with shortcuts</span>
              <CommandShortcut>⌘?</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <ArrowUpRight size={16} strokeWidth={2} className="opacity-60" aria-hidden="true" />
              <span>Go to docs</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      {/* Compose Message Dialog */}
      <MailCompose open={composeOpen} onClose={() => setComposeOpen(false)} />
    </>
  );
};
