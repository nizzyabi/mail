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
  SquarePen,
  Search,
} from "lucide-react";
import { Gmail, Outlook, Vercel } from "@/components/icons/icons";
import React, { Suspense } from "react";
import { SidebarData } from "@/types";

import { Sidebar, SidebarContent, SidebarHeader, SidebarRail } from "@/components/ui/sidebar";
import { useOpenComposeModal } from "@/hooks/use-open-compose-modal";
// import { AccountSwitcher } from "./account-switcher";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { Button } from "./button";

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
          title: "Inbox",
          url: "/mail",
          icon: Inbox,
          badge: 128,
        },
        {
          title: "Drafts",
          url: "/under-construction/draft",
          icon: FileText,
          badge: 9,
        },
        {
          title: "Sent",
          url: "/under-construction/sent",
          icon: SendHorizontal,
        },
        {
          title: "Junk",
          url: "/under-construction/junk",
          icon: ArchiveX,
          badge: 23,
        },
        {
          title: "Trash",
          url: "/under-construction/trash",
          icon: Trash2,
        },
        {
          title: "Archive",
          url: "/under-construction/archive",
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
  return (
    <>
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader className="mt-2 flex items-center justify-between gap-2">
          <div className="flex w-full items-center gap-2">
            <NavUser />
            <div className="flex items-center">
              <Suspense>
                <ComposeButton />
              </Suspense>
              <Button variant="ghost" className="h-fit px-2">
                <Search />
              </Button>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={data.navMain} />
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
    </>
  );
}

function ComposeButton() {
  const { open } = useOpenComposeModal();

  return (
    <Button onClick={open} variant="ghost" className="md:h-fit md:px-2">
      <SquarePen />
    </Button>
  );
}
