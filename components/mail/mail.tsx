"use client";

import * as React from "react";
import {
  AlignVerticalSpaceAround,
  Search,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MailDisplay } from "@/components/mail/mail-display";
import { MailList } from "@/components/mail/mail-list";
import { type Mail } from "@/components/mail/data";
import { useMail } from "@/components/mail/use-mail";
import { Badge } from "../ui/badge";


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
  
  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex h-screen">
        {/* Middle Panel */}
        <div className="flex-1 border-r overflow-y-auto">
          <Tabs defaultValue="all">
            <div className="flex items-center px-4 py-2">
              <h1 className="text-xl font-bold">Inbox</h1>
              <TabsList className="ml-auto">
                <TabsTrigger
                  value="all"
                  className="text-zinc-600 dark:text-zinc-200"
                >
                  All mail
                </TabsTrigger>
                <TabsTrigger
                  value="unread"
                  className="text-zinc-600 dark:text-zinc-200"
                >
                  Unread
                </TabsTrigger>
              </TabsList>
            </div>
            <Separator />
            <div className="bg-background p-4 backdrop-blur supports-[backdrop-filter]:bg-background">
              <form>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search" className="pl-8" />
                </div>
              </form>
            </div>
            <Separator />
            {/* hide this when we scroll in the mail list */}
            <div className="flex justify-between items-center px-4 py-2">
              <div>
                <Badge>
                  work
                </Badge>
              </div>

              <button onClick={() => setIsCompact(!isCompact)}>
                <AlignVerticalSpaceAround />
              </button>
            </div>

            <Separator />

            <TabsContent value="all" className="m-0">
              <MailList items={mails} isCompact={isCompact} />
            </TabsContent>
            <TabsContent value="unread" className="m-0">
              <MailList items={mails.filter((item) => !item.read)} isCompact={isCompact} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Panel */}
        <div className="flex-1 overflow-y-auto">
          <MailDisplay
            mail={mails.find((item) => item.id === mail.selected) || null}
          />
        </div>
      </div>

    </TooltipProvider>
  );
}
