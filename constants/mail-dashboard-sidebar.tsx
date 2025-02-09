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
} from "lucide-react";

export const links = [
  { label: "Inbox", href: "/mail", icon: <Inbox /> },
  { label: "Drafts", href: "#", icon: <FileText /> },
  { label: "Sent", href: "#", icon: <SendHorizontal /> },
  { label: "Junk", href: "#", icon: <Trash2 /> },
  { label: "Trash", href: "#", icon: <Trash2 /> },
  { label: "Archive", href: "#", icon: <Archive /> },
];

export const categories = [
  { label: "Social", href: "#", icon: <Users2 /> },
  { label: "Updates", href: "#", icon: <Bell /> },
  { label: "Forums", href: "#", icon: <MessageSquare /> },
  { label: "Shopping", href: "#", icon: <ShoppingCart /> },
  { label: "Promotions", href: "#", icon: <Tag /> },
];

export const advanced = [
  { label: "Analytics", href: "#", icon: <ChartLine /> },
  { label: "Developers", href: "#", icon: <Code /> },
];
