"use client";
import EmailList from "@/components/sent/Sent";
import React from "react";

export default function EmailPage() {
  return (
    <div className="h-screen w-full bg-white dark:bg-[#1a1a1a]">
      <EmailList showActions={true} showAttachments={true} className="p-4" />
    </div>
  );
}
