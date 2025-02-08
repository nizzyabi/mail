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
import { signIn, signOut, useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "./button";
import Image from "next/image";

export function NavUser() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <DropdownMenu>
      <SidebarMenu>
        <SidebarMenuItem>
          {session ? (
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
                    <span className="max-w-12 truncate">{session.user.name}</span>{" "}
                    <ChevronDown className="size-3 text-muted-foreground" />
                  </span>
                </div>
              </SidebarMenuButton>
            </DropdownMenuTrigger>
          ) : (
            <Button
              variant="default"
              className="w-full gap-2"
              onClick={async () => {
                await signIn.social({
                  provider: "google",
                });
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M11.99 13.9v-3.72h9.36c.14.63.25 1.22.25 2.05c0 5.71-3.83 9.77-9.6 9.77c-5.52 0-10-4.48-10-10S6.48 2 12 2c2.7 0 4.96.99 6.69 2.61l-2.84 2.76c-.72-.68-1.98-1.48-3.85-1.48c-3.31 0-6.01 2.75-6.01 6.12s2.7 6.12 6.01 6.12c3.83 0 5.24-2.65 5.5-4.22h-5.51z"
                ></path>
              </svg>
            </Button>
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
        <DropdownMenuItem
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
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
