import {
  Archive,
  ArchiveX,
  Forward,
  MoreVertical,
  Reply,
  ReplyAll,
  BellOff,
  X,
  Lock,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns/format";
import { cn } from "@/lib/utils";
import React from "react";

import { DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Mail } from "@/components/mail/data";
import ReplyComposer from "./reply-composer";
import { useMail } from "./use-mail";

interface MailDisplayProps {
  mail: Mail | null;
  onClose?: () => void;
  isMobile?: boolean;
}

export function MailDisplay({ mail, onClose, isMobile }: MailDisplayProps) {
  const [, setMail] = useMail();
  const [currentMail, setCurrentMail] = useState<Mail | null>(mail);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    setCurrentMail(mail);
  }, [mail]);

  useEffect(() => {
    if (currentMail) {
      setIsMuted(currentMail.muted ?? false);
    }
  }, [currentMail]);

  const handleClose = useCallback(() => {
    onClose?.();
    setMail({ selected: null });
  }, [onClose, setMail]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [handleClose]);

  if (!currentMail) return null;

  return (
    <div className="flex h-full flex-col">
      <div className={cn("flex h-full flex-col", isMobile ? "" : "rounded-r-lg pt-[6px]")}>
        <div className="sticky top-0 z-20 flex items-center gap-2 border-b bg-background/95 px-4 pb-[7.5px] pt-[0.5px] backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex flex-1 items-center gap-2">
            {!isMobile && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    className="md:h-fit md:px-2"
                    disabled={!currentMail}
                    onClick={handleClose}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Close</TooltipContent>
              </Tooltip>
            )}
            <div className="flex-1 truncate text-sm font-medium">
              {currentMail?.subject || "No message selected"}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" className="md:h-fit md:px-2" disabled={!currentMail}>
                  <Archive className="h-4 w-4" />
                  <span className="sr-only">Archive</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Archive</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" className="md:h-fit md:px-2" disabled={!currentMail}>
                  <Reply className="h-4 w-4" />
                  <span className="sr-only">Reply</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Reply</TooltipContent>
            </Tooltip>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="md:h-fit md:px-2" disabled={!currentMail}>
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">More</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <ArchiveX className="mr-2 h-4 w-4" /> Move to junk
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ReplyAll className="mr-2 h-4 w-4" /> Reply all
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Forward className="mr-2 h-4 w-4" /> Forward
                </DropdownMenuItem>
                <DropdownMenuItem>Mark as unread</DropdownMenuItem>
                <DropdownMenuItem>Add label</DropdownMenuItem>
                <DropdownMenuItem>Mute thread</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="relative flex-1 overflow-hidden">
          <div className="absolute inset-0 overflow-y-auto">
            <div className="flex flex-col gap-4 px-4 py-4">
              <div className="flex items-start gap-3">
                <Avatar>
                  <AvatarImage alt={currentMail.name} />
                  <AvatarFallback>
                    {currentMail.name
                      .split(" ")
                      .map((chunk) => chunk[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="font-semibold">{currentMail.name}</div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span>{currentMail.email}</span>
                    {isMuted && <BellOff className="h-4 w-4" />}
                  </div>
                  <div className="flex items-center gap-2">
                    <time className="text-xs text-muted-foreground">
                      {format(new Date(currentMail.date), "PPp")}
                    </time>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-auto p-0 text-xs underline">
                          Details
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[280px] space-y-2" align="start">
                        <div className="text-xs">
                          <span className="font-medium text-muted-foreground">From:</span>{" "}
                          {currentMail.email}
                        </div>
                        <div className="text-xs">
                          <span className="font-medium text-muted-foreground">Reply-To:</span>{" "}
                          {currentMail.email}
                        </div>
                        <div className="text-xs">
                          <span className="font-medium text-muted-foreground">To:</span>{" "}
                          {currentMail.email}
                        </div>
                        <div className="text-xs">
                          <span className="font-medium text-muted-foreground">Cc:</span>{" "}
                          {currentMail.email}
                        </div>
                        <div className="text-xs">
                          <span className="font-medium text-muted-foreground">Date:</span>{" "}
                          {format(new Date(currentMail.date), "PPpp")}
                        </div>
                        <div className="text-xs">
                          <span className="font-medium text-muted-foreground">Mailed-By:</span>{" "}
                          {currentMail.email}
                        </div>
                        <div className="text-xs">
                          <span className="font-medium text-muted-foreground">Signed-By:</span>{" "}
                          {currentMail.email}
                        </div>
                        <div className="flex items-center gap-1 text-xs">
                          <span className="font-medium text-muted-foreground">Security:</span>{" "}
                          <Lock className="h-3 w-3" /> {currentMail.email}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="px-8 py-4 pb-[200px]">
              <div className="whitespace-pre-wrap text-sm leading-relaxed">{currentMail.text}</div>
            </div>
          </div>

          <ReplyComposer currentMail={currentMail} />
        </div>
      </div>
    </div>
  );
}

<style jsx global>{`
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
`}</style>;
