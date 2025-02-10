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
  FileIcon,
  ChevronsUpDown,
  Ellipsis,
  Trash2,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns/format";
import { cn } from "@/lib/utils";
import React from "react";

import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Mail } from "@/components/mail/data";
import { useMail } from "./use-mail";
import { Badge } from "../ui/badge";
import Image from "next/image";

interface MailDisplayProps {
  mail: Mail | null;
  onClose?: () => void;
  isMobile?: boolean;
}

export function MailDisplay({ mail, onClose, isMobile }: MailDisplayProps) {
  const [, setMail] = useMail();
  const [currentMail, setCurrentMail] = useState<Mail | null>(mail);
  const [isMuted, setIsMuted] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

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
      return `${name.slice(0, maxLength - 5)}...${name.slice(extIndex)}`;
    }
    return `${name.slice(0, maxLength)}...`;
  };

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

        <div className="flex h-[calc(93vh)] flex-col">
          {/* Mail header */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
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
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0 text-xs underline"
                          >
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

              {/* Mail content */}
              <div className="flex-1 overflow-y-auto px-8 py-4 pb-[20px]">
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {currentMail.text}
                </div>
              </div>
              <Collapsible>
                <CollapsibleTrigger asChild>
                  {currentMail.replies && currentMail.replies?.length > 0 && (
                    <div className="flex cursor-pointer items-center">
                      <Separator className="h-0.5 w-8" />
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="sm" className="rounded-full">
                            <ChevronsUpDown className="h-4 w-4" />
                            <span className="sr-only">Toggle</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Toggle replies</TooltipContent>
                      </Tooltip>
                      <Separator className="h-0.5" />
                    </div>
                  )}
                </CollapsibleTrigger>
                <CollapsibleContent>
                  {currentMail.replies?.map((reply, index) => (
                    <div key={index}>
                      <Collapsible defaultOpen={true}>
                        <CollapsibleTrigger asChild>
                          <div className="cursor-pointer">
                            <div className="flex flex-col gap-4 px-4 py-3">
                              <div className="flex items-start gap-3">
                                <Avatar>
                                  <AvatarImage alt={currentMail.name} />
                                  <AvatarFallback>
                                    {reply.name
                                      .split(" ")
                                      .map((chunk) => chunk[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 space-y-1">
                                  <div className="text-md flex-none font-semibold">
                                    {reply.name}
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span>{reply.email}</span>
                                    {isMuted && <BellOff className="h-4 w-4" />}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <time className="text-xs text-muted-foreground">
                                      {format(new Date(reply.date), "PPp")}
                                    </time>
                                    <Popover>
                                      <PopoverTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-auto p-0 text-xs underline"
                                        >
                                          Details
                                        </Button>
                                      </PopoverTrigger>
                                      <PopoverContent className="w-[280px] space-y-2" align="start">
                                        <div className="text-xs">
                                          <span className="font-medium text-muted-foreground">
                                            From:
                                          </span>{" "}
                                          {reply.email}
                                        </div>
                                        <div className="text-xs">
                                          <span className="font-medium text-muted-foreground">
                                            Reply-To:
                                          </span>{" "}
                                          {reply.email}
                                        </div>
                                        <div className="text-xs">
                                          <span className="font-medium text-muted-foreground">
                                            To:
                                          </span>{" "}
                                          {reply.email}
                                        </div>
                                        <div className="text-xs">
                                          <span className="font-medium text-muted-foreground">
                                            Cc:
                                          </span>{" "}
                                          {reply.email}
                                        </div>
                                        <div className="text-xs">
                                          <span className="font-medium text-muted-foreground">
                                            Date:
                                          </span>{" "}
                                          {format(new Date(reply.date), "PPpp")}
                                        </div>
                                        <div className="text-xs">
                                          <span className="font-medium text-muted-foreground">
                                            Mailed-By:
                                          </span>{" "}
                                          {reply.email}
                                        </div>
                                        <div className="text-xs">
                                          <span className="font-medium text-muted-foreground">
                                            Signed-By:
                                          </span>{" "}
                                          {reply.email}
                                        </div>
                                        <div className="flex items-center gap-1 text-xs">
                                          <span className="font-medium text-muted-foreground">
                                            Security:
                                          </span>{" "}
                                          <Lock className="h-3 w-3" /> {reply.email}
                                        </div>
                                      </PopoverContent>
                                    </Popover>
                                  </div>
                                </div>
                                <Tooltip>
                                  <TooltipTrigger asChild onClick={(e) => e.stopPropagation()}>
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          disabled={!currentMail}
                                          className="md:h-fit md:px-2"
                                        >
                                          <Ellipsis className="h-4 w-4" />
                                          <span className="sr-only">More</span>
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent onClick={(e) => e.stopPropagation()}>
                                        <DropdownMenuItem>
                                          <Reply />
                                          Reply
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                          <Forward />
                                          Forward
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>
                                          <Trash2 />
                                          Delete Mail
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </TooltipTrigger>
                                  <TooltipContent>More</TooltipContent>
                                </Tooltip>
                              </div>
                            </div>
                            <Separator />
                          </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          {/* Mail content */}
                          <div className="flex-1 overflow-y-auto px-8 py-4 pb-[50px]">
                            <div className="whitespace-pre-wrap text-sm leading-relaxed">
                              {reply.text}
                            </div>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>

                      {(currentMail.replies.length - 1 !== index && <Separator />) || (
                        <div className="pb-[70px]" />
                      )}
                    </div>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            </ScrollArea>
          </div>

          <div className="sticky bottom-2 w-full bg-background px-4 py-2">
            <form className="relative space-y-2.5 rounded-[calc(var(--radius)-2px)] border bg-secondary/50 p-4 shadow-sm">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Reply className="h-4 w-4" />
                  <p className="truncate">
                    {currentMail?.name} ({currentMail?.email})
                  </p>
                </div>
              </div>

              <Textarea
                className="min-h-[120px] w-full resize-none border-0 leading-relaxed placeholder:text-muted-foreground/70 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-[#18181A] md:text-base"
                placeholder="Write your reply..."
                spellCheck={true}
                autoFocus
              />

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
                      <Tooltip key={index}>
                        <TooltipTrigger asChild>
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
                        </TooltipTrigger>
                        <TooltipContent className="w-64 p-0">
                          <div className="relative h-32 w-full">
                            {file.type.startsWith("image/") ? (
                              <Image
                                src={URL.createObjectURL(file) || "/placeholder.svg"}
                                alt={file.name}
                                fill
                                className="rounded-t-md object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center p-4">
                                <FileIcon className="h-16 w-16 text-primary" />
                              </div>
                            )}
                          </div>
                          <div className="bg-secondary p-2">
                            <p className="text-sm font-medium">{truncateFileName(file.name, 30)}</p>
                            <p className="text-xs text-muted-foreground">
                              Size: {(file.size / (1024 * 1024)).toFixed(2)} MB
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Last modified: {new Date(file.lastModified).toLocaleDateString()}
                            </p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
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
