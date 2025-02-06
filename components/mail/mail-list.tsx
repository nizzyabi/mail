import { ComponentProps } from "react"
import { formatDistanceToNow } from "date-fns/formatDistanceToNow"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Mail } from "@/components/mail/data"
import { useMail } from "@/components/mail/use-mail"
import { BellOff } from "lucide-react"


interface MailListProps {
  items: Mail[],
  isCompact: boolean,
}


export function MailList({ items, isCompact }: MailListProps) {
  const [mail, setMail] = useMail()

  return (
    <ScrollArea className="h-[calc(100vh-140px)] mt-4" type="auto">
      <div className="flex flex-col gap-2 p-4 pt-0">
        {items.map((item) => (
          <div
            key={item.id}
            className={cn(
              "flex flex-col items-start rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent cursor-pointer",
              mail.selected === item.id && "bg-muted hover:opacity-100",
              isCompact && mail.selected !== item.id && item.read ? 'gap-0' : 'gap-2',
              item.read && mail.selected !== item.id ? ' opacity-70 hover:opacity-100' : 'opacity-100'
            )}
            onClick={() =>
              setMail({
                ...mail,
                selected: item.id,
              })
            }
          >
            <div className="flex w-full flex-col gap-1">

              <div className="flex items-center">

                <div className={cn(
                  "flex gap-2",
                  isCompact && mail.selected !== item.id ? "items-center" : "flex-wrap"
                )}>
                  <div className="flex items-center gap-2 w-40">
                    <div className={cn(item.read ? 'font-normal' : 'font-bold')}>{item.name}</div>
                    {item.muted && (
                      <BellOff className="h-4 w-4 text-muted-foreground" />
                    )}
                    {!item.read && (
                      <span className="flex h-2 w-2 rounded-full bg-blue-600" />
                    )}
                  </div>

                  <div className={cn(
                    'text-xs',
                    item.read ? 'font-normal' : 'font-bold',
                    isCompact && mail.selected !== item.id ? 'truncate' : 'w-full'
                  )}>
                    {item.subject}
                  </div>
                </div>


                <div
                  className={cn(
                    "ml-auto text-xs",
                    mail.selected === item.id
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {formatDistanceToNow(new Date(item.date), {
                    addSuffix: true,
                  })}
                </div>

              </div>

            </div>

            <div className={cn("line-clamp-2 text-xs text-muted-foreground transition-all select-none", isCompact && mail.selected !== item.id ? 'h-0' : ' h-8')}>
              {item.text.substring(0, 300)}
            </div>

            {item.labels.length ? (
              <div className={cn("flex items-center gap-2 select-none", isCompact && mail.selected !== item.id ? 'hidden' : 'flex')}>
                {item.labels.map((label) => (
                  <Badge key={label} variant={getBadgeVariantFromLabel(label)}>
                    {label}
                  </Badge>
                ))}
              </div>
            ) : null}



          </div>


        ))}
      </div>
    </ScrollArea>
  )
}

function getBadgeVariantFromLabel(
  label: string
): ComponentProps<typeof Badge>["variant"] {
  if (["work"].includes(label.toLowerCase())) {
    return "default"
  }

  if (["personal"].includes(label.toLowerCase())) {
    return "outline"
  }

  return "secondary"
}
