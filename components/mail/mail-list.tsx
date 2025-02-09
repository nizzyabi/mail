import { ComponentProps } from "react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useMail } from "@/components/mail/use-mail";
import { Mail } from "@/components/mail/data";
import { Badge } from "@/components/ui/badge";
import { BellOff } from "lucide-react";
import { cn } from "@/lib/utils";

import { formatDate } from "@/utils/format-date";
import { tagsAtom, Tag } from "./use-tags";
import { useAtomValue } from "jotai";

interface MailListProps {
  items: Mail[];
  isCompact: boolean;
  onMailClick: () => void;
}

export function MailList({ items, isCompact, onMailClick }: MailListProps) {
  const [mail, setMail] = useMail();

  const tags = useAtomValue(tagsAtom);
  const activeTags = tags.filter((tag) => tag.checked);

  const handleMailClick = (selectedMail: Mail) => {
    if (mail.selected === selectedMail.id) {
      setMail({
        selected: null,
      });
    } else {
      setMail({
        ...mail,
        selected: selectedMail.id,
      });
    }

    onMailClick();
  };

  return (
    <ScrollArea className="" type="auto">
      <div className="flex flex-col pt-0">
        {items.map((item) => (
          <div
            key={item.id}
            className={cn(
              "flex cursor-pointer flex-col items-start border-b p-4 text-left text-sm transition-all hover:bg-accent",
              mail.selected === item.id && "bg-muted hover:opacity-100",
              isCompact && mail.selected !== item.id ? "gap-0" : "gap-2",
              item.read && mail.selected !== item.id
                ? "opacity-70 hover:opacity-100"
                : "opacity-100",
            )}
            onClick={() => handleMailClick(item)}
          >
            <div className="flex w-full flex-col gap-1">
              <div className="flex items-center">
                <div
                  className={cn(
                    "flex gap-2",
                    isCompact && mail.selected !== item.id ? "items-center" : "flex-col flex-wrap",
                  )}
                >
                  <div className="flex w-32 items-center gap-2 2xl:w-40">
                    <div className={cn(item.read ? "font-normal" : "font-bold")}>{item.name}</div>
                    {item.muted && <BellOff className="h-4 w-4 text-muted-foreground" />}
                    {!item.read && <span className="flex h-2 w-2 rounded-full bg-blue-600" />}
                  </div>

                  <div
                    className={cn(
                      "max-w-32 truncate text-xs md:max-w-full",
                      item.read ? "font-normal" : "font-bold",
                      isCompact && mail.selected !== item.id ? "truncate" : "max-w-full",
                    )}
                  >
                    {item.subject}
                  </div>
                </div>

                <div
                  className={cn(
                    "ml-auto whitespace-nowrap text-right text-xs",
                    mail.selected === item.id ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {formatDate(item.date)}
                </div>
              </div>
            </div>

            <div
              className={cn(
                "line-clamp-2 select-none text-xs text-muted-foreground transition-all",
                isCompact && mail.selected !== item.id ? "h-0" : "h-8",
              )}
            >
              {item.text.substring(0, 300)}
            </div>

            <MailLabels
              labels={item.labels}
              activeTags={activeTags}
              isCompact={isCompact}
              isSelected={mail.selected === item.id}
            />
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

// things were turning into a ?:?:?: fest had to dip out
const MailBadge = ({ label, isActive }: { label: string; isActive?: boolean }) => {
  return <Badge variant={isActive ? "default" : getDefaultBadgeStyle(label)}>{label}</Badge>;
};

function MailLabels({
  labels,
  activeTags,
  isCompact,
  isSelected,
}: {
  labels: string[];
  activeTags: Tag[];
  isCompact: boolean;
  isSelected: boolean;
}) {
  if (!labels.length) return null;

  const activeLabels = labels.filter((label) =>
    activeTags.some((tag) => tag.label.toLowerCase() === label.toLowerCase()),
  );

  return (
    <div
      className={cn("flex select-none items-center gap-2", isCompact && !isSelected && "hidden")}
    >
      {activeTags.length > 0
        ? activeLabels.map((label) => <MailBadge key={label} label={label} isActive />)
        : labels.map((label) => <MailBadge key={label} label={label} />)}
    </div>
  );
}

function getDefaultBadgeStyle(label: string): ComponentProps<typeof Badge>["variant"] {
  switch (label.toLowerCase()) {
    case "work":
      return "default";
    case "personal":
      return "outline";
    default:
      return "secondary";
  }
}
