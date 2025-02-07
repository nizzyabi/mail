"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlignVerticalSpaceAround, Search } from "lucide-react";
import { useState } from "react";
import * as React from "react";

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MailDisplay } from "@/components/mail/mail-display";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MailList } from "@/components/mail/mail-list";
import { Separator } from "@/components/ui/separator";
import { useMail } from "@/components/mail/use-mail";
import { Button } from "@/components/ui/button";

// Filters imports
import { useFilteredMails } from "@/hooks/use-filtered-mails";
import { tagsAtom } from "@/components/mail/use-tags";
import { SidebarToggle } from "../ui/sidebar-toggle";
import { type Mail } from "@/components/mail/data";
import Filters from "@/components/mail/filters";
import { Input } from "@/components/ui/input";
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
      <div className="flex h-dvh">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={isMobile ? 100 : 25} minSize={isMobile ? 100 : 25}>
            <div className="flex-1 overflow-y-auto border-r">
              <Tabs defaultValue="all">
                <div className="flex items-center justify-between p-4">
                  <SidebarToggle className="block md:hidden" />
                  <h1 className="hidden text-xl font-bold md:block">Inbox</h1>
                  <div className="flex items-center space-x-1.5">
                    <Button variant="ghost" size="icon" onClick={() => setIsCompact(!isCompact)}>
                      <AlignVerticalSpaceAround />
                    </Button>
                    <TabsList>
                      <TabsTrigger value="all" className="text-zinc-600 dark:text-zinc-200">
                        All mail
                      </TabsTrigger>
                      <TabsTrigger value="unread" className="text-zinc-600 dark:text-zinc-200">
                        Unread
                      </TabsTrigger>
                    </TabsList>
                  </div>
                </div>

                <div className="bg-background backdrop-blur supports-[backdrop-filter]:bg-background">
                  <form className="flex space-x-1.5 p-4 pt-0">
                    <div className="relative flex-1">
                      <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Search" className="pl-8" />
                    </div>
                    <div>
                      <Filters />
                    </div>
                  </form>
                </div>

                <Separator />

                <TabsContent value="all" className="m-0">
                  {filteredMails.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                      No messages found | Clear filters to see more results
                    </div>
                  ) : (
                    <MailList
                      items={filteredMails}
                      isCompact={isCompact}
                      onMailClick={() => setIsDialogOpen(true)}
                    />
                  )}
                </TabsContent>

                <TabsContent value="unread" className="m-0">
                  {filteredMails.filter((item) => !item.read).length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">No unread messages</div>
                  ) : (
                    <MailList
                      items={filteredMails.filter((item) => !item.read)}
                      isCompact={isCompact}
                      onMailClick={() => setIsDialogOpen(true)}
                    />
                  )}
                </TabsContent>
              </Tabs>
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
