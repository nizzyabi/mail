//app-sidebar.tsx

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
  Pen,
  X,
} from "lucide-react";
import { Gmail, Outlook, Vercel } from "@/components/icons/icons";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { TeamSwitcher } from "./team-switcher";
import { Button } from "./button";
import MessageForm from "../mail/compose-mail";
// This is sample data that matches the screenshot

const data = {
  user: {
    name: "nizzy",
    email: "nizabizaher@gmail.com",
    avatar: "/profile.jpg",
  },
  teams: [
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

// export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
//   const [isFormVisible, setIsFormVisible] = React.useState(false);

//   const handleComposeClick = () => {
//     setIsFormVisible(!isFormVisible); // Toggle form visibility
//   };
//   return (
//     <Sidebar collapsible="icon" {...props}>
//       <SidebarHeader className="flex flex-col gap-6">
//         <TeamSwitcher teams={data.teams} />
//         <Button
//           onClick={handleComposeClick}
//           className="flex flex-row items-center bg-blue-100 hover:bg-blue-200 gap-3 transition-all duration-200 ease-in-out transform hover:scale-105 text-[14px]"
//         >
//           <Pen /> <span>Compose</span>
//         </Button>

//         {/* Conditionally render the MessageForm */}
//         {isFormVisible && (
//           <div className="mt-4">
//             <MessageForm />
//           </div>
//         )}
//       </SidebarHeader>

//       <SidebarContent>
//         <NavMain items={data.navMain} />
//       </SidebarContent>
//       <SidebarFooter>
//         <NavUser user={data.user} />
//       </SidebarFooter>
//       <SidebarRail />
//     </Sidebar>
//   );
// }

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [isFormVisible, setIsFormVisible] = React.useState(false);

  const handleComposeClick = () => {
    setIsFormVisible(true);
  };

  const handleCloseForm = () => {
    setIsFormVisible(false);
  };

  return (
    <>
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader className="flex flex-col gap-6">
          <TeamSwitcher teams={data.teams} />
          <Button
            onClick={handleComposeClick}
            className="flex flex-row items-center bg-blue-100 hover:bg-blue-200 gap-3 transition-all duration-200 ease-in-out transform hover:scale-105 text-[14px]"
          >
            <Pen /> <span>Compose</span>
          </Button>
        </SidebarHeader>

        <SidebarContent>
          <NavMain items={data.navMain} />
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={data.user} />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      {/* Modal Overlay */}
      {isFormVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={handleCloseForm}
          />

          {/* Modal Content */}
          <div className="relative z-50 w-full max-w-lg mx-4 justify-between">
            <div className=" rounded-lg shadow-lg">
              {/* Close button */}
              <Button
                onClick={handleCloseForm}
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2"
              >
                <X className="h-4 w-4" />
              </Button>

              <MessageForm />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
