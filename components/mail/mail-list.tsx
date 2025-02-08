import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { useMail } from "@/components/mail/use-mail";
import { useThread } from "@/hooks/use-threads";
import { ComponentProps, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "../ui/skeleton";
import { InitialThread } from "@/types";
import { cn } from "@/lib/utils";

interface MailListProps {
  items: InitialThread[];
  isCompact: boolean;
  onMailClick: () => void;
}

const Thread = ({ id }: { id: string }) => {
  const [mail, setMail] = useMail();
  const { data } = useThread(id);

  const isMailSelected = useMemo(
    () => (data ? data.id === mail.selected : false),
    [data, mail.selected],
  );

  const handleMailClick = () => {
    if (!data) return;
    if (isMailSelected) {
      setMail({
        selected: null,
      });
    } else {
      setMail({
        ...mail,
        selected: data.id,
      });
    }
  };
  return data ? (
    <div
      onClick={handleMailClick}
      key={data.id}
      className={cn(
        "group cursor-pointer items-start border-b p-4 text-left text-sm transition-all hover:bg-accent",
        data.unread && "font-bold",
        isMailSelected ? "bg-accent" : "",
      )}
    >
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          <Avatar>
            <AvatarFallback className="border bg-card">
              <p>{data.sender.name[0]}</p>
            </AvatarFallback>
          </Avatar>
          <div>
            <p>{data.sender.name}</p>
            <p className="text-sm text-muted-foreground">{data.sender.email}</p>
          </div>
        </div>
        <p className="max-w-[95%] truncate">{data.title}</p>
      </div>
      <MailLabels labels={data.tags} />
    </div>
  ) : (
    <Skeleton />
  );
};

export function MailList({ items }: MailListProps) {
  // TODO: add logic for tags filtering & search
  return (
    <ScrollArea className="" type="auto">
      <div className="flex flex-col pt-0">
        {items.map((item) => (
          <Thread key={item.id} id={item.id} />
        ))}
      </div>
    </ScrollArea>
  );
}
function MailLabels({ labels }: { labels: string[] }) {
  if (!labels.length) return null;

  return (
    <div className={cn("mt-2 flex select-none items-center gap-2")}>
      {labels.map((label) => (
        <Badge key={label} className="hover:bg-card" variant={getDefaultBadgeStyle(label)}>
          {label}
        </Badge>
      ))}
    </div>
  );
}

function getDefaultBadgeStyle(label: string): ComponentProps<typeof Badge>["variant"] {
  return "outline";

  // TODO: styling for each tag type
  switch (true) {
    case label.toLowerCase() === "work":
      return "default";
    case label.toLowerCase().startsWith("category_"):
      return "outline";
    default:
      return "secondary";
  }
}
