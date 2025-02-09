"use client";
import { Archive, Clock, Mail, Square, Star, Trash, X, Paperclip } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import React, { useState } from "react";

interface EmailData {
  id: string;
  sender: string;
  to: string;
  subject: string;
  preview: string;
  date: string;
  isStarred: boolean;
  isCheckbox: boolean;
  isSelected: boolean;
  hasAttachment?: boolean;
  attachmentType?: string;
  fullContent?: string;
}

const emailData: EmailData[] = [
  {
    id: "1",
    sender: "Priyanka Shah",
    to: "adadsa.soni@attentions.ai",
    subject: "FullStack Developer",
    preview:
      "Hello Priyanka, I recently came across your tweet regarding an open Frontend Developer position...",
    fullContent: `Hello Priyanka,
      I recently came across your tweet regarding an open Frontend Developer position. I am interested in contributing to the project and would love the opportunity to be considered. Please find my profile attached. If my skills and experience align with your requirements, kindly let me know.

      Regards,
      Priyanka Shah
      1974193498
      https://google.com/`,
    date: "Thu 30 Jan, 21:40 (10 days ago)",
    isStarred: false,
    isSelected: false,
    isCheckbox: true,
    hasAttachment: true,
    attachmentType: "Notion Link",
  },
  {
    id: "2",
    sender: "Ravi Kumar",
    to: "rahul.singh@xyz.com",
    subject: "Backend Developer Opportunity",
    preview: "Hi Rahul, I saw your post about hiring backend developers and would like to apply...",
    fullContent: `Hi Rahul,
      I saw your post about hiring backend developers and would like to apply. I believe my skills align with your requirements. Please check my resume linked below.

      Looking forward to hearing from you.
      Ravi Kumar`,
    date: "Wed 29 Jan, 14:00 (11 days ago)",
    isStarred: true,
    isCheckbox: true,
    isSelected: false,
    hasAttachment: false,
  },
  {
    id: "3",
    sender: "Suman Rao",
    to: "amit.sharma@xyz.com",
    subject: "Web Designer Application",
    preview:
      "Dear Amit, I'm very interested in the Web Designer position you posted. Here is my portfolio...",
    fullContent: `Dear Amit,
      I'm very interested in the Web Designer position you posted. Here is my portfolio link to give you a better idea of my work.

      Let me know if you'd like to discuss further.
      Suman Rao`,
    date: "Mon 27 Jan, 16:20 (12 days ago)",
    isStarred: false,
    isSelected: false,
    isCheckbox: true,
    hasAttachment: true,
    attachmentType: "Portfolio Link",
  },
  {
    id: "4",
    sender: "Nisha Gupta",
    to: "shivani.sharma@abc.com",
    subject: "Product Manager Role",
    preview:
      "Hey Shivani, I found your job posting for a Product Manager role. I'm keen to apply...",
    fullContent: `Hey Shivani,
      I found your job posting for a Product Manager role. I'm keen to apply and have attached my resume for your review.

      Thank you for considering my application.
      Nisha Gupta`,
    date: "Sat 25 Jan, 09:30 (14 days ago)",
    isStarred: false,
    isSelected: false,
    isCheckbox: true,
    hasAttachment: true,
    attachmentType: "Resume",
  },
  {
    id: "5",
    sender: "Sandeep Mehta",
    to: "sumit.kumar@abc.com",
    subject: "Marketing Specialist Position",
    preview:
      "Hi Sumit, I came across your job opening for a Marketing Specialist. Here is my resume...",
    fullContent: `Hi Sumit,
      I came across your job opening for a Marketing Specialist. I believe my experience would be a great fit. Please find my resume attached.

      Looking forward to hearing from you.
      Sandeep Mehta`,
    date: "Fri 24 Jan, 18:10 (15 days ago)",
    isStarred: true,
    isSelected: false,
    isCheckbox: true,
    hasAttachment: true,
    attachmentType: "Resume",
  },
  {
    id: "6",
    sender: "Sandeep Mehta",
    to: "sumit.kumar@abc.com",
    subject: "Marketing Specialist Position",
    preview:
      "Hi Sumit, I came across your job opening for a Marketing Specialist. Here is my resume...",
    fullContent: `Hi Sumit,
      I came across your job opening for a Marketing Specialist. I believe my experience would be a great fit. Please find my resume attached.

      Looking forward to hearing from you.
      Sandeep Mehta`,
    date: "Fri 24 Jan, 18:10 (15 days ago)",
    isStarred: false,
    isSelected: false,
    isCheckbox: true,
    hasAttachment: true,
    attachmentType: "Resume",
  },
  {
    id: "7",
    sender: "Sandeep Mehta",
    to: "sumit.kumar@abc.com",
    subject: "Marketing Specialist Position",
    preview:
      "Hi Sumit, I came across your job opening for a Marketing Specialist. Here is my resume...",
    fullContent: `Hi Sumit,
      I came across your job opening for a Marketing Specialist. I believe my experience would be a great fit. Please find my resume attached.

      Looking forward to hearing from you.
      Sandeep Mehta`,
    date: "Fri 24 Jan, 18:10 (15 days ago)",
    isStarred: false,
    isSelected: false,
    isCheckbox: true,
    hasAttachment: true,
    attachmentType: "Resume",
  },
  {
    id: "8",
    sender: "Sandeep Mehta",
    to: "sumit.kumar@abc.com",
    subject: "Marketing Specialist Position",
    preview:
      "Hi Sumit, I came across your job opening for a Marketing Specialist. Here is my resume...",
    fullContent: `Hi Sumit,
      I came across your job opening for a Marketing Specialist. I believe my experience would be a great fit. Please find my resume attached.

      Looking forward to hearing from you.
      Sandeep Mehta`,
    date: "Fri 24 Jan, 18:10 (15 days ago)",
    isStarred: false,
    isSelected: false,
    isCheckbox: false,
    hasAttachment: true,
    attachmentType: "Resume",
  },
  {
    id: "9",
    sender: "Sandeep Mehta",
    to: "sumit.kumar@abc.com",
    subject: "Marketing Specialist Position",
    preview:
      "Hi Sumit, I came across your job opening for a Marketing Specialist. Here is my resume...",
    fullContent: `Hi Sumit,
      I came across your job opening for a Marketing Specialist. I believe my experience would be a great fit. Please find my resume attached.

      Looking forward to hearing from you.
      Sandeep Mehta`,
    date: "Fri 24 Jan, 18:10 (15 days ago)",
    isStarred: false,
    isSelected: false,
    isCheckbox: false,
    hasAttachment: true,
    attachmentType: "Resume",
  },
  {
    id: "10",
    sender: "Sandeep Mehta",
    to: "sumit.kumar@abc.com",
    subject: "Marketing Specialist Position",
    preview:
      "Hi Sumit, I came across your job opening for a Marketing Specialist. Here is my resume...",
    fullContent: `Hi Sumit,
      I came across your job opening for a Marketing Specialist. I believe my experience would be a great fit. Please find my resume attached.

      Looking forward to hearing from you.
      Sandeep Mehta`,
    date: "Fri 24 Jan, 18:10 (15 days ago)",
    isStarred: false,
    isSelected: false,
    isCheckbox: false,
    hasAttachment: true,
    attachmentType: "Resume",
  },
  {
    id: "11",
    sender: "Sandeep Mehta",
    to: "sumit.kumar@abc.com",
    subject: "Marketing Specialist Position",
    preview:
      "Hi Sumit, I came across your job opening for a Marketing Specialist. Here is my resume...",
    fullContent: `Hi Sumit,
      I came across your job opening for a Marketing Specialist. I believe my experience would be a great fit. Please find my resume attached.

      Looking forward to hearing from you.
      Sandeep Mehta`,
    date: "Fri 24 Jan, 18:10 (15 days ago)",
    isStarred: false,
    isSelected: false,
    isCheckbox: false,
    hasAttachment: true,
    attachmentType: "Resume",
  },
  {
    id: "12",
    sender: "Sandeep Mehta",
    to: "sumit.kumar@abc.com",
    subject: "Marketing Specialist Position",
    preview:
      "Hi Sumit, I came across your job opening for a Marketing Specialist. Here is my resume...",
    fullContent: `Hi Sumit,
      I came across your job opening for a Marketing Specialist. I believe my experience would be a great fit. Please find my resume attached.

      Looking forward to hearing from you.
      Sandeep Mehta`,
    date: "Fri 24 Jan, 18:10 (15 days ago)",
    isStarred: false,
    isSelected: false,
    isCheckbox: true,
    hasAttachment: true,
    attachmentType: "Resume",
  },
  {
    id: "13",
    sender: "Ravi Kumar",
    to: "rahul.singh@xyz.com",
    subject: "Backend Developer Opportunity",
    preview: "Hi Rahul, I saw your post about hiring backend developers and would like to apply...",
    fullContent: `Hi Rahul,
      I saw your post about hiring backend developers and would like to apply. I believe my skills align with your requirements. Please check my resume linked below.

      Looking forward to hearing from you.
      Ravi Kumar`,
    date: "Wed 29 Jan, 14:00 (11 days ago)",
    isStarred: false,
    isCheckbox: false,
    isSelected: false,
    hasAttachment: false,
  },
  {
    id: "14",
    sender: "Ravi Kumar",
    to: "rahul.singh@xyz.com",
    subject: "Backend Developer Opportunity",
    preview: "Hi Rahul, I saw your post about hiring backend developers and would like to apply...",
    fullContent: `Hi Rahul,
      I saw your post about hiring backend developers and would like to apply. I believe my skills align with your requirements. Please check my resume linked below.

      Looking forward to hearing from you.
      Ravi Kumar`,
    date: "Wed 29 Jan, 14:00 (11 days ago)",
    isStarred: true,
    isCheckbox: true,
    isSelected: false,
    hasAttachment: false,
  },
];

const Sent = () => {
  const [emails, setEmails] = useState<EmailData[]>(emailData);
  const [selectedEmail, setSelectedEmail] = useState<EmailData | null>(null);

  const toggleStar = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setEmails(
      emails.map((email) => (email.id === id ? { ...email, isStarred: !email.isStarred } : email)),
    );
  };

  const toggleCheckbox = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setEmails(
      emails.map((email) =>
        email.id === id ? { ...email, isCheckbox: !email.isCheckbox } : email,
      ),
    );
  };

  const handleEmailClick = (email: EmailData) => {
    setSelectedEmail(email);
  };

  return (
    <div className="relative m-3 w-full overflow-y-auto">
      <div className="flex flex-col">
        {emails.map((email) => (
          <div
            key={email.id}
            onClick={() => handleEmailClick(email)}
            className="flex h-14 w-full cursor-pointer flex-row items-center justify-between border-b px-8 py-3 text-sm text-black hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
          >
            <div className="flex min-w-[200px] flex-row items-center space-x-2">
              <div onClick={(e) => toggleCheckbox(e, email.id)} className="cursor-pointer">
                <Square
                  className={`h-4 w-4 ${email.isCheckbox ? "fill-blue-600 text-blue-600" : ""}`}
                />
              </div>
              <div onClick={(e) => toggleStar(e, email.id)} className="cursor-pointer">
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

            <div className="group flex min-w-[60px] cursor-pointer flex-row items-center justify-end space-x-2">
              <span className="block group-hover:hidden">{email.date}</span>

              {/* Action Icons (Archive, Delete, Mark as Read, Snooze) */}
              <div className="hidden space-x-2 group-hover:flex">
                <button className="group/icon flex flex-col items-center">
                  <Archive className="h-4 w-4" />
                </button>
                <button className="group/icon flex flex-col items-center">
                  <Trash className="h-4 w-4" />
                </button>
                <button className="group/icon flex flex-col items-center">
                  <Mail className="h-4 w-4" />
                </button>
                <button className="group/icon flex flex-col items-center">
                  <Clock className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedEmail && (
        <Card className="fixed inset-0 z-50 m-4 overflow-auto bg-white dark:bg-gray-900">
          <CardContent className="p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">{selectedEmail.subject}</h2>
              <button
                onClick={() => setSelectedEmail(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="mb-6 space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>From:</strong> {selectedEmail.sender}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>To:</strong> {selectedEmail.to}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Date:</strong> {selectedEmail.date}
              </p>
            </div>

            <div className="whitespace-pre-wrap text-gray-800 dark:text-gray-200">
              {selectedEmail.fullContent}
            </div>

            {selectedEmail.hasAttachment && (
              <div className="mt-6 rounded-lg border p-4">
                <div className="flex items-center space-x-2">
                  <Paperclip className="h-4 w-4" />
                  <span>attachment.{selectedEmail.attachmentType?.toLowerCase()}</span>
                </div>
              </div>
            )}

            {/* Action Icons (Archive, Delete, Mark as Read, Snooze) inside email view */}
            <div className="mt-6 flex space-x-4">
              <button className="flex items-center space-x-1 text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white">
                <Archive className="h-5 w-5" />
                <span>Archive</span>
              </button>
              <button className="flex items-center space-x-1 text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white">
                <Trash className="h-5 w-5" />
                <span>Delete</span>
              </button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Sent;
