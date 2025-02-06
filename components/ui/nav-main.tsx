"use client";

import { ChevronDown } from "lucide-react";
import * as React from "react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface NavMainProps {
  items: {
    title: string;
    items: {
      title: string;
      url: string;
      icon?: React.ComponentType<{ className?: string }>;
      isActive?: boolean;
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
  return (
    <>
      {items.map((group) => (
        <SidebarGroup key={group.title}>
          <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {group.items.map((item) => (
                <Collapsible key={item.title}>
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton isActive={item.isActive}>
                        {item.icon && <item.icon className="mr-2 size-4" />}
                        <span className="flex-1">{item.title}</span>
                        {item.badge !== undefined && (
                          <span className="ml-auto mr-2 text-muted-foreground">{item.badge}</span>
                        )}
                        {item.items && (
                          <ChevronDown className="ml-auto size-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                        )}
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    {item.items && (
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton asChild>
                                <a href={subItem.url} className="flex w-full justify-between">
                                  <span>{subItem.title}</span>
                                  {subItem.badge !== undefined && (
                                    <span className="text-muted-foreground">{subItem.badge}</span>
                                  )}
                                </a>
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
