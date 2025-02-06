"use client";

import * as React from "react";
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
import { cn } from "@/lib/utils";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { AccountSwitcher } from "./account-switcher";
import { MailCompose } from "../mail/mail-compose";
import { useSidebar } from "@/components/ui/sidebar";
import { SidebarToggle } from "./sidebar-toggle";

interface User {
  name: string;
  email: string;
  avatar: string;
}

interface Account {
  name: string;
  logo: React.ComponentType<{ className?: string }>;
  email: string;
}

interface NavItem {
  title: string;
  url: string;
  icon?: React.ComponentType<{ className?: string }>;
  isActive?: boolean;
  badge?: number;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

interface SidebarData {
  user: User;
  accounts: Account[];
  navMain: NavSection[];
}

const data: SidebarData = {
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
  const sidebarContext = useSidebar();
  const { isMobile } = sidebarContext;
  const collapsed = sidebarContext.state === "collapsed";

  const handleComposeClick = React.useCallback(() => {
    setComposeOpen(true);
  }, []);

  // Memoized compose button component
  const ComposeButton = React.memo(function ComposeButton() {
    return (
      <Button
        className={cn(
          collapsed ? "h-9 w-9 p-0" : "h-9 inline-flex gap-2",
          "items-center justify-center"
        )}
        variant={collapsed ? "default" : "default"}
        onClick={handleComposeClick}
        aria-label="Compose new email"
      >
        <Pencil className="size-4" aria-hidden="true" />
        {!collapsed && <span>Compose</span>}
      </Button>
    );
  });

  return (
    <>
      {isMobile && (
        <SidebarToggle className="fixed left-4 top-4 z-40 md:hidden" />
      )}
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <AccountSwitcher accounts={data.accounts} />
        </SidebarHeader>
        <SidebarContent>
          <div 
            className={cn(
              collapsed ? "px-1.5" : "px-4",
              "relative z-10 mt-2"
            )}
          >
            <ComposeButton />
          </div>
          <NavMain items={data.navMain} />
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={data.user} />
        </SidebarFooter>
        <SidebarRail />
        <MailCompose 
          open={composeOpen} 
          onClose={() => setComposeOpen(false)}
          aria-label="Compose email dialog"
        />
      </Sidebar>
    </>
  );
}
