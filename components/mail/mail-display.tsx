import {
  Archive,
  ArchiveX,
  ArrowUp,
  Clock,
  Forward,
  MoreVertical,
  Reply,
  ReplyAll,
  Trash2,
  BellOff,
  X,
  Lock,
  Paperclip,
} from "lucide-react";
import { nextSaturday } from "date-fns/nextSaturday";
import { addHours } from "date-fns/addHours";
import { useState, useEffect } from "react";
import { addDays } from "date-fns/addDays";
import { format } from "date-fns/format";

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
}

export function MailDisplay({ mail }: MailDisplayProps) {
  const today = new Date();
  // Create local state for the muted flag.
  const [isMuted, setIsMuted] = useState(mail ? mail.muted : false);
  const [attachments, setAttachments] = useState<File[]>([]);

  const [_mail, setMail] = useMail();

  const handleAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments([...attachments, ...Array.from(e.target.files)]);
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

  const handleClose = () => {
    // close the mail if it is selected
    if (mail && mail.id === _mail.selected) {
      setMail({
        selected: null,
      });
    }
  };

  // Update the muted state when the mail prop changes.
  useEffect(() => {
    if (mail) {
      setIsMuted(mail.muted);
    }
  }, [mail]);

  return (
    <div className="flex h-full flex-col pt-[6px]">
      <div className="flex items-center md:mt-0">
        <div className="mx-2 flex items-center gap-2">
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
                <ArchiveX className="h-4 w-4" />
                <span className="sr-only">Move to junk</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Move to junk</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" className="md:h-fit md:px-2" disabled={!mail}>
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Move to trash</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Move to trash</TooltipContent>
          </Tooltip>
          <Separator orientation="vertical" className="mx-1 h-6" />
          <Tooltip>
            <Popover>
              <PopoverTrigger asChild>
                <TooltipTrigger asChild>
                  <Button variant="ghost" className="md:h-fit md:px-2" disabled={!mail}>
                    <Clock className="h-4 w-4" />
                    <span className="sr-only">Snooze</span>
                  </Button>
                </TooltipTrigger>
              </PopoverTrigger>
              <PopoverContent className="flex w-[535px] p-0">
                <div className="flex flex-col gap-2 border-r px-2 py-4">
                  <div className="px-4 text-sm font-medium">Snooze until</div>
                  <div className="grid min-w-[250px] gap-1">
                    <Button variant="ghost" className="justify-start font-normal md:h-fit md:px-2">
                      Later today{" "}
                      <span className="ml-auto text-muted-foreground">
                        {format(addHours(today, 4), "E, h:m b")}
                      </span>
                    </Button>
                    <Button variant="ghost" className="justify-start font-normal md:h-fit md:px-2">
                      Tomorrow
                      <span className="ml-auto text-muted-foreground">
                        {format(addDays(today, 1), "E, h:m b")}
                      </span>
                    </Button>
                    <Button variant="ghost" className="justify-start font-normal md:h-fit md:px-2">
                      This weekend
                      <span className="ml-auto text-muted-foreground">
                        {format(nextSaturday(today), "E, h:m b")}
                      </span>
                    </Button>
                    <Button variant="ghost" className="justify-start font-normal md:h-fit md:px-2">
                      Next week
                      <span className="ml-auto text-muted-foreground">
                        {format(addDays(today, 7), "E, h:m b")}
                      </span>
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <TooltipContent>Snooze</TooltipContent>
          </Tooltip>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" className="md:h-fit md:px-2" disabled={!mail}>
                <Reply className="h-4 w-4" />
                <span className="sr-only">Reply</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Reply</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" className="md:h-fit md:px-2" disabled={!mail}>
                <ReplyAll className="h-4 w-4" />
                <span className="sr-only">Reply all</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Reply all</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" className="md:h-fit md:px-2" disabled={!mail}>
                <Forward className="h-4 w-4" />
                <span className="sr-only">Forward</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Forward</TooltipContent>
          </Tooltip>
        </div>
        <Separator orientation="vertical" className="mx-2 h-6" />
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="md:h-fit md:px-2" disabled={!mail}>
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">More</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Mark as unread</DropdownMenuItem>
              <DropdownMenuItem>Star thread</DropdownMenuItem>
              <DropdownMenuItem>Add label</DropdownMenuItem>
              <DropdownMenuItem>Mute thread</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="ghost"
            className="mr-2 md:h-fit md:px-2"
            disabled={!mail}
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
      </div>
      <Separator className="mt-2" />
      {mail ? (
        <div className="flex flex-1 flex-col">
          <div className="flex items-start p-4">
            <div className="flex items-start gap-4 text-sm">
              <Avatar>
                <AvatarImage alt={mail.name} />
                <AvatarFallback>
                  {mail.name
                    .split(" ")
                    .map((chunk) => chunk[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <div className="font-semibold">
                  {mail.name} <span className="text-muted-foreground">&lt;{mail.email}&gt;</span>
                </div>
                {/* Display the subject with the muted icon if isMuted is true */}
                <div className="line-clamp-1 flex items-center text-xs">
                  {mail.subject}
                  {isMuted && <BellOff className="ml-2 h-4 w-4 text-muted-foreground" />}
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <span className="cursor-pointer text-xs underline">Details</span>
                  </PopoverTrigger>
                  <PopoverContent className="w-[320px] space-y-2" align="start">
                    {/* TODO: Content is currently dummy and uses mail.email for all of them. need to add other values to email type */}
                    <div className="text-xs">
                      <span className="font-medium text-muted-foreground">From:</span> {mail.email}
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
            {mail.date && (
              <div className="ml-auto text-xs text-muted-foreground">
                {format(new Date(mail.date), "PPpp")}
              </div>
            )}
          </div>
          <Separator />
          <div className="flex-1 whitespace-pre-wrap p-4 text-sm">{mail.text}</div>
          {/* Reply Form */}
          <div className="box-border p-4">
            <form className="space-y-1 overflow-x-auto rounded-xl border bg-secondary p-3">
              <div className="grid grid-cols-[auto,1fr] items-center space-x-1 text-sm text-muted-foreground">
                <Reply className="h-4 w-4" />
                <p className="truncate">
                  {mail.name} ({mail.email})
                </p>
              </div>
              <Textarea
                className="min-h-0 resize-none border-none bg-inherit p-0 py-1 focus-visible:ring-0 focus-visible:ring-offset-0 md:text-base"
                placeholder="Message…"
                rows={3}
              ></Textarea>
              {/* Attachment Display */}
              {attachments.length > 0 && (
                <div className="box-border py-4">
                  <div className="flex flex-wrap gap-2">
                    {attachments.map((file, index) => (
                      <Badge key={index} variant="default">
                        {truncateFileName(file.name)}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="-mr-1 ml-2 h-5 w-5 rounded-full p-0"
                          onClick={(e) => {
                            e.preventDefault();
                            removeAttachment(index);
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex justify-between">
                <div className="flex space-x-1.5">
                  <Button size="sm" type="submit" onClick={(e) => e.preventDefault()}>
                    <span>Send</span>
                  </Button>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-9 w-9 hover:bg-primary/10"
                        onClick={(e) => {
                          e.preventDefault();
                          const fileInput = document.getElementById(
                            "attachment-input",
                          ) as HTMLInputElement;
                          if (fileInput) fileInput.click();
                        }}
                      >
                        <Paperclip />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Add an attachment</p>
                    </TooltipContent>
                  </Tooltip>
                  {/* Hidden File Input */}
                  <input
                    id="attachment-input"
                    type="file"
                    className="hidden"
                    multiple
                    onChange={handleAttachment}
                  />
                </div>
                <div className="flex space-x-1"></div>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center text-muted-foreground">No message selected</div>
      )}
    </div>
  );
}
