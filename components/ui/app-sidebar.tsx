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
import { Gmail, Outlook, Vercel } from "@/components/icons/icons";
import { SidebarData } from "@/types";
import React from "react";

import { Sidebar, SidebarContent, SidebarHeader, SidebarRail } from "@/components/ui/sidebar";
import { useOpenComposeModal } from "@/hooks/use-open-compose-modal";
import { useTranslations } from "next-intl";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";

const data: SidebarData = {
  // TODO: Dynamically render user data based on auth info
  user: {
    name: "nizzy",
    email: "nizabizaher@gmail.com",
    avatar: "/profile.jpg",
  },
  accounts: [
    {
      name: "Gmail",
      logo: Gmail,
      email: "nizabizaher@gmail.com",
    },
    {
      name: "Hotmail",
      logo: Vercel,
      email: "nizabizaher@hotmail.com",
    },
    {
      name: "Outlook",
      logo: Outlook,
      email: "nizabizaher@microsoft.com",
    },
  ],
  navMain: [
    {
      title: "",
      items: [
        {
          title: "Sidebar.Inbox",
          url: "/mail",
          icon: Inbox,
          badge: 128,
        },
        {
          title: "Sidebar.Drafts",
          url: "/draft",
          icon: FileText,
          badge: 9,
        },
        {
          title: "Sidebar.Sent",
          url: "/mail/under-construction/sent",
          icon: SendHorizontal,
        },
        {
          title: "Sidebar.Junk",
          url: "/mail/under-construction/junk",
          icon: ArchiveX,
          badge: 23,
        },
        {
          title: "Sidebar.Trash",
          url: "/mail/under-construction/trash",
          icon: Trash2,
        },
        {
          title: "Sidebar.Archive",
          url: "/mail/under-construction/archive",
          icon: Archive,
        },
      ],
    },
    {
      title: "Sidebar.Categories",
      items: [
        {
          title: "Sidebar.Social",
          url: "/mail/under-construction/social",
          icon: Users2,
          badge: 972,
        },
        {
          title: "Sidebar.Updates",
          url: "/mail/under-construction/updates",
          icon: Bell,
          badge: 342,
        },
        {
          title: "Sidebar.Forums",
          url: "/mail/under-construction/forums",
          icon: MessageSquare,
          badge: 128,
        },
        {
          title: "Sidebar.Shopping",
          url: "/mail/under-construction/shopping",
          icon: ShoppingCart,
          badge: 8,
        },
        {
          title: "Sidebar.Promotions",
          url: "/mail/under-construction/promotions",
          icon: Tag,
          badge: 21,
        },
      ],
    },
    {
      title: "Sidebar.Advanced",
      items: [
        {
          title: "Sidebar.Analytics",
          url: "/mail/under-construction/analytics",
          icon: ChartLine,
        },
        {
          title: "Sidebar.Developers",
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
