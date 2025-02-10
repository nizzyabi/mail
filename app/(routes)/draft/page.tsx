import { Draft } from "@/components/draft/draft";
import React from "react";

async function page() {
  return (
    <div className="w-full bg-white dark:bg-sidebar">
      <div className="flex-col dark:bg-[#090909] dark:text-gray-100 md:m-2 md:flex md:rounded-md md:border">
        <Draft />
      </div>
    </div>
  );
}

export default page;
