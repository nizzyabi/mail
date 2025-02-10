import { MessageKeys, NestedKeyOf } from "next-intl";

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
  title: MessageKey | "";
  items: NavItem[];
}

export interface SidebarData {
  user: User;
  accounts: Account[];
  navMain: NavSection[];
}

// Type to use to have completion for localization keys
export type MessageKey = MessageKeys<IntlMessages, NestedKeyOf<IntlMessages>>;
