import { useEffect, useCallback, useMemo } from "react";

type ModifierKey = "ctrl" | "shift" | "alt" | "meta";

export interface ShortcutMap {
  [key: string]: string;
}

export interface ShortcutHandlers {
  [key: string]: () => void;
}

const isInputElement = (element: Element | null): boolean => {
  if (!element) return false;
  const tagName = element.tagName.toLowerCase();
  return (
    tagName === "input" ||
    tagName === "textarea" ||
    (tagName === "div" && element.getAttribute("contenteditable") === "true")
  );
};

const isKeyCombinationMatch = (event: KeyboardEvent, shortcut: string): boolean => {
  const keys = shortcut.toLowerCase().split("+");
  const keyPressed = keys.pop();

  if (!keyPressed || event.key.toLowerCase() !== keyPressed.toLowerCase()) {
    return false;
  }

  const modifiers = new Set(keys as ModifierKey[]);
  const activeModifiers = new Set<ModifierKey>();

  if (event.ctrlKey) activeModifiers.add("ctrl");
  if (event.shiftKey) activeModifiers.add("shift");
  if (event.altKey) activeModifiers.add("alt");
  if (event.metaKey) activeModifiers.add("meta");

  return (
    modifiers.size === activeModifiers.size &&
    Array.from(modifiers).every((mod) => activeModifiers.has(mod))
  );
};

export const useKeyboardShortcuts = (
  shortcutMap: ShortcutMap,
  handlers: ShortcutHandlers,
  options: {
    enableInInputs?: boolean;
    preventDefault?: boolean;
  } = {},
): void => {
  const { enableInInputs = false, preventDefault = true } = options;

  const shortcutEntries = useMemo(() => Object.entries(shortcutMap), [shortcutMap]);

  const handleKeyPress = useCallback(
    (event: KeyboardEvent): void => {
      // This is to skip if target is an input field and shortcuts are not enabled for inputs
      if (!enableInInputs && isInputElement(event.target as Element)) {
        return;
      }

      for (const [action, shortcut] of shortcutEntries) {
        if (isKeyCombinationMatch(event, shortcut)) {
          if (preventDefault) {
            event.preventDefault();
          }

          if (handlers[action]) {
            handlers[action]();
          } else {
            console.warn(`No handler defined for keyboard shortcut: ${action}`);
          }

          break;
        }
      }
    },
    [shortcutEntries, handlers, enableInInputs, preventDefault],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);
};

export default useKeyboardShortcuts;
