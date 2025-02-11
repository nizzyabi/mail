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
  title: string;
  url: string;
  icon?: React.ComponentType<{ className?: string }>;
  isActive?: boolean;
  badge?: number;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export interface SidebarData {
  user: User;
  accounts: Account[];
  navMain: NavSection[];
}

export interface ParsedMessage {
  id: string;
  title: string;
  tags: string[];
  sender: {
    name: string;
    email: string;
  };
  subject: string;
  receivedOn: string;
  unread: boolean;
  body: string;
  processedHtml: string;
  blobUrl: string;
  totalReplies: number;
}

export interface InitialThread {
  id: string;
  title: string;
  tags: string[];
  sender: {
    name: string;
    email: string;
  };
  receivedOn: string;
  unread: boolean;
  subject: string;
  totalReplies: number;
}
