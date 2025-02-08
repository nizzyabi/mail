"use client";
import { links } from "@/constants/mail-dashboard-sidebar";
import { SidebarLink } from "./sidebar-links";
import { SidebarBody } from "./sidebar-body";
import { Sidebar } from "./better-sidebar";
import profile from "@/public/profile.jpg";
import MailDashboard from "./dashboard";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Logo } from "./logo";

export function SidebarDemo() {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={cn(
        "mx-auto flex h-full w-full flex-1 flex-col overflow-hidden rounded-md bg-gray-100 dark:bg-[#09090B] md:flex-row",
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
            <Logo />
            <div className="mt-8 flex flex-col gap-2">
              {open && <span className="text-[#B2B2B4]">Mail</span>}

              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
            <div className="mt-8 flex flex-col gap-2">
              {open && <span className="text-[#B2B2B4]">Categories</span>}

              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
            <div className="mt-8 flex flex-col gap-2">
              {open && <span className="text-[#B2B2B4]">Advanced</span>}

              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: "Praash",
                href: "/",
                icon: (
                  <Image
                    src={profile}
                    className="h-7 w-7 flex-shrink-0 rounded-full"
                    width={50}
                    height={50}
                    alt="Avatar"
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <MailDashboard />
    </div>
  );
}
