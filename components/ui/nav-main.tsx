"use client";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import * as React from "react";
import Link from "next/link";

interface NavMainProps {
  items: {
    title: string;
    items: {
      title: string;
      url: string;
      icon?: React.ComponentType<{ className?: string }>;
      badge?: number;
      items?: {
        title: string;
        url: string;
        badge?: number;
      }[];
    }[];
  }[];
}

export function NavMain({ items }: NavMainProps) {
  const pathname = usePathname();

  const isUrlActive = (url: string) => {
    //remove trailing slashes
    const cleanPath = pathname?.replace(/\/$/, "") || "";
    const cleanUrl = url.replace(/\/$/, "");
    return cleanPath === cleanUrl;
  };

  return (
    <>
      {items.map((group) => (
        <SidebarGroup key={group.title}>
          {group.title && <SidebarGroupLabel>{group.title}</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {group.items.map((item) => (
                <Collapsible key={item.title}>
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <Link href={item.url}>
                        <SidebarMenuButton
                          isActive={isUrlActive(item.url)}
                          className={isUrlActive(item.url) ? "bg-accent" : ""}
                        >
                          {item.icon && <item.icon className="mr-2 size-4" />}
                          <span className="flex-1">{item.title}</span>
                          {item.badge !== undefined && (
                            <span className="ml-auto mr-2 text-muted-foreground">{item.badge}</span>
                          )}
                          {item.items && (
                            <ChevronDown className="ml-auto size-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                          )}
                        </SidebarMenuButton>
                      </Link>
                    </CollapsibleTrigger>
                    {item.items && (
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton asChild>
                                <Link
                                  href={subItem.url}
                                  className={`flex w-full justify-between ${
                                    isUrlActive(subItem.url) ? "text-primary" : ""
                                  }`}
                                >
                                  <span>{subItem.title}</span>
                                  {subItem.badge !== undefined && (
                                    <span className="text-muted-foreground">{subItem.badge}</span>
                                  )}
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    )}
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  );
}
