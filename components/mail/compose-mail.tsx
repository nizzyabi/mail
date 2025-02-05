// compose-mail.tsx
import React, { useState } from "react";
import dynamic from "next/dynamic";
import {
  Cross,
  Expand,
  Image as ImageIcon,
  Link as LinkIcon,
  Minus,
  Trash,
} from "lucide-react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

const EmojiPicker = dynamic(() => import("emoji-picker-react"), {
  ssr: false,
});

export default function ComposeMail() {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [showLinkForm, setShowLinkForm] = useState(false);
  const [linkText, setLinkText] = useState("");
  const [linkUrl, setLinkUrl] = useState("");

  const handleEmojiClick = (emojiObject: { emoji: string }) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
  };

  const handleDelete = () => {
    setMessage("");
  };

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleLinkApply = () => {
    if (linkText && linkUrl) {
      const link = `<a href="${linkUrl}" target="_blank">${linkText}</a>`;
      setMessage((prevMessage) => prevMessage + link);
      setShowLinkForm(false);
      setLinkText("");
      setLinkUrl("");
    }
  };

  return (
    <div
      className={`flex flex-col gap-4 bg-[#000000] rounded-lg p-10 ${
        isExpanded ? "w-[1100px] h-full -ml-52" : ""
      }`}
    >
      <div className="flex flex-row justify-between text-white">
        <div>New Message</div>
        <div className="flex flex-row gap-4">
          <Minus className="cursor-pointer hover:text-gray-600" />
          <Expand
            className="cursor-pointer hover:text-gray-600"
            onClick={handleExpand}
          />
          <Cross className="cursor-pointer hover:text-gray-600" />
        </div>
      </div>
      <div className="border-b-2 p-2">
        <input
          type="text"
          placeholder="Recipients"
          className="w-full bg-transparent outline-none"
        />
      </div>
      <div className="border-b p-2">
        <input
          type="text"
          placeholder="Subject"
          className="w-full bg-transparent outline-none"
        />
      </div>
      <div>
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="min-h-[200px]"
        />
      </div>
      <div className="flex flex-row gap-2 items-center p-2 justify-between ">
        <Button className="bg-blue-600 text-white hover:bg-blue-700">
          Send
        </Button>
        <button className="underline border-b-4 px-2">A</button>
        <LinkIcon
          className="cursor-pointer hover:text-blue-600"
          onClick={() => setShowLinkForm(!showLinkForm)}
        />
        <div className="relative">
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2 hover:bg-gray-800 rounded"
          >
            😊
          </button>
          {showEmojiPicker && (
            <div className="absolute bottom-full">
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            </div>
          )}
        </div>
        <label
          htmlFor="image-upload"
          className="cursor-pointer hover:text-blue-600"
        >
          <ImageIcon />
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
        <div>
          <Trash
            className="cursor-pointer hover:text-red-600"
            onClick={handleDelete}
          />
        </div>
      </div>
      {showLinkForm && (
        <div className="flex flex-col gap-2 p-2">
          <input
            type="text"
            placeholder="Link Text"
            value={linkText}
            onChange={(e) => setLinkText(e.target.value)}
            className="w-full bg-transparent outline-none border p-2"
          />
          <input
            type="url"
            placeholder="Link URL"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            className="w-full bg-transparent outline-none border p-2"
          />
          <Button
            onClick={handleLinkApply}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            Apply Link
          </Button>
        </div>
      )}
      {file && (
        <div className="flex flex-row gap-2 items-center p-2">
          <span>{file.name}</span>
          <Button
            onClick={() => setFile(null)}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            Remove
          </Button>
        </div>
      )}
    </div>
  );
}
