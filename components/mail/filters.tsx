'use client'

import React from "react";
import { useAtom } from 'jotai'
import { tagsAtom, type Tag } from './use-tags'
import {
  DropdownMenuContent,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";

type Checked = DropdownMenuCheckboxItemProps["checked"]

export default function Filters() {
  
  const [tags, setTags] = useAtom(tagsAtom)

  const toggleTag = (id: string, checked: Checked) => {
    setTags(tags.map(tag =>
      tag.id === id ? { ...tag, checked } : tag
    ))
  }

  const activeTags = tags.filter(tag => tag.checked)

  const TagBadge = ({ tag }: { tag: Tag }) => (
    <Badge
      key={tag.id}
      variant="secondary"
      className="flex items-center gap-1 cursor-pointer select-none"
      onClick={() => toggleTag(tag.id, false)}
    >
      {tag.label}
      <X className="h-3 w-3" />
    </Badge>
  )

  return (
    <div className="flex justify-between items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size='sm'>Tags</Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-40" align="start">
          {tags.map(tag => (
            <DropdownMenuCheckboxItem
              key={tag.id}
              checked={tag.checked}
              onCheckedChange={(checked) => toggleTag(tag.id, checked)}
            >
              {tag.label}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="flex flex-wrap gap-2 px-2 mr-auto">
        {activeTags.length <= 4 ? (
          activeTags.map(tag => <TagBadge key={tag.id} tag={tag} />)
        ) : (
          <>
            {activeTags.slice(0, 3).map(tag => <TagBadge key={tag.id} tag={tag} />)}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Badge
                  variant="outline"
                  className="cursor-pointer select-none"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  {activeTags.length - 3} more
                </Badge>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {activeTags.slice(3).map(tag => (
                  <DropdownMenuCheckboxItem
                    key={tag.id}
                    checked={true}
                    onCheckedChange={() => toggleTag(tag.id, false)}
                  >
                    {tag.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
      </div>
    </div>
  )
}