"use client";

import { useTheme } from "next-themes";
import { Toaster } from "sonner";
import React from "react";

export const Toast = () => {
  const { theme } = useTheme();
  return <Toaster position="top-center" theme={theme as "dark" | "light" | "system"} />;
};
