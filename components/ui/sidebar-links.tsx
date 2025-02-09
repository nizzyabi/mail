"use client";
import { useSidebar } from "@/hooks/use-sidebar";
import Link, { LinkProps } from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

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

  return (
    <Link
      href={link.href}
      className={cn("group/sidebar flex items-center justify-start gap-2 py-2", className)}
      {...props}
    >
      {link.icon}
      {isLogo ? (
        <span className="inline-block whitespace-pre text-lg font-semibold text-neutral-700 dark:text-neutral-200">
          {link.label}
        </span>
      ) : (
        <motion.span
          animate={{
            display: animate ? (open ? "inline-block" : "none") : "inline-block",
            opacity: animate ? (open ? 1 : 0) : 1,
          }}
          className="inline-block whitespace-pre text-sm text-neutral-700 transition duration-150 group-hover/sidebar:translate-x-1 dark:text-neutral-200"
        >
          {link.label}
        </motion.span>
      )}
    </Link>
  );
};
