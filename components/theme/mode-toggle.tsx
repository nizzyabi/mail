"use client";

import * as React from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ModeToggle() {
  const { setTheme, theme } = useTheme();

  const themes = [
    { value: "light", icon: Sun, label: "Light" },
    { value: "system", icon: Monitor, label: "System" },
    { value: "dark", icon: Moon, label: "Dark" },
  ];

  return (
    <fieldset className="ring-border flex size-6 rounded-full ring-1">
      <legend className="sr-only">Select a display theme:</legend>
      {themes.map(({ value, icon: Icon, label }) => (
        <span key={value} className="h-full">
          <input
            type="radio"
            id={`theme-${value}`}
            value={value}
            checked={theme === value}
            onChange={() => setTheme(value)}
            className="peer sr-only"
          />
          <label
            htmlFor={`theme-${value}`}
            className="peer-checked:text-accent-foreground peer-checked:ring-border peer-hover:text-accent-foreground flex size-6 cursor-pointer items-center justify-center rounded-full transition-all duration-100 peer-checked:ring-1 peer-disabled:cursor-not-allowed"
          >
            <span className="sr-only">{label}</span>
            <Icon className="size-4" />
          </label>
        </span>
      ))}
    </fieldset>
  );
}
