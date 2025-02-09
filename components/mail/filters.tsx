"use client";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";
import { Check, ChevronsUpDown, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { tagsAtom } from "./use-tags";
import { cn } from "@/lib/utils";
import { useAtom } from "jotai";
import React from "react";

import { DateRange } from "react-day-picker";
import { CalendarIcon } from "lucide-react";
import { format, subDays } from "date-fns";

import { Calendar } from "@/components/ui/calendar";

type Checked = DropdownMenuCheckboxItemProps["checked"];

const inboxes = ["All Mail", "Inbox", "Drafts", "Sent", "Junk", "Trash", "Archive"];

export default function Filters() {
  const [subject, setSubject] = React.useState("");
  const [from, setFrom] = React.useState("");
  const [to, setTo] = React.useState("");

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="md:h-fit md:px-2">
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[275px] sm:w-[600px]" side="bottom" sideOffset={10} align="end">
        <div className="flex flex-col gap-4 pt-3">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <h1 className="mb-2 text-sm font-semibold text-muted-foreground">Subject</h1>
              <Input
                placeholder="Email subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            <div>
              <h1 className="mb-2 text-sm font-semibold text-muted-foreground">Search in</h1>
              <SearchInboxes />
            </div>
            <div>
              <h1 className="mb-2 text-sm font-semibold text-muted-foreground">Tags</h1>
              <Tags />
            </div>

            <div>
              <h1 className="mb-2 text-sm font-semibold text-muted-foreground">From</h1>
              <Input
                placeholder="Sender mail"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              />
            </div>
            <div>
              <h1 className="mb-2 text-sm font-semibold text-muted-foreground">To</h1>
              <Input
                placeholder="Recipient mail"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </div>

            <div className="sm:col-span-2">
              <h1 className="mb-2 text-sm font-semibold text-muted-foreground">Date</h1>
              <DateFilter />
            </div>
          </div>
          <Button className="self-end">Search</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function SearchInboxes() {
  const [value, setValue] = React.useState("");
  return (
    <Select onValueChange={setValue} value={value}>
      <SelectTrigger>
        <SelectValue placeholder="All Mail" />
      </SelectTrigger>
      <SelectContent>
        {inboxes.map((inbox) => (
          <SelectItem key={inbox} value={inbox}>
            {inbox}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function Tags() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [tags, setTags] = useAtom(tagsAtom);

  const toggleTag = (id: string, checked: Checked) => {
    setTags(tags.map((tag) => (tag.id === id ? { ...tag, checked } : tag)));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value ? tags.find((tag) => tag.label === value)?.label : "Filter by tags"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search framework..." />
          <CommandList>
            <CommandEmpty>No tags found.</CommandEmpty>
            <CommandGroup>
              {tags.map((tag) => (
                <CommandItem
                  key={tag.id}
                  value={tag.label}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                    toggleTag(tag.id, !tag.checked);
                  }}
                >
                  <Check
                    className={cn("mr-2 h-4 w-4", tag.checked ? "opacity-100" : "opacity-0")}
                  />
                  {tag.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function DateFilter() {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });
  return (
    <div className="grid gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn("justify-start text-left font-normal", !date && "text-muted-foreground")}
          >
            <CalendarIcon />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
            disabled={(date) => date > new Date()}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
