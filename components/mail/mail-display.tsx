import {
  Archive,
  ArchiveX,
  Forward,
  MoreVertical,
  Paperclip,
  Reply,
  ReplyAll,
  BellOff,
  X,
  Lock,
  Send,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns/format";
import React from "react";

import { DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail } from "@/components/mail/data";
import { useMail } from "./use-mail";
import { Badge } from "../ui/badge";

interface MailDisplayProps {
  mail: Mail | null;
  onClose?: () => void;
}

export function MailDisplay({ mail, onClose }: MailDisplayProps) {
  const [isMuted, setIsMuted] = useState(mail ? mail.muted : false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [, setMail] = useMail();

  const handleClose = useCallback(() => {
    onClose?.();
    setMail({ selected: null });
  }, [onClose, setMail]);

  const handleAttachment = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setIsUploading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        setAttachments([...attachments, ...Array.from(e.target.files)]);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const truncateFileName = (name: string, maxLength = 15) => {
    if (name.length <= maxLength) return name;
    const extIndex = name.lastIndexOf(".");
    if (extIndex !== -1 && name.length - extIndex <= 5) {
      // Preserve file extension if possible
      return `${name.slice(0, maxLength - 5)}...${name.slice(extIndex)}`;
    }
    return `${name.slice(0, maxLength)}...`;
  };

  // Update the muted state when the mail prop changes.
  useEffect(() => {
    if (mail) {
      setIsMuted(mail.muted);
    }
  }, [mail]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [handleClose]);

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-r-lg">
      <div className="sticky top-0 z-10 flex items-center gap-2 border-b bg-background/95 px-4 py-2 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex flex-1 items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" disabled={!mail} onClick={handleClose}>
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Close</TooltipContent>
          </Tooltip>
          <div className="flex-1 truncate text-sm font-medium">
            {mail?.subject || "No message selected"}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" disabled={!mail}>
                <Archive className="h-4 w-4" />
                <span className="sr-only">Archive</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Archive</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" disabled={!mail}>
                <Reply className="h-4 w-4" />
                <span className="sr-only">Reply</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Reply</TooltipContent>
          </Tooltip>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" disabled={!mail}>
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

      {mail ? (
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Mail header */}
          <div className="flex flex-col gap-4 px-4 py-4">
            <div className="flex items-start gap-3">
              <Avatar>
                <AvatarImage alt={mail.name} />
                <AvatarFallback>
                  {mail.name
                    .split(" ")
                    .map((chunk) => chunk[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="font-semibold">{mail.name}</div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span>{mail.email}</span>
                  {isMuted && <BellOff className="h-4 w-4" />}
                </div>
                <div className="flex items-center gap-2">
                  <time className="text-xs text-muted-foreground">
                    {format(new Date(mail.date), "PPp")}
                  </time>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-auto p-0 text-xs underline">
                        Details
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[280px] space-y-2" align="start">
                      {/* TODO: Content is currently dummy and uses mail.email for all of them. need to add other values to email type */}
                      <div className="text-xs">
                        <span className="font-medium text-muted-foreground">From:</span>{" "}
                        {mail.email}
                      </div>
                      <div className="text-xs">
                        <span className="font-medium text-muted-foreground">Reply-To:</span>{" "}
                        {mail.email}
                      </div>
                      <div className="text-xs">
                        <span className="font-medium text-muted-foreground">To:</span> {mail.email}
                      </div>
                      <div className="text-xs">
                        <span className="font-medium text-muted-foreground">Cc:</span> {mail.email}
                      </div>
                      <div className="text-xs">
                        <span className="font-medium text-muted-foreground">Date:</span>{" "}
                        {format(new Date(mail.date), "PPpp")}
                      </div>
                      <div className="text-xs">
                        <span className="font-medium text-muted-foreground">Mailed-By:</span>{" "}
                        {mail.email}
                      </div>
                      <div className="text-xs">
                        <span className="font-medium text-muted-foreground">Signed-By:</span>{" "}
                        {mail.email}
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <span className="font-medium text-muted-foreground">Security:</span>{" "}
                        <Lock className="h-3 w-3" /> {mail.email}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Mail content */}
          <div className="flex-1 overflow-y-auto px-8 py-4">
            <div className="whitespace-pre-wrap text-sm leading-relaxed">{mail.text}</div>
          </div>

          {/* Reply section */}
          <div className="sticky bottom-0 w-full bg-background px-4 pb-4 pt-2">
            <form className="relative space-y-2.5 rounded-[calc(var(--radius)-2px)] border bg-secondary/50 p-4 shadow-sm">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Reply className="h-4 w-4" />
                  <p className="truncate">
                    {mail?.name} ({mail?.email})
                  </p>
                </div>
              </div>

              <Textarea
                className="min-h-[120px] w-full resize-none border-0 bg-[#18181A] leading-relaxed placeholder:text-muted-foreground/70 focus-visible:ring-0 focus-visible:ring-offset-0 md:text-base"
                placeholder="Write your reply..."
                spellCheck={true}
                autoFocus
              />

              {/* Attachments section */}
              {(attachments.length > 0 || isUploading) && (
                <div className="relative z-50 min-h-[32px]">
                  <div className="hide-scrollbar absolute inset-x-0 flex gap-2 overflow-x-auto">
                    {isUploading && (
                      <Badge
                        variant="secondary"
                        className="inline-flex shrink-0 animate-pulse items-center bg-background/50 px-2 py-1.5 text-xs"
                      >
                        Uploading...
                      </Badge>
                    )}
                    {attachments.map((file, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="inline-flex shrink-0 items-center gap-1 bg-background/50 px-2 py-1.5 text-xs"
                      >
                        <span className="max-w-[120px] truncate">
                          {truncateFileName(file.name)}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="ml-1 h-4 w-4 hover:bg-background/80"
                          onClick={(e) => {
                            e.preventDefault();
                            removeAttachment(index);
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        type="button"
                        className="h-8 w-8 hover:bg-background/80"
                        onClick={(e) => {
                          e.preventDefault();
                          document.getElementById("attachment-input")?.click();
                        }}
                      >
                        <Paperclip className="h-4 w-4" />
                        <span className="sr-only">Add attachment</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Attach file</TooltipContent>
                  </Tooltip>
                  <input
                    type="file"
                    id="attachment-input"
                    className="hidden"
                    onChange={handleAttachment}
                    multiple
                    accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="h-8">
                    Save draft
                  </Button>
                  <Button size="sm" className="h-8">
                    Send <Send className="ml-2 h-3 w-3" />
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center p-8 text-center text-muted-foreground">
          No message selected
        </div>
      )}
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
