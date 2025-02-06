"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search } from "lucide-react";
import { useState } from "react";
import * as React from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MailDisplay } from "@/components/mail/mail-display";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MailList } from "@/components/mail/mail-list";
import { Separator } from "@/components/ui/separator";
import { useMail } from "@/components/mail/use-mail";
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
            <TabsContent value="all" className="m-0">
              <MailList items={mails} onMailClick={() => setIsDialogOpen(true)} />
            </TabsContent>
            <TabsContent value="unread" className="m-0">
              <MailList
                items={mails.filter((item) => !item.read)}
                onMailClick={() => setIsDialogOpen(true)}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Desktop Mail Display */}
        <div className="hidden flex-1 overflow-y-auto md:block">
          <MailDisplay mail={mails.find((item) => item.id === mail.selected) || null} />
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
