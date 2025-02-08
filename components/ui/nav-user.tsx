"use client";

import { ChevronDown } from "lucide-react";
import * as React from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { signOut, useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Image from "next/image";

export function NavUser() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <DropdownMenu>
      <SidebarMenu>
        <SidebarMenuItem>
          {session && (
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton className="w-fit">
                <Image
                  src={session.user.image || "/placeholder.svg"}
                  alt={session.user.name}
                  className="size-6 shrink-0 rounded"
                  width={32}
                  height={32}
                />
                <div className="flex min-w-0 flex-col gap-1 leading-none">
                  <span className="flex items-center gap-1 font-semibold">
                    {session.user.name} <ChevronDown className="size-3 text-muted-foreground" />
                  </span>
                </div>
              </SidebarMenuButton>
            </DropdownMenuTrigger>
          )}
        </SidebarMenuItem>
      </SidebarMenu>
      <DropdownMenuContent
        className="ml-2 w-[--radix-dropdown-menu-trigger-width] min-w-52 font-medium"
        align="end"
        side={"bottom"}
        sideOffset={1}
      >
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="flex items-center justify-between">
            Switch account
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent className="ml-1">
              {session && (
                <DropdownMenuItem>
                  <Image
                    src={session?.user.image || "/placeholder.svg"}
                    alt={session?.user.name}
                    className="size-4 shrink-0 rounded-lg"
                    width={16}
                    height={16}
                  />
                  {session?.user.email}
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem>Add another account</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <button
            onClick={async () => {
              await signOut({
                fetchOptions: {
                  onSuccess: () => {
                    router.push("/");
                  },
                },
              });
            }}
          >
            Log out
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
