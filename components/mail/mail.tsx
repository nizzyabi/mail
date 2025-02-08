"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlignVerticalSpaceAround, ListFilter } from "lucide-react";
import { useState } from "react";
import * as React from "react";

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { MailDisplay } from "@/components/mail/mail-display";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MailList } from "@/components/mail/mail-list";
import { Separator } from "@/components/ui/separator";
import { useMail } from "@/components/mail/use-mail";
import { Button } from "@/components/ui/button";

// Filters imports
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useFilteredMails } from "@/hooks/use-filtered-mails";
import { tagsAtom } from "@/components/mail/use-tags";
import { SidebarToggle } from "../ui/sidebar-toggle";
import { type Mail } from "@/components/mail/data";
import { useAtomValue } from "jotai";

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

export function Mail({ mails }: MailProps) {
  const [mail] = useMail();
  const [isCompact, setIsCompact] = React.useState(false);
  const tags = useAtomValue(tagsAtom);
  const activeTags = tags.filter((tag) => tag.checked);

  const filteredMails = useFilteredMails(mails, activeTags);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [filterValue, setFilterValue] = useState<"all" | "unread">("all");

  // Check if we're on mobile on mount and when window resizes
  React.useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px is the 'md' breakpoint
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  // Only show dialog if we're on mobile
  const showDialog = isDialogOpen && isMobile;

  return (
    <TooltipProvider delayDuration={0}>
      <div className="rounded-inherit flex">
        <ResizablePanelGroup
          direction="horizontal"
          autoSaveId={"mail-panel-layout"}
          className="rounded-inherit overflow-hidden"
        >
          <ResizablePanel defaultSize={isMobile ? 290 : 35} minSize={isMobile ? 100 : 35}>
            <div className="flex-1 overflow-y-auto pt-[6px]">
              <div>
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-2">
                    <SidebarToggle />
                    <h1 className="hidden font-semibold md:block">Inbox</h1>
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
                  </div>
                </div>

                <Separator className="mt-2" />

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
              className="hidden md:block"
            >
              {/* Desktop Mail Display */}
              <div className="hidden h-full flex-1 overflow-y-auto md:block">
                <MailDisplay
                  mail={filteredMails.find((item) => item.id === mail.selected) || null}
                />
              </div>
            </ResizablePanel>
          )}
        </ResizablePanelGroup>

        {/* Mobile Dialog */}
        <Dialog open={showDialog} onOpenChange={setIsDialogOpen}>
          <DialogContent className="h-[100vh] border-none p-0 sm:max-w-[100vw]">
            <DialogHeader className="hidden">
              <DialogTitle></DialogTitle>
            </DialogHeader>
            <MailDisplay mail={mails.find((item) => item.id === mail.selected) || null} />
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}
