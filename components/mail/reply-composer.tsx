import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Reply, X, FileIcon, Paperclip, Send } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail } from "@/components/mail/data";
import { Badge } from "../ui/badge";
import { useState } from "react";
import Image from "next/image";

export default function ReplyComposer({ currentMail }: { currentMail: Mail | null }) {
  const [isUploading, setIsUploading] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);

  const truncateFileName = (name: string, maxLength = 15) => {
    if (name.length <= maxLength) return name;
    const extIndex = name.lastIndexOf(".");
    if (extIndex !== -1 && name.length - extIndex <= 5) {
      return `${name.slice(0, maxLength - 5)}...${name.slice(extIndex)}`;
    }
    return `${name.slice(0, maxLength)}...`;
  };

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

  return (
    <div className="absolute bottom-0 left-0 right-0 z-10 bg-background px-4 pb-4 pt-2">
      <form className="relative space-y-2.5 rounded-[calc(var(--radius)-2px)] border bg-secondary/50 p-4 shadow-sm">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Reply className="h-4 w-4" />
            <p className="whitespace-break-spaces">
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
  );
}
