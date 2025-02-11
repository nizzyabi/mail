import { emailData, EmailData } from "@/components/mail/data";
import { atom, useAtom } from "jotai";
export const emailsAtom = atom<EmailData[]>(emailData);
export const selectedEmailAtom = atom<EmailData | null>(null);
export const selectedEmailIdsAtom = atom<Set<string>>(new Set<string>());
export const currentPageAtom = atom<number>(1);

export const useEmails = () => {
  const [emails, setEmails] = useAtom(emailsAtom);
  const [selectedEmail, setSelectedEmail] = useAtom(selectedEmailAtom);
  const [selectedEmailIds, setSelectedEmailIds] = useAtom(selectedEmailIdsAtom);
  const [currentPage, setCurrentPage] = useAtom(currentPageAtom);

  const itemsPerPage = 5;
  const totalEmails = emails.length;
  const totalPages = Math.ceil(totalEmails / itemsPerPage);

  const getCurrentPageEmails = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return emails.slice(startIndex, endIndex);
  };

  const handleStarToggle = (id: string) => {
    setEmails(
      emails.map((email) => (email.id === id ? { ...email, isStarred: !email.isStarred } : email)),
    );
  };

  const handleSelectAll = () => {
    const currentPageEmails = getCurrentPageEmails();
    const allSelected = currentPageEmails.every((email) => selectedEmailIds.has(email.id));

    if (allSelected) {
      setSelectedEmailIds(new Set());
    } else {
      const newSelected = new Set(selectedEmailIds);
      currentPageEmails.forEach((email) => newSelected.add(email.id));
      setSelectedEmailIds(newSelected);
    }
  };

  const handleCheckboxToggle = (id: string) => {
    const newSelected = new Set(selectedEmailIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedEmailIds(newSelected);
  };

  const handleArchive = (ids: string | string[]) => {
    const idsToArchive = Array.isArray(ids) ? ids : [ids];
    setEmails(emails.filter((email) => !idsToArchive.includes(email.id)));
    setSelectedEmailIds(new Set());
  };

  const handleDelete = (ids: string | string[]) => {
    const idsToDelete = Array.isArray(ids) ? ids : [ids];
    setEmails(emails.filter((email) => !idsToDelete.includes(email.id)));
    setSelectedEmailIds(new Set());
  };

  const handleMarkRead = (id: string) => {
    setEmails(emails.map((email) => (email.id === id ? { ...email, isRead: true } : email)));
  };

  const handleSnooze = (id: string) => {
    console.log("Snooze email:", id);
  };

  const handleEmailSelect = (email: EmailData) => {
    setSelectedEmail(email);
  };

  const clearSelectedEmail = () => {
    setSelectedEmail(null);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return {
    emails: getCurrentPageEmails(),
    totalEmails,
    currentPage,
    totalPages,
    selectedEmail,
    selectedEmailIds,
    handleStarToggle,
    handleSelectAll,
    handleCheckboxToggle,
    handleArchive,
    handleDelete,
    handleMarkRead,
    handleSnooze,
    handleEmailSelect,
    clearSelectedEmail,
    handleNextPage,
    handlePrevPage,
  };
};
