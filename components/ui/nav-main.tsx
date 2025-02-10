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
      subItems?: {
        title: string;
        url: string;
        icon?: React.ComponentType<{ className?: string }>;
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

  const isGroupActive = (item: (typeof items)[0]["items"][0]) => {
    if (isUrlActive(item.url)) return true;
    return item.subItems?.some((subItem) => isUrlActive(subItem.url)) || false;
  };

  return (
    <>
      {items.map((group) => (
        <SidebarGroup key={group.title}>
          {group.title && <SidebarGroupLabel>{group.title}</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {group.items.map((item) => (
                <Collapsible key={item.title} defaultOpen={isGroupActive(item)}>
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
                          {item.subItems && (
                            <ChevronDown className="ml-auto size-4 transition-transform duration-200 ease-in-out group-data-[state=closed]/collapsible:rotate-[-90deg]" />
                          )}
                        </SidebarMenuButton>
                      </Link>
                    </CollapsibleTrigger>
                    {item.subItems && (
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.subItems.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton asChild>
                                <Link
                                  href={subItem.url}
                                  className={`flex w-full items-center gap-2 ${
                                    isUrlActive(subItem.url) ? "text-primary" : ""
                                  }`}
                                >
                                  {subItem.icon && <subItem.icon className="size-4" />}
                                  <span className="flex-1">{subItem.title}</span>
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
