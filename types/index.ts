import { MessageKeys, NamespaceKeys, NestedKeyOf } from "next-intl";
import { Messages } from "@/global";

export interface User {
  name: string;
  email: string;
  avatar: string;
}

export interface Account {
  name: string;
  logo: React.ComponentType<{ className?: string }>;
  email: string;
}

export interface NavItem {
  title: MessageKey;
  url: string;
  icon?: React.ComponentType<{ className?: string }>;
  isActive?: boolean;
  badge?: number;
}

export interface NavSection {
  title: MessageKey;
  items: NavItem[];
}

export interface SidebarData {
  user: User;
  accounts: Account[];
  navMain: NavSection[];
}

// Define `MessageKeys` for the `useMessages()` hook of `next-intl`
export type MessageKey = MessageKeys<IntlMessages, NestedKeyOf<IntlMessages>>;
