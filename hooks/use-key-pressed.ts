import { useState, useEffect } from "react";

type Key = string | string[];

/**
 * Hook that monitors keyboard key states
 * @param targetKey Single key or array of keys to monitor
 * @returns True if any target key is pressed
 */
export function useKeyPressed(targetKey: Key): boolean {
  const [keyPressed, setKeyPressed] = useState<boolean>(false);

  useEffect(() => {
    const keys = Array.isArray(targetKey) ? targetKey : [targetKey];

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (keys.includes(event.key)) {
        setKeyPressed(true);
      }
    };

    const handleKeyUp = (event: KeyboardEvent): void => {
      if (keys.includes(event.key)) {
        setKeyPressed(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [targetKey]);

  return keyPressed;
}
