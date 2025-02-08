import { atomWithStorage } from "jotai/utils";
import { useAtom } from "jotai";

interface Draft {
  id: string;
  recipient?: string;
  subject?: string;
  message?: string;
  lastEdited: string;
}

export const draftsAtom = atomWithStorage<Draft[]>("emailDrafts", []);
export const [draftStates, setDraftStates] = useAtom(draftsAtom);
