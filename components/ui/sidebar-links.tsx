"use client";
import { MailCompose } from "../mail/mail-compose";
import { useSidebar } from "@/hooks/use-sidebar";
import Link, { LinkProps } from "next/link";
import { motion } from "framer-motion";
import { Pencil } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { useState } from "react";

type Links = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

export const SidebarLink = ({
  link,
  className,
  isLogo,
  ...props
}: {
  link: Links;
  className?: string;
  isLogo?: boolean;
  props?: LinkProps;
}) => {
  const { open, animate } = useSidebar();
  const [composeOpen, setComposeOpen] = useState(false);

  if (isLogo) {
    return (
      <div className={cn("group/sidebar flex items-center justify-start gap-2 py-2", className)}>
        {link.icon}
        <motion.div
          animate={{
            display: animate ? (open ? "inline-block" : "none") : "inline-block",
            opacity: animate ? (open ? 1 : 0) : 1,
          }}
        >
          <Button
            onClick={() => setComposeOpen(true)}
            className="ml-2 h-7 w-full font-semibold"
            variant="default"
          >
            <Pencil className="size-4" />
            <span>{link.label}</span>
          </Button>
          <MailCompose
            open={composeOpen}
            onClose={() => setComposeOpen(false)}
            aria-label="Compose email dialog"
          />
        </motion.div>
      </div>
    );
  }

  return (
    <Link
      href={link.href}
      className={cn("group/sidebar flex items-center justify-start gap-2 py-2", className)}
      {...props}
    >
      {link.icon}
      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className="inline-block whitespace-pre text-sm text-neutral-700 transition duration-150 group-hover/sidebar:translate-x-1 dark:text-neutral-200"
      >
        {link.label}
      </motion.span>
    </Link>
  );
};
