"use client";

import {
  DropdownMenuContent,
  DropdownMenu,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";
import { Filter } from "lucide-react";
import { tagsAtom } from "./use-tags";
import { useAtom } from "jotai";
import React from "react";

type Checked = DropdownMenuCheckboxItemProps["checked"];

export default function Filters() {
  const [tags, setTags] = useAtom(tagsAtom);

  const toggleTag = (id: string, checked: Checked) => {
    setTags(tags.map((tag) => (tag.id === id ? { ...tag, checked } : tag)));
  };

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger>
            <Filter className="h-4 w-4 text-muted-foreground hover:text-primary"></Filter>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p className="z-50">Filters</p>
        </TooltipContent>
      </Tooltip>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Tags</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {tags.map((tag) => (
          <DropdownMenuCheckboxItem
            key={tag.id}
            checked={tag.checked}
            onCheckedChange={(checked) => toggleTag(tag.id, checked)}
            onSelect={(e) => e.preventDefault()}
          >
            {tag.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
