"use client";

import { Github, Book, Users, Terminal, Code2, Webhook, LucideIcon } from "lucide-react";
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { SidebarToggle } from "@/components/ui/sidebar-toggle";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface DeveloperResource {
  title: string;
  description: string;
  details: string;
  icon: LucideIcon;
  href: string;
  linkText: string;
}

const developerResources: DeveloperResource[] = [
  {
    title: "API Documentation",
    description: "Comprehensive API references and guides",
    details: "Explore our REST APIs, WebSocket endpoints, and integration guides.",
    icon: Book,
    href: "/docs",
    linkText: "View Documentation",
  },
  {
    title: "GitHub",
    description: "Open source repositories",
    details: "Access our source code, contribute, and track issues.",
    icon: Github,
    href: "https://github.com",
    linkText: "View Repository",
  },
  {
    title: "Contributing",
    description: "Join our community",
    details: "Learn how to contribute to our open source projects.",
    icon: Users,
    href: "/contributing",
    linkText: "Contribute",
  },
  {
    title: "CLI Tools",
    description: "Command line utilities",
    details: "Download and install our command line tools.",
    icon: Terminal,
    href: "/cli",
    linkText: "View CLI Docs",
  },
  {
    title: "SDKs",
    description: "Development kits",
    details: "Find SDKs for your preferred programming language.",
    icon: Code2,
    href: "/sdks",
    linkText: "View SDKs",
  },
  {
    title: "Webhooks",
    description: "Event notifications",
    details: "Set up and manage webhook integrations.",
    icon: Webhook,
    href: "/webhooks",
    linkText: "Configure",
  },
];

export default function DeveloperPage() {
  return (
    <div className="flex h-screen">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={100}>
          <div className="flex h-full flex-col">
            <div className="border-b">
              <div className="flex h-16 items-center px-6">
                <SidebarToggle className="block md:hidden" />
                <div className="ml-4 font-semibold">Developer Resources</div>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {developerResources.map((resource) => (
                  <div
                    key={resource.title}
                    className="rounded-lg border bg-card p-4 transition-colors hover:bg-[#111111]"
                  >
                    <div className="flex items-center gap-4">
                      <div className="rounded-md bg-primary/10 p-2">
                        <resource.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{resource.title}</h3>
                        <p className="text-sm text-muted-foreground">{resource.description}</p>
                      </div>
                    </div>
                    <Separator className="my-4" />
                    <div className="space-y-4">
                      <div className="text-sm">{resource.details}</div>
                      <Button
                        variant="outline"
                        className="w-full hover:bg-white hover:text-black dark:hover:bg-white dark:hover:text-black"
                        asChild
                      >
                        <Link href={resource.href}>{resource.linkText}</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
