"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlignVerticalSpaceAround, ListFilter, Search, SquarePen } from "lucide-react";
import { useState, useCallback, useMemo, useRef } from "react";
import * as React from "react";

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { MailDisplay } from "@/components/mail/mail-display";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MailList } from "@/components/mail/mail-list";
import { Separator } from "@/components/ui/separator";
import { useMail } from "@/components/mail/use-mail";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useOpenComposeModal } from "@/hooks/use-open-compose-modal";
import { useFilteredMails } from "@/hooks/use-filtered-mails";
import { tagsAtom } from "@/components/mail/use-tags";
import { SidebarToggle } from "../ui/sidebar-toggle";
import { type Mail } from "@/components/mail/data";
import { useAtomValue } from "jotai";
import { Input } from "../ui/input";
import Filters from "./filters";

import useKeyboardShortcuts from "@/hooks/use-keyboard-shortcuts";

interface MailProps {
  accounts: {
    label: string;
    email: string;
    icon: React.ReactNode;
  }[];
  mails: Mail[];
  defaultLayout: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
  muted?: boolean;
}

//  shortcut map outside component to prevent recreating on each render
export const mailShortcutMap = {
  COMPOSE: "n",
  TOGGLE_COMPACT: "t",
  TOGGLE_FILTER_ALL: "a",
  TOGGLE_FILTER_UNREAD: "u",
  CLOSE_MAIL: "Escape",
  SEARCH_FOCUS: "/",
  PREV_MAIL: "ArrowUp",
  NEXT_MAIL: "ArrowDown",
  ARCHIVE: "e",
  DELETE: "Delete",
  REPLY: "r",
  REPLY_ALL: "shift+r",
  FORWARD: "f",
  TOGGLE_READ: "m",
  TOGGLE_STAR: "s",
} as const;

export function Mail({ mails }: MailProps) {
  const [mail, setMail] = useMail();
  const [isCompact, setIsCompact] = React.useState(false);
  const tags = useAtomValue(tagsAtom);
  const activeTags = tags.filter((tag) => tag.checked);
  const filteredMails = useFilteredMails(mails, activeTags);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [filterValue, setFilterValue] = useState<"all" | "unread">("all");
  const { open: openCompose } = useOpenComposeModal();
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Check if we're on mobile on mount and when window resizes
  React.useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const showDialog = isDialogOpen && isMobile;

  const onMobileDialogClose = useCallback(() => {
    setIsDialogOpen(false);
    setMail({ selected: null });
  }, [setMail]);

  const selectedMail = useMemo(
    () => filteredMails.find((item) => item.id === mail.selected) || null,
    [filteredMails, mail.selected],
  );

  // Handler to navigate between emails
  const handleMailNavigation = useCallback(
    (direction: "next" | "prev") => {
      if (!mail.selected || filteredMails.length === 0) return;

      const currentIndex = filteredMails.findIndex((item) => item.id === mail.selected);
      if (currentIndex === -1) return;

      let newIndex;
      if (direction === "next") {
        newIndex = currentIndex + 1 >= filteredMails.length ? 0 : currentIndex + 1;
      } else {
        newIndex = currentIndex - 1 < 0 ? filteredMails.length - 1 : currentIndex - 1;
      }

      setMail({ selected: filteredMails[newIndex].id });
      setIsDialogOpen(true);
    },
    [mail.selected, filteredMails, setMail],
  );

  // Mail action handlers
  const handleArchive = useCallback(() => {
    if (selectedMail) {
      // Implement archive functionality once backend is done
      console.log("Archive mail:", selectedMail.id);
    }
  }, [selectedMail]);

  const handleDelete = useCallback(() => {
    if (selectedMail) {
      // Implement delete functionality once backend is done
      console.log("Delete mail:", selectedMail.id);
    }
  }, [selectedMail]);

  const handleToggleRead = useCallback(() => {
    if (selectedMail) {
      // Implement toggle read functionality
      console.log("Toggle read:", selectedMail.id);
    }
  }, [selectedMail]);

  const handleReply = useCallback(() => {
    if (selectedMail) {
      // Implement reply functionality
      console.log("Reply to:", selectedMail.id);
    }
  }, [selectedMail]);

  const handleReplyAll = useCallback(() => {
    if (selectedMail) {
      // Implement reply all functionality
      console.log("Reply all to:", selectedMail.id);
    }
  }, [selectedMail]);

  const handleForward = useCallback(() => {
    if (selectedMail) {
      // Implement forward functionality
      console.log("Forward mail:", selectedMail.id);
    }
  }, [selectedMail]);

  // Define keyboard shortcut handlers
  const shortcutHandlers = useMemo(
    () => ({
      COMPOSE: () => openCompose(),
      TOGGLE_COMPACT: () => setIsCompact((prev) => !prev),
      TOGGLE_FILTER_ALL: () => setFilterValue("all"),
      TOGGLE_FILTER_UNREAD: () => setFilterValue("unread"),
      CLOSE_MAIL: () => {
        setIsDialogOpen(false);
        setMail({ selected: null });
      },
      SEARCH_FOCUS: (e?: KeyboardEvent) => {
        e?.preventDefault();
        searchInputRef.current?.focus();
      },
      PREV_MAIL: () => handleMailNavigation("prev"),
      NEXT_MAIL: () => handleMailNavigation("next"),
      ARCHIVE: handleArchive,
      DELETE: handleDelete,
      REPLY: handleReply,
      REPLY_ALL: handleReplyAll,
      FORWARD: handleForward,
      TOGGLE_READ: handleToggleRead,
    }),
    [
      openCompose,
      handleMailNavigation,
      setMail,
      handleArchive,
      handleDelete,
      handleReply,
      handleReplyAll,
      handleForward,
      handleToggleRead,
    ],
  );

  // Initialize keyboard shortcuts
  useKeyboardShortcuts(mailShortcutMap, shortcutHandlers, {
    enableInInputs: false,
    preventDefault: true,
  });

  return (
    <TooltipProvider delayDuration={0}>
      <div className="rounded-inherit flex">
        <ResizablePanelGroup
          direction="horizontal"
          autoSaveId="mail-panel-layout"
          className="rounded-inherit overflow-hidden"
        >
          <ResizablePanel defaultSize={isMobile ? 100 : 35} minSize={isMobile ? 100 : 35}>
            <div className="flex-1 overflow-y-auto">
              <div>
                <div className="sticky top-0 z-10 rounded-t-md bg-background pt-[6px]">
                  <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-1">
                      <SidebarToggle className="h-fit px-2" />
                      <React.Suspense>
                        <ComposeButton />
                      </React.Suspense>
                    </div>
                    <div className="relative flex-1 px-4 md:max-w-[400px] md:px-8">
                      <Search className="absolute left-6 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground md:left-10" />
                      <Input
                        ref={searchInputRef}
                        placeholder="Search"
                        className="h-7 w-full pl-7 focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <Button
                        variant="ghost"
                        className="md:h-fit md:px-2"
                        onClick={() => setIsCompact(!isCompact)}
                      >
                        <AlignVerticalSpaceAround />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="md:h-fit md:px-2">
                            <ListFilter className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setFilterValue("all")}>
                            All mail
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setFilterValue("unread")}>
                            Unread
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <Filters />
                    </div>
                  </div>
                  <Separator className="mt-2" />
                </div>

                <div className="h-[calc(93vh)]">
                  {filterValue === "all" ? (
                    filteredMails.length === 0 ? (
                      <div className="p-8 text-center text-muted-foreground">
                        No messages found | Clear filters to see more results
                      </div>
                    ) : (
                      <MailList
                        items={filteredMails}
                        isCompact={isCompact}
                        onMailClick={() => setIsDialogOpen(true)}
                      />
                    )
                  ) : filteredMails.filter((item) => !item.read).length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">No unread messages</div>
                  ) : (
                    <MailList
                      items={filteredMails.filter((item) => !item.read)}
                      isCompact={isCompact}
                      onMailClick={() => setIsDialogOpen(true)}
                    />
                  )}
                </div>
              </div>
            </div>
          </ResizablePanel>

          {!isMobile && mail.selected && <ResizableHandle withHandle />}

          {mail.selected && (
            <ResizablePanel
              defaultSize={isMobile ? 0 : 75}
              minSize={isMobile ? 0 : 25}
              className="hidden overflow-hidden md:block"
            >
              <div className="hidden h-full flex-1 overflow-y-auto md:block">
                <MailDisplay mail={selectedMail} onClose={onMobileDialogClose} />
              </div>
            </ResizablePanel>
          )}
        </ResizablePanelGroup>

        {/* Mobile Dialog */}
        <Dialog open={showDialog} onOpenChange={(open) => !open && onMobileDialogClose()}>
          <DialogContent className="h-[100vh] overflow-hidden border-none p-0 sm:max-w-[100vw]">
            <DialogHeader className="hidden">
              <DialogTitle className="sr-only">Mail</DialogTitle>
            </DialogHeader>
            <MailDisplay mail={selectedMail} onClose={onMobileDialogClose} />
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}

function ComposeButton() {
  const { open } = useOpenComposeModal();
  return (
    <Button onClick={open} variant="ghost" className="h-fit px-2">
      <SquarePen />
    </Button>
  );
}
