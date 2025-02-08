import { setDraftStates } from "@/store/draftStates";

export const handleDraft = (message: string, subject: string) => {
  const newDraft = {
    id: Math.random().toString(36).substring(7),
    message,
    subject,
    lastEdited: new Date().toISOString(),
  };
  setDraftStates((drafts) => {
    return [...drafts, newDraft];
  });
};

// need to do changes
