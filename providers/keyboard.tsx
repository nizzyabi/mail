"use client";

import { useOpenComposeModal } from "@/hooks/use-open-compose-modal";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";

export default function KeyboardProvider() {
  const { setIsOpen } = useOpenComposeModal();

  useKeyboardShortcut({
    key: "c",
    modifiers: ["meta"],
    callback: () => {
      setIsOpen(true);
    },
  });

  return null;
}
