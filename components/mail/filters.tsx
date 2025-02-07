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
import { Button } from "@/components/ui/button";
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
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Filter />
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Filters</p>
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
