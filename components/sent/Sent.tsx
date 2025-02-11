import {
  Square,
  Star,
  Archive,
  Trash,
  Mail,
  Clock,
  X,
  Paperclip,
  InboxIcon,
  ChevronLeft,
  ChevronRight,
  Check,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { EmailData } from "@/components/mail/data";
import { useEmails } from "@/hooks/use-email";
import React from "react";

interface EmailListProps {
  className?: string;
  showActions?: boolean;
  showAttachments?: boolean;
}

interface EmailDetailProps {
  email: EmailData;
  onClose: () => void;
  showAttachments?: boolean;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
}

const EmptyState = () => (
  <div className="flex h-[400px] flex-col items-center justify-center text-gray-500">
    <InboxIcon className="mb-4 h-16 w-16" />
    <h3 className="mb-2 text-xl font-medium">No emails found</h3>
    <p>Your inbox is empty or no emails match your current filters</p>
  </div>
);

const EmailDetail: React.FC<EmailDetailProps> = ({
  email,
  onClose,
  showAttachments = true,
  onArchive,
  onDelete,
}) => {
  return (
    <Card className="fixed inset-0 z-50 m-4 overflow-auto bg-white dark:bg-[#171717]">
      <CardContent className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">{email.subject}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="mb-6 space-y-2">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <strong>From:</strong> {email.sender}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <strong>To:</strong> {email.to}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <strong>Date:</strong> {email.date}
          </p>
        </div>

        <div className="whitespace-pre-wrap text-gray-800 dark:text-gray-200">
          {email.fullContent}
        </div>

        {showAttachments && email.hasAttachment && (
          <div className="mt-6 rounded-lg border p-4">
            <div className="flex items-center space-x-2">
              <Paperclip className="h-4 w-4" />
              <span>attachment.{email.attachmentType?.toLowerCase()}</span>
            </div>
          </div>
        )}

        <div className="mt-6 flex space-x-4">
          <button
            onClick={() => onArchive(email.id)}
            className="flex items-center space-x-1 text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white"
          >
            <Archive className="h-5 w-5" />
            <span>Archive</span>
          </button>
          <button
            onClick={() => onDelete(email.id)}
            className="flex items-center space-x-1 text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white"
          >
            <Trash className="h-5 w-5" />
            <span>Delete</span>
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export const EmailList: React.FC<EmailListProps> = ({
  className = "",
  showActions = true,
  showAttachments = true,
}) => {
  const {
    emails,
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
  } = useEmails();

  const handleStarClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    handleStarToggle(id);
  };

  const handleCheckboxClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    handleCheckboxToggle(id);
  };

  if (!emails.length) {
    return <EmptyState />;
  }

  const startIndex = (currentPage - 1) * 50 + 1;
  const endIndex = Math.min(currentPage * 50, totalEmails);

  return (
    <div className={`relative w-full overflow-y-auto ${className}`}>
      {/* Pagination Header */}
      <div className="sticky top-0 flex items-center justify-between border-b bg-white px-8 py-2 dark:bg-gray-900">
        <div className="flex items-center space-x-4">
          <button onClick={handleSelectAll} className="cursor-pointer">
            {emails.every((email) => selectedEmailIds.has(email.id)) ? (
              <Check className="h-4 w-4 text-blue-600" />
            ) : (
              <Square className="h-4 w-4" />
            )}
          </button>
          {selectedEmailIds.size > 0 && (
            <div className="flex space-x-2">
              <button
                onClick={() => handleArchive(Array.from(selectedEmailIds))}
                className="text-gray-600 hover:text-green-900"
              >
                <Archive className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDelete(Array.from(selectedEmailIds))}
                className="text-gray-600 hover:text-red-900"
              >
                <Trash className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            {selectedEmailIds.size > 0
              ? `${selectedEmailIds.size} selected`
              : `${startIndex}-${endIndex} of ${totalEmails}`}
          </span>
          <div className="flex space-x-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="disabled:opacity-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Email List */}
      <div className="flex flex-col">
        {emails.map((email) => (
          <div
            key={email.id}
            onClick={() => handleEmailSelect(email)}
            className="flex h-14 w-full cursor-pointer flex-row items-center justify-between border-b px-8 py-3 text-sm text-black hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
          >
            <div className="flex min-w-[200px] flex-row items-center space-x-2">
              <div onClick={(e) => handleCheckboxClick(e, email.id)} className="cursor-pointer">
                {selectedEmailIds.has(email.id) ? (
                  <Check className="h-4 w-4 text-blue-600" />
                ) : (
                  <Square className="h-4 w-4" />
                )}
              </div>
              <div onClick={(e) => handleStarClick(e, email.id)} className="cursor-pointer">
                <Star
                  className={`h-4 w-4 ${email.isStarred ? "fill-yellow-400 text-yellow-400" : ""}`}
                />
              </div>
              <p className="truncate font-semibold">{email.sender}</p>
            </div>

            <div className="flex flex-1 flex-row px-4">
              <p className="mr-2 font-medium">{email.subject}</p>
              <span className="truncate text-gray-600 dark:text-gray-400">{email.preview}</span>
            </div>

            {showActions && (
              <div className="group flex min-w-[60px] cursor-pointer flex-row items-center justify-end space-x-2">
                <span className="block group-hover:hidden">{email.date}</span>
                <div className="hidden space-x-2 group-hover:flex">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleArchive(email.id);
                    }}
                    className="group/icon flex flex-col items-center"
                  >
                    <Archive className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(email.id);
                    }}
                    className="group/icon flex flex-col items-center"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMarkRead(email.id);
                    }}
                    className="group/icon flex flex-col items-center"
                  >
                    <Mail className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSnooze(email.id);
                    }}
                    className="group/icon flex flex-col items-center"
                  >
                    <Clock className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Email Detail Modal */}
      {selectedEmail && (
        <EmailDetail
          email={selectedEmail}
          onClose={clearSelectedEmail}
          showAttachments={showAttachments}
          onArchive={handleArchive}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default EmailList;
