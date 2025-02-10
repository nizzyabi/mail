import type { DateRange } from "react-day-picker";
import { atom, useAtom } from "jotai";

export const INBOXES = ["All Mail", "Inbox", "Drafts", "Sent", "Junk", "Trash", "Archive"] as const;

export type Inbox = (typeof INBOXES)[number];

export interface SearchFilters {
  query: string;
  subject: string;
  from: string;
  to: string;
  inbox: Inbox;
  dateRange?: DateRange;
  readFilter: "all" | "unread";
}

export const INITIAL_FILTERS: SearchFilters = {
  query: "",
  subject: "",
  from: "",
  to: "",
  inbox: "All Mail",
  dateRange: undefined,
  readFilter: "all",
};

export const searchFiltersAtom = atom<SearchFilters>(INITIAL_FILTERS);

export function useSearch() {
  return useAtom(searchFiltersAtom);
}
