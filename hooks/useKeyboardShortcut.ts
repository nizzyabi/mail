import { useEffect } from "react";

/**
 * A union type for valid modifier keys.
 */
export type ModifierKey = "meta" | "ctrl" | "shift" | "alt";

/**
 * Represents a single keyboard shortcut configuration.
 */
export interface KeyShortcut {
  /**
   * The main key to listen for (e.g. "c", "Enter", "ArrowUp").
   */
  key: string;

  /**
   * Optional array of modifier keys that must be held with the main key.
   * For macOS, use "meta" for Command. On Windows, "meta" is typically the Windows key, but
   * in many apps, it's also treated the same as "ctrl".
   */
  modifiers?: ModifierKey[];

  /**
   * The function to call when the key (and optional modifiers) is pressed.
   */
  callback: () => void;
}

/**
 * React hook that listens for one or more keyboard shortcuts and calls the
 * associated callback function(s) when the shortcut is triggered.
 *
 * @param {KeyShortcut | KeyShortcut[]} shortcuts - A single shortcut configuration object
 * or an array of multiple shortcut configurations.
 *
 * @example
 * useKeyboardShortcut({
 *   key: "c",
 *   modifiers: ["meta"],
 *   callback: () => console.log("Command + C pressed!"),
 * });
 *
 * // Or for multiple shortcuts:
 * useKeyboardShortcut([
 *   {
 *     key: "c",
 *     modifiers: ["meta"],
 *     callback: () => console.log("Copy"),
 *   },
 *   {
 *     key: "v",
 *     modifiers: ["meta", "shift"],
 *     callback: () => console.log("Paste with Shift"),
 *   },
 * ]);
 */
export function useKeyboardShortcut(shortcuts: KeyShortcut | KeyShortcut[]) {
  useEffect(() => {
    const shortcutList = Array.isArray(shortcuts) ? shortcuts : [shortcuts];

    const handleKeyDown = (event: KeyboardEvent) => {
      shortcutList.forEach(({ key, modifiers, callback }) => {
        // Check each modifier if it's required and pressed
        if (modifiers?.includes("meta") && !(event.metaKey || event.ctrlKey)) return;
        if (modifiers?.includes("ctrl") && !event.ctrlKey) return;
        if (modifiers?.includes("shift") && !event.shiftKey) return;
        if (modifiers?.includes("alt") && !event.altKey) return;

        // Finally, check if the main key matches
        if (event.key.toLowerCase() === key.toLowerCase()) {
          event.preventDefault();
          callback();
        }
      });
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [shortcuts]);
}
