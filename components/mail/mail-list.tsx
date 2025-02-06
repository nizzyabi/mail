import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { ComponentProps } from "react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useMail } from "@/components/mail/use-mail";
import { Mail } from "@/components/mail/data";
import { Badge } from "@/components/ui/badge";
import { BellOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface MailListProps {
  items: Mail[];
  onMailClick: () => void;
}

export function MailList({ items, onMailClick }: MailListProps) {
  const [mail, setMail] = useMail();

  const handleMailClick = (mail: Mail) => {
    setMail({
      ...mail,
      selected: mail.id,
    });
    onMailClick();
  };

  return (
    <ScrollArea className="h-[calc(100vh-8rem-1px)]" type="auto">
      <div className="flex flex-col gap-2 p-4 pt-0">
        {items.map((item) => (
          <button
            key={item.id}
            className={cn(
              "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
              mail.selected === item.id && "bg-muted",
            )}
            onClick={() => handleMailClick(item)}
          >
            <div className="flex w-full flex-col gap-1">
              <div className="flex items-center">
                <div className="flex items-center gap-2">
                  <div className="font-semibold">{item.name}</div>
                  {/* Step 2: Conditionally render the mute icon if item.muted is true */}
                  {item.muted && <BellOff className="ml-2 h-4 w-4 text-muted-foreground" />}
                  {!item.read && <span className="flex h-2 w-2 rounded-full bg-blue-600" />}
                </div>
                <div
                  className={cn(
                    "ml-auto text-xs",
                    mail.selected === item.id ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {formatDistanceToNow(new Date(item.date), {
                    addSuffix: true,
                  })}
                </div>
              </div>
              <div className="text-xs font-medium">{item.subject}</div>
            </div>
            <div className="line-clamp-2 text-xs text-muted-foreground">
              {item.text.substring(0, 300)}
            </div>
            {item.labels.length ? (
              <div className="flex items-center gap-2">
                {item.labels.map((label) => (
                  <Badge key={label} variant={getBadgeVariantFromLabel(label)}>
                    {label}
                  </Badge>
                ))}
              </div>
            ) : null}
          </button>
        ))}
      </div>
    </ScrollArea>
  );
}

function getBadgeVariantFromLabel(label: string): ComponentProps<typeof Badge>["variant"] {
  if (["work"].includes(label.toLowerCase())) {
    return "default";
  }

  if (["personal"].includes(label.toLowerCase())) {
    return "outline";
  }

  return "secondary";
}
