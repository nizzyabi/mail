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
import { $fetch } from "@/lib/auth-client";
import { BASE_URL } from "@/lib/constants";
import React, { useMemo } from "react";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import useSWR from "swr";

const fetchStats = async (args: any[]) => {
  return await $fetch("/api/v1/mail/count?", { baseURL: BASE_URL }).then((e) => e.data as number[]);
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: stats } = useSWR<number[]>("/api/v1/mail/count", fetchStats);
  const navItems = useMemo(
    () => [
      {
        title: "",
        items: [
          {
            title: "Inbox",
            url: "/mail",
            icon: Inbox,
            badge: stats?.[0] ?? 0,
          },
          {
            title: "Drafts",
            url: "/mail/draft",
            icon: FileText,
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
            badge: stats?.[1] ?? 0,
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
    [stats],
  );
  return (
    <>
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader className="mt-2 flex items-center justify-between gap-2">
          <NavUser />
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={navItems} />
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
    </>
  );
}
