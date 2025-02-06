"use client";

import * as React from "react";
import {
  Search,
} from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MailDisplay } from "@/components/mail/mail-display";
import { MailList } from "@/components/mail/mail-list";
import { type Mail } from "@/components/mail/data";
import { useMail } from "@/components/mail/use-mail";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

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
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Only show dialog if we're on mobile
  const showDialog = isDialogOpen && isMobile;

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex h-screen ">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={isMobile ? 100 : 25} minSize={isMobile ? 100 : 25}>
            <div className="flex-1 border-r overflow-y-auto mt-2">
              <Tabs defaultValue="all">
                <div className="flex items-center px-6 py-2">
                  <h1 className="text-xl font-bold hidden md:block">Inbox</h1>
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
                  <MailList items={mails.filter((item) => !item.read)} onMailClick={() => setIsDialogOpen(true)} />
                </TabsContent>
              </Tabs>
            </div>
          </ResizablePanel>

          {!isMobile && <ResizableHandle withHandle className="hidden md:block" />}

          <ResizablePanel defaultSize={isMobile ? 0 : 75} minSize={isMobile ? 0 : 25} className="hidden md:block">
            {/* Desktop Mail Display */}
            <div className="flex-1 overflow-y-auto h-full">
              <MailDisplay mail={mails.find((item) => item.id === mail.selected) || null} />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>

        {/* Mobile Dialog */}
        <Dialog open={showDialog} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[100vw] h-[100vh] p-0 border-none">
            <DialogHeader className="hidden">
              <DialogTitle></DialogTitle>
            </DialogHeader>
            <MailDisplay
              mail={mails.find((item) => item.id === mail.selected) || null}
            />
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}
