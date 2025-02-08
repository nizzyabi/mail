"use client";

import { Construction } from "lucide-react";
import BackButton from "./back-button";
import { use } from "react";

interface UnderConstructionProps {
  params: Promise<{
    path: string;
  }>;
}

export default function UnderConstruction({ params }: UnderConstructionProps) {
  const resolvedParams = use(params);
  // Decode the path parameter
  const decodedPath = decodeURIComponent(resolvedParams.path);

  return (
    <div className="flex w-full items-center justify-center bg-white text-center dark:bg-background">
      <div className="flex-col items-center justify-center dark:text-gray-100 md:flex">
        <Construction className="h-16 w-16 animate-pulse text-muted-foreground" />
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Under Construction</h2>
          <p className="text-muted-foreground">
            <span className="block">The {decodedPath} page is currently under construction.</span>
            <span className="block">Check back soon!</span>
          </p>
        </div>
        {/* Buttons */}
        <div className="mt-2 flex gap-2">
          <BackButton />
        </div>
      </div>
    </div>
  );
}
