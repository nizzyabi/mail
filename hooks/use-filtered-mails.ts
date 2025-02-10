import { SearchFilters } from "@/components/mail/use-search";
import { Tag } from "@/components/mail/use-tags";
import { Mail } from "@/components/mail/data";
import { useMemo } from "react";

function composePredicates<T>(predicates: ((item: T) => boolean)[]): (item: T) => boolean {
  return (item: T) => predicates.every((predicate) => predicate(item));
}

/**
 * Custom hook for filtering mails based on active tags
 * @param mails - Array of mail objects to filter
 * @param activeTags - Array of currently active tag objects
 * @param searchFilters - Search filters set in the search bar
 * @param readFilter
 * @returns Array of filtered mail objects
 */
export const useFilteredMails = (
  mails: Mail[],
  activeTags: Tag[],
  searchFilters: SearchFilters,
) => {
  // Create a lookup object for active tags
  const activeTagLookup = useMemo(() => {
    const lookup: Record<string, boolean> = {};
    activeTags.forEach((tag) => {
      lookup[tag.label.toLowerCase()] = true;
    });
    return lookup;
  }, [activeTags]);

  const filteredMails = useMemo(() => {
    const predicates: ((mail: Mail) => boolean)[] = [];

    if (activeTags.length > 0) {
      predicates.push((mail: Mail) =>
        mail.labels.some((label) => activeTagLookup[label.toLowerCase()]),
      );
    }

    if (searchFilters.query) {
      const queryLower = searchFilters.query.toLowerCase();
      predicates.push((mail: Mail) => {
        const content = (mail.subject + " " + mail.email + " " + (mail.text ?? "")).toLowerCase();
        return content.includes(queryLower);
      });
    }

    if (searchFilters.subject) {
      const subjectLower = searchFilters.subject.toLowerCase();
      predicates.push((mail: Mail) => mail.subject.toLowerCase().includes(subjectLower));
    }
    if (searchFilters.from) {
      const fromLower = searchFilters.from.toLowerCase();
      predicates.push((mail: Mail) => mail.email.toLowerCase().includes(fromLower));
    }

    if (searchFilters.dateRange && searchFilters.dateRange.from && searchFilters.dateRange.to) {
      const { from: startDate, to: endDate } = searchFilters.dateRange;
      predicates.push((mail: Mail) => {
        const mailDate = new Date(mail.date);
        return mailDate >= startDate && mailDate <= endDate;
      });
    }

    if (searchFilters.readFilter === "unread") {
      predicates.push((mail: Mail) => !mail.read);
    }

    const combinedPredicate = composePredicates(predicates);

    return mails.filter(combinedPredicate);
  }, [mails, activeTagLookup, activeTags.length]);

  return filteredMails;
};
