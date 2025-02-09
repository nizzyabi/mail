"use client";

import {
  ChevronDown,
  ChevronRight,
  Cog,
  LogIn,
  LogOut,
  MonitorCog,
  Moon,
  Sun,
  UserCog,
  UserPlus,
} from "lucide-react";

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
import { Tabs, TabsList, TabsTrigger } from "./tabs";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import Image from "next/image";
import { toast } from "sonner";

export function NavUser() {
  const { data: session } = useSession();
  const router = useRouter();
  const { setTheme, theme } = useTheme();

  return (
    <DropdownMenu>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton className="w-fit">
              <Image
                src={session?.user.image || "/logo.png"}
                alt={session?.user.name || "Example"}
                className="shrink-0 rounded-md" // increased size and made it round
                width={20}
                height={20}
              />
              <div className="flex min-w-0 flex-col gap-1 leading-none">
                <span className="flex items-center gap-1 font-semibold">
                  {session?.user.name || "Guest"}{" "}
                  <ChevronDown className="size-3 text-muted-foreground" />
                </span>
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
        </SidebarMenuItem>
      </SidebarMenu>
      <DropdownMenuContent
        className="ml-2 w-[--radix-dropdown-menu-trigger-width] min-w-52 font-medium"
        align="end"
        side={"bottom"}
        sideOffset={1}
      >
        {session ? (
          <>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <UserCog size={16} strokeWidth={2} className="opacity-60" aria-hidden="true" />
                  Switch account
                </div>
                <ChevronRight size={8} strokeWidth={2} className="opacity-60" aria-hidden="true" />
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="ml-1">
                  <DropdownMenuItem>
                    <Image
                      src={session.user.image || "/placeholder.svg"}
                      alt={session.user.name}
                      className="size-4 shrink-0 rounded-lg"
                      width={16}
                      height={16}
                    />
                    {session.user.email}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <UserPlus size={16} strokeWidth={2} className="opacity-60" aria-hidden="true" />
                    Add another account
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuItem>
              <Cog size={16} strokeWidth={2} className="opacity-60" aria-hidden="true" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={async () => {
                toast.promise(
                  signOut({
                    fetchOptions: {
                      onSuccess: () => {
                        router.push("/");
                      },
                    },
                  }),
                  {
                    loading: "Signing out...",
                    success: () => "Signed out successfully!",
                    error: "Error signing out",
                  },
                );
              }}
            >
              <LogOut size={16} strokeWidth={2} className="opacity-60" aria-hidden="true" />
              Log out
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/signin")}>
              <LogIn size={16} strokeWidth={2} className="opacity-60" aria-hidden="true" />
              Sign in
            </DropdownMenuItem>
          </>
        )}
        <span className="mt-2 block w-full">
          <Tabs defaultValue={theme} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="dark" onClick={() => setTheme("dark")}>
                <Moon size={16} strokeWidth={2} className="opacity-60" aria-hidden="true" />
              </TabsTrigger>
              <TabsTrigger value="light" onClick={() => setTheme("light")}>
                <Sun size={16} strokeWidth={2} className="opacity-60" aria-hidden="true" />
              </TabsTrigger>
              <TabsTrigger value="system" onClick={() => setTheme("system")}>
                <MonitorCog size={16} strokeWidth={2} className="opacity-60" aria-hidden="true" />
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </span>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
