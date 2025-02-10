import {
  Archive,
  ArchiveX,
  Forward,
  MoreVertical,
  Paperclip,
  Reply,
  ReplyAll,
  Send,
  FileIcon,
  X,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns/format";
import { cn } from "@/lib/utils";

import { DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useThread } from "@/hooks/use-threads";
import { Badge } from "@/components/ui/badge";
import { useMail } from "./use-mail";
import Image from "next/image";
interface MailDisplayProps {
  mailId: string;
  onClose?: () => void;
  isMobile?: boolean;
}

interface ReplyState {
  content: string;
  attachments: File[];
  isUploading: boolean;
}

export function MailDisplay({ mailId, onClose, isMobile }: MailDisplayProps) {
  const { data: mail, isLoading, error } = useThread(mailId);
  const [, setMail] = useMail();

  const [replyState, setReplyState] = useState<ReplyState>({
    content: "",
    attachments: [],
    isUploading: false,
  });

  // const [currentMail] = useState<Mail | null>();
  // const [isMuted, setIsMuted] = useState(false);
  // const [attachments, setAttachments] = useState<File[]>([]);
  // const [isUploading, setIsUploading] = useState(false);

  // useEffect(() => {
  // find email and parse body and set it
  // setCurrentMail(mail);
  // }, [mail]);

  // useEffect(() => {
  //   if (currentMail) {
  //     setIsMuted(currentMail.muted ?? false);
  //   }
  // }, [currentMail]);

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
      setReplyState((prev) => ({ ...prev, isUploading: true }));
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        setReplyState((prev) => ({
          ...prev,
          attachments: [...prev.attachments, ...Array.from(e.target.files!)],
        }));
      } finally {
        setReplyState((prev) => ({ ...prev, isUploading: false }));
      }
    }
  };

  const removeAttachment = (index: number) => {
    setReplyState((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
  };

  const truncateFileName = (name: string, maxLength = 15) => {
    if (name.length <= maxLength) return name;
    const extIndex = name.lastIndexOf(".");
    if (extIndex !== -1 && name.length - extIndex <= 5) {
      return `${name.slice(0, maxLength - 5)}...${name.slice(extIndex)}`;
    }
    return `${name.slice(0, maxLength)}...`;
  };

  const renderAttachmentPreview = (file: File) => {
    return file.type.startsWith("image/") ? (
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
    );
  };

  const renderAttachmentDetails = (file: File) => {
    return (
      <div className="bg-secondary p-2">
        <p className="text-sm font-medium">{truncateFileName(file.name, 30)}</p>
        <p className="text-xs text-muted-foreground">
          Size: {(file.size / (1024 * 1024)).toFixed(2)} MB
        </p>
        <p className="text-xs text-muted-foreground">
          Last modified: {new Date(file.lastModified).toLocaleDateString()}
        </p>
      </div>
    );
  };

  const renderAttachmentBadge = (file: File, index: number) => {
    return (
      <Tooltip key={index}>
        <TooltipTrigger asChild>
          <Badge
            variant="secondary"
            className="mb-1 inline-flex shrink-0 items-center gap-1 bg-background/50 px-2 py-1.5 text-xs"
          >
            <span className="max-w-[120px] truncate">{truncateFileName(file.name)}</span>
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
          <div className="relative h-32 w-full">{renderAttachmentPreview(file)}</div>
          {renderAttachmentDetails(file)}
        </TooltipContent>
      </Tooltip>
    );
  };

  if (isLoading) {
    return <div className="flex h-full items-center justify-center">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center text-destructive">
        Failed to load message
      </div>
    );
  }

  if (!mail) {
    return <div className="flex h-full items-center justify-center">No message selected</div>;
  }

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
                    disabled={!mail}
                    onClick={handleClose}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Close</TooltipContent>
              </Tooltip>
            )}
            <div className="flex-1 truncate text-sm font-medium">{mail?.subject}</div>
          </div>
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" className="md:h-fit md:px-2" disabled={!mail}>
                  <Archive className="h-4 w-4" />
                  <span className="sr-only">Archive</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Archive</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" className="md:h-fit md:px-2" disabled={!mail}>
                  <Reply className="h-4 w-4" />
                  <span className="sr-only">Reply</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Reply</TooltipContent>
            </Tooltip>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="md:h-fit md:px-2" disabled={!mail}>
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">More</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <ArchiveX className="mr-2 h-4 w-4" /> Move to spam
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
                  <AvatarFallback>
                    {mail.sender.name
                      .split(" ")
                      .map((chunk) => chunk[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="font-semibold">{mail.sender.name}</div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span>{mail.sender.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <time className="text-xs text-muted-foreground">
                      {format(new Date(mail.receivedOn), "PPp")}
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
                          {mail.sender.email}
                        </div>
                        <div className="text-xs">
                          <span className="font-medium text-muted-foreground">Date:</span>{" "}
                          {format(new Date(mail.receivedOn), "PPpp")}
                        </div>
                        {mail.tags && mail.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {mail.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="px-8 py-4 pb-[200px]">
              <div
                className="prose prose-sm dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: mail.body }}
              />
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 z-10 bg-background px-4 pb-4 pt-2">
            <form className="relative space-y-2.5 rounded-[calc(var(--radius)-2px)] border bg-secondary/50 p-4 shadow-sm">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Reply className="h-4 w-4" />
                  <p className="truncate">
                    {mail.sender.name}({mail.sender.email})
                  </p>
                </div>
              </div>

              <Textarea
                className="min-h-[120px] w-full resize-none border-0 leading-relaxed placeholder:text-muted-foreground/70 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-[#18181A] md:text-base"
                placeholder="Write your reply..."
                spellCheck={true}
                autoFocus
              />

              {(replyState.attachments.length > 0 || replyState.isUploading) && (
                <div className="relative z-50 min-h-[32px]">
                  <div className="hide-scrollbar absolute inset-x-0 -my-3 flex gap-2 overflow-x-auto">
                    {replyState.isUploading && (
                      <Badge
                        variant="secondary"
                        className="inline-flex shrink-0 animate-pulse items-center bg-background/50 px-2 py-1.5 text-xs"
                      >
                        Uploading...
                      </Badge>
                    )}
                    {replyState.attachments.map((file, index) =>
                      renderAttachmentBadge(file, index),
                    )}
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
