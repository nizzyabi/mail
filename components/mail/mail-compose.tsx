/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  X,
  Paperclip,
  Image as ImageIcon,
  Link2,
  Bold,
  Italic,
  List,
  ListOrdered,
} from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface MailComposeProps {
  onClose: () => void;
  replyTo?: {
    email: string;
    subject: string;
  };
}

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useOpenComposeModal } from "@/hooks/use-open-compose-modal";
import { compressText, decompressText } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { useQueryState } from "nuqs";
import { Badge } from "../ui/badge";

export function MailCompose({ replyTo, onClose }: MailComposeProps) {
  const [attachments, setAttachments] = useState<File[]>([]);
  const [messageContent, setMessageContent] = useQueryState("body", {
    defaultValue: undefined,
    parse: (value) => decompressText(value),
    serialize: (value) => compressText(value!),
  });
  const [toInput, setToInput] = useState(replyTo?.email || "");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [subject, setSubject] = useQueryState("subject", {
    defaultValue: undefined,
    parse: (value) => decompressText(value),
    serialize: (value) => compressText(value!),
  });
  const { isOpen } = useOpenComposeModal();
  console.log({ isOpen });

  const editorRef = useRef<HTMLTextAreaElement>(null);

  const pastEmails = [
    "alice@example.com",
    "bob@example.com",
    "carol@example.com",
    "david@example.com",
    "eve@example.com",
  ];

  const filteredSuggestions = toInput
    ? pastEmails.filter((email) => email.toLowerCase().includes(toInput.toLowerCase()))
    : [];

  const handleAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments([...attachments, ...Array.from(e.target.files)]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const insertFormat = (format: string) => {
    if (!editorRef.current) return;
    document.execCommand("styleWithCSS", false, "true");

    switch (format) {
      case "bold":
        document.execCommand("bold", false);
        break;
      case "italic":
        document.execCommand("italic", false);
        break;
      case "list":
        document.execCommand("insertUnorderedList", false);
        break;
      case "ordered-list":
        document.execCommand("insertOrderedList", false);
        break;
      case "link":
        const url = prompt("Enter URL:");
        if (url) document.execCommand("createLink", false, url);
        break;
    }
    editorRef.current.focus();
  };

  useEffect(() => {
    if (!isOpen) {
      setSubject(null);
      setMessageContent(null);
    }
  }, [isOpen, setMessageContent, setSubject]);

  return (
    <Card className="h-full w-full border-none shadow-none">
      <CardHeader>
        <CardTitle className="text-xl font-bold">New Message</CardTitle>
      </CardHeader>
      <CardContent className="overflow-y-hidden">
        <div className="grid gap-2">
          <div className="relative">
            <Input
              placeholder="To"
              value={toInput}
              onChange={(e) => {
                setToInput(e.target.value);
                setShowSuggestions(true);
              }}
              className="rounded-none border-0 focus-visible:ring-0"
            />
            {showSuggestions && filteredSuggestions.length > 0 && (
              <ul className="absolute left-0 right-0 top-full z-10 mt-1 max-h-40 overflow-auto rounded-md border border-input bg-background shadow-lg">
                {filteredSuggestions.map((email, index) => (
                  <li
                    key={index}
                    onClick={() => {
                      setToInput(email);
                      setShowSuggestions(false);
                    }}
                    className="cursor-pointer p-2 hover:bg-muted"
                  >
                    {email}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <Separator className="mx-auto w-[95%]" />
          <Input
            placeholder="Subject"
            defaultValue={subject || ""}
            onChange={(e) => setSubject(e.target.value)}
            className="rounded-none border-0 focus-visible:ring-0"
          />
        </div>
        <Separator className="mx-auto w-[95%]" />

        <div className="flex justify-end p-2">
          <Button variant="ghost" size="icon" onClick={() => insertFormat("bold")}>
            <Bold className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => insertFormat("italic")}>
            <Italic className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => insertFormat("list")}>
            <List className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => insertFormat("ordered-list")}>
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => insertFormat("link")}>
            <Link2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              const input = document.createElement("input");
              input.type = "file";
              input.accept = "image/*";
              input.onchange = (e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = () => {
                    insertFormat(`![${file.name}](${reader.result})`);
                  };
                  reader.readAsDataURL(file);
                }
              };
              input.click();
            }}
          >
            <ImageIcon className="h-4 w-4" />
          </Button>
        </div>

        <textarea
          ref={editorRef}
          className="mx-auto min-h-[300px] w-[95%] resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          onChange={(event) => setMessageContent(event.target.value)}
          value={messageContent || ""}
          aria-multiline="true"
        />

        {attachments.length > 0 && (
          <div className="mx-auto mt-2 flex w-[95%] flex-wrap gap-2">
            {attachments.map((file, index) => (
              <Badge key={index} variant="secondary">
                {file.name}
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
        )}
        <div className="mx-auto mt-4 flex w-[95%] items-center justify-between">
          <label className="cursor-pointer">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                const fileInput = e.currentTarget.nextElementSibling as HTMLInputElement;
                fileInput?.click();
              }}
            >
              <Paperclip className="mr-2 h-4 w-4" />
              Attach files
            </Button>
            <Input type="file" className="hidden" multiple onChange={handleAttachment} />
          </label>

          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Save as draft
            </Button>
            <Button
              onClick={() => {
                // TODO: Implement send functionality
                onClose();
              }}
            >
              Send
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
