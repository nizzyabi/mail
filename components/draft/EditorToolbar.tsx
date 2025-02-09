"use client";

import { Bold, Italic, Underline } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EditorToolbarProps {
  onCommand: (command: string, value?: string) => void;
  activeCommands: { bold: boolean; italic: boolean; underline: boolean };
}

export const EditorToolbar = ({ onCommand, activeCommands }: EditorToolbarProps) => {
  return (
    <div className="mb-2 flex w-40 items-center justify-center gap-3 rounded-md border bg-background p-1">
      <Button
        variant={activeCommands.bold ? "secondary" : "ghost"}
        size="sm"
        onClick={() => onCommand("bold")}
        className="h-8 w-8 p-0"
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        variant={activeCommands.italic ? "secondary" : "ghost"}
        size="sm"
        onClick={() => onCommand("italic")}
        className="h-8 w-8 p-0"
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        variant={activeCommands.underline ? "secondary" : "ghost"}
        size="sm"
        onClick={() => onCommand("underline")}
        className="h-8 w-8 p-0"
      >
        <Underline className="h-4 w-4" />
      </Button>
    </div>
  );
};
