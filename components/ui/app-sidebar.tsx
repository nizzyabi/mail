"use client";

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
} from "lucide-react";
import { Gmail, Outlook, Vercel } from "@/components/icons/icons";
import { Button } from "@/components/ui/button";
import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useSidebar } from "@/components/ui/sidebar";
import { AccountSwitcher } from "./account-switcher";
import { MailCompose } from "../mail/mail-compose";
import { SidebarToggle } from "./sidebar-toggle";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";

// This is sample data that matches the screenshot

const data = {
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
      title: "Mail",
      items: [
        {
          title: "Inbox",
          url: "#",
          icon: Inbox,
          isActive: true,
          badge: 128,
        },
        {
          title: "Drafts",
          url: "#",
          icon: FileText,
          badge: 9,
        },
        {
          title: "Sent",
          url: "#",
          icon: SendHorizontal,
        },
        {
          title: "Junk",
          url: "#",
          icon: Trash2,
          badge: 23,
        },
        {
          title: "Trash",
          url: "#",
          icon: Trash2,
        },
        {
          title: "Archive",
          url: "#",
          icon: Archive,
        },
      ],
    },
    {
      title: "Categories",
      items: [
        {
          title: "Social",
          url: "#",
          icon: Users2,
          badge: 972,
        },
        {
          title: "Updates",
          url: "#",
          icon: Bell,
          badge: 342,
        },
        {
          title: "Forums",
          url: "#",
          icon: MessageSquare,
          badge: 128,
        },
        {
          title: "Shopping",
          url: "#",
          icon: ShoppingCart,
          badge: 8,
        },
        {
          title: "Promotions",
          url: "#",
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
          url: "#",
          icon: ChartLine,
        },
        {
          title: "Developers",
          url: "#",
          icon: Code,
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [composeOpen, setComposeOpen] = React.useState(false);
  const { isMobile } = useSidebar();

  return (
    <>
      {isMobile && <SidebarToggle className="fixed left-4 top-4 z-40 md:hidden" />}
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <AccountSwitcher accounts={data.accounts} />
        </SidebarHeader>
        <SidebarContent>
          <Button className="mx-3.5 mt-2 w-fit" onClick={() => setComposeOpen(true)}>
            <Pencil className="size-4" />
            Compose
          </Button>
          <NavMain items={data.navMain} />
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={data.user} />
        </SidebarFooter>
        <SidebarRail />
        <MailCompose open={composeOpen} onClose={() => setComposeOpen(false)} />
      </Sidebar>
    </>
  );
}
