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
import { MailList } from "@/components/mail/mail-list";
import { MailDisplay } from "@/components/mail/mail-display";
import { Button } from "@/components/ui/button";
import { type Mail } from "@/components/mail/data";
import { useMail } from "@/components/mail/use-mail";

// Filters imports
import { useAtomValue } from "jotai"
import Filters from "@/components/mail/filters";
import { tagsAtom } from "@/components/mail/use-tags"
import { useFilteredMails } from "@/hooks/use-filtered-mails";

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

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex h-screen">
        {/* Middle Panel */}
        <div className="flex-1 border-r overflow-y-auto">
          <Tabs defaultValue="all">
            <div className="flex items-center px-4 py-2">
              <h1 className="text-xl font-bold">Inbox</h1>
              <TabsList className="ml-auto">
                <TabsTrigger value="all" className="text-zinc-600 dark:text-zinc-200">
                  All mail
                </TabsTrigger>
                <TabsTrigger value="unread" className="text-zinc-600 dark:text-zinc-200">
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
                  No messages found
                </div>
              ) : (
                <MailList items={filteredMails} isCompact={isCompact} />
              )}
            </TabsContent>

            <TabsContent value="unread" className="m-0">
              {filteredMails.filter((item) => !item.read).length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  No unread messages
                </div>
              ) : (
                <MailList items={filteredMails.filter((item) => !item.read)} isCompact={isCompact} />
              )}
            </TabsContent>


          </Tabs>
        </div>

        {/* Right Panel */}
        <div className="flex-1 overflow-y-auto">
          <MailDisplay
            mail={filteredMails.find((item) => item.id === mail.selected) || null}
          />
        </div>
      </div>
    </TooltipProvider>
  );
}
