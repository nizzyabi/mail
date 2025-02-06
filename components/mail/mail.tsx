"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search } from "lucide-react";
import { useState } from "react";
import * as React from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MailList } from "@/components/mail/mail-list";
import { MailDisplay } from "@/components/mail/mail-display";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useMail } from "@/components/mail/use-mail";

// Filters imports
import { useAtomValue } from "jotai"
import Filters from "@/components/mail/filters";
import { tagsAtom } from "@/components/mail/use-tags"
import { useFilteredMails } from "@/hooks/use-filtered-mails";
import { type Mail } from "@/components/mail/data";
import { Input } from "@/components/ui/input";

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
  const [isCompact, setIsCompact] = React.useState(false)
  const tags = useAtomValue(tagsAtom)
  const activeTags = tags.filter(tag => tag.checked)

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
      <div className="flex h-screen">
        <div className="mt-2 flex-1 overflow-y-auto border-r">
          <Tabs defaultValue="all">
            <div className="flex items-center px-6 py-2">
              <h1 className="hidden text-xl font-bold md:block">Inbox</h1>
              <TabsList className="ml-auto">
                <TabsTrigger value="all" className="text-zinc-600 dark:text-zinc-200">
                  All mail
                </TabsTrigger>
                <TabsTrigger value="unread" className="text-zinc-600 dark:text-zinc-200">
                  Unread
                </TabsTrigger>
              </TabsList>
            </div>
            <Separator className="hidden md:block" />
            <div className="bg-background p-4 backdrop-blur supports-[backdrop-filter]:bg-background">
              <form>
                <div className="relative">
                  <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search" className="pl-8" />
                </div>
              </form>
            </div>
            <Separator />

            {/* Filters sections */}
            <div className="flex justify-between items-center px-4 py-2">
              <Filters />
              <Button variant="ghost" size="sm" onClick={() => setIsCompact(!isCompact)}>
                <AlignVerticalSpaceAround />
              </Button>
            </div>

            <Separator />
            
            <TabsContent value="all" className="m-0">
              {filteredMails.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  No messages found | Clear filters to see more results
                </div>
              ) : (
                <MailList items={filteredMails} isCompact={isCompact} onMailClick={() => setIsDialogOpen(true)} />
              )}
            </TabsContent>

            <TabsContent value="unread" className="m-0">
              {filteredMails.filter((item) => !item.read).length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  No unread messages
                </div>
              ) : (
                <MailList
                items={filteredMails.filter((item) => !item.read)}isCompact={isCompact} 
                onMailClick={() => setIsDialogOpen(true)}
              />
              )}
            </TabsContent>

          </Tabs>
        </div>

        {/* Desktop Mail Display */}
        <div className="hidden flex-1 overflow-y-auto md:block">
          <MailDisplay mail={filteredMails.find((item) => item.id === mail.selected) || null} />
        </div>

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
