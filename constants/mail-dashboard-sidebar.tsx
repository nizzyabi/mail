import {
  Inbox,
  FileText,
  SendHorizontal,
  Trash2,
  Archive,
  Users2,
  Bell,
  MessageSquare,
  ShoppingCart,
  Tag,
  Code,
  ChartLine,
  Pencil,
  Trash,
} from "lucide-react";
import { IconArrowLeft, IconBrandTabler, IconSettings, IconUserBolt } from "@tabler/icons-react";
import { Gmail, Outlook, Vercel } from "@/components/icons/icons";

export const links = [
  {
    label: "Inbox",
    href: "/mail",
    icon: <Inbox className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />,
  },
  {
    label: "Drafts",
    href: "#",
    icon: <FileText className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />,
  },
  {
    label: "Settings",
    href: "#",
    icon: (
      <SendHorizontal className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />
    ),
  },
  {
    label: "Junk",
    href: "#",
    icon: <Trash className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />,
  },
  {
    label: "Trash",
    href: "#",
    icon: <Trash2 className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />,
  },
  {
    label: "Archive",
    href: "#",
    icon: <Archive className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />,
  },
];
