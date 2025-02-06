"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";

export function ModeToggle() {
  const { setTheme, theme } = useTheme();

  const themes = [
    { value: "light", icon: Sun, label: "Light" },
    { value: "dark", icon: Moon, label: "Dark" },
    { value: "system", icon: Monitor, label: "System" },
  ];

  return (
    <fieldset className="flex size-6 rounded-full ring-1 ring-border">
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
            className="flex size-6 cursor-pointer items-center justify-center rounded-full transition-all duration-100 peer-checked:text-accent-foreground peer-checked:ring-1 peer-checked:ring-border peer-hover:text-accent-foreground peer-disabled:cursor-not-allowed"
          >
            <span className="sr-only">{label}</span>
            <Icon className="size-4" />
          </label>
        </span>
      ))}
    </fieldset>
  );
}
