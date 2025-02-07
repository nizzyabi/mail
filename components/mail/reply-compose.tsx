import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUp, Plus, Reply } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReplyComposerProps {
  name: string;
  email: string;
}

export function ReplyComposer({ name, email }: ReplyComposerProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // handle reply submission logic here
  };

  return (
    <div className="box-border p-4">
      <form
        className="space-y-1 overflow-x-auto rounded-xl border bg-secondary p-3"
        onSubmit={handleSubmit}
      >
        <div className="grid grid-cols-[auto,1fr] items-center space-x-1 text-sm text-muted-foreground">
          <Reply className="h-4 w-4" />
          <p className="truncate">
            {name} ({email})
          </p>
        </div>
        <Textarea
          className="min-h-0 resize-none border-none bg-inherit p-0 py-1 focus-visible:ring-0 focus-visible:ring-offset-0 md:text-base"
          placeholder="Message…"
          rows={3}
        />
        <div className="flex justify-between">
          <div className="flex space-x-1.5">
            <Button size="sm" type="submit">
              <span>Send</span>
              <ArrowUp />
            </Button>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="sm" variant="ghost" className="h-9 w-9 hover:bg-primary/10">
                  <Plus />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add an attachment</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="flex space-x-1"></div>
        </div>
      </form>
    </div>
  );
}
