"use client";

import {
  Inbox,
  FileText,
  SendHorizontal,
  Trash2,
  Archive,
  Users2,
  Bell,
  ArchiveX,
  MessageSquare,
  ShoppingCart,
  Tag,
  Code,
  ChartLine,
} from "lucide-react";
import { Sidebar, SidebarContent, SidebarHeader, SidebarRail } from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import React from "react";

const data = {
  navMain: [
    {
      title: "",
      items: [
        {
          title: "Inbox",
          url: "/mail",
          icon: Inbox,
          badge: 128,
        },
        {
          title: "Drafts",
          url: "/mail/draft",
          icon: FileText,
          badge: 9,
        },
        {
          title: "Sent",
          url: "/mail/sent",
          icon: SendHorizontal,
        },
        {
          title: "Spam",
          url: "/mail/spam",
          icon: ArchiveX,
          badge: 23,
        },
        {
          title: "Trash",
          url: "/mail/trash",
          icon: Trash2,
        },
        {
          title: "Archive",
          url: "/mail/archive",
          icon: Archive,
        },
      ],
    },
    {
      title: "Categories",
      items: [
        {
          title: "Social",
          url: "/mail/inbox?category=social",
          icon: Users2,
          badge: 972,
        },
        {
          title: "Updates",
          url: "/mail/inbox?category=updates",
          icon: Bell,
          badge: 342,
        },
        {
          title: "Forums",
          url: "/mail/inbox?category=forums",
          icon: MessageSquare,
          badge: 128,
        },
        {
          title: "Shopping",
          url: "/mail/inbox?category=shipping",
          icon: ShoppingCart,
          badge: 8,
        },
        {
          title: "Promotions",
          url: "/mail/inbox?category=promotions",
          icon: Tag,
          badge: 21,
        },
      ],
    },
    {
      title: "Advanced",
      items: [
        {
          title: "Analytics",
          url: "/mail/under-construction/analytics",
          icon: ChartLine,
        },
        {
          title: "Developers",
          url: "/mail/under-construction/developers",
          icon: Code,
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <>
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader className="mt-2 flex items-center justify-between gap-2">
          <NavUser />
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={data.navMain} />
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
    </>
  );
}
