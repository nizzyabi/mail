import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Search, SlidersHorizontal, CalendarIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { type DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format, subDays } from "date-fns";
import { cn } from "@/lib/utils";
import { useState } from "react";

const inboxes = ["All Mail", "Inbox", "Drafts", "Sent", "Junk", "Trash", "Archive"];

function DateFilter() {
  const [date, setDate] = useState<DateRange | undefined>({
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
            <CalendarIcon className="mr-2 h-4 w-4" />
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

export function SearchBar() {
  const [subject, setSubject] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  return (
    <div className="relative flex-1 px-4 md:max-w-[600px] md:px-8">
      <div className="relative flex items-center">
        <Search
          className="absolute left-2 h-3.5 w-3.5 text-muted-foreground/70"
          aria-hidden="true"
        />
        <Input
          placeholder="Search"
          className="h-7 w-full pl-8 pr-8 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        <div className="absolute right-2 flex items-center">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-5 w-5 p-0 hover:bg-transparent">
                <SlidersHorizontal
                  className="h-3.5 w-3.5 text-muted-foreground/70"
                  aria-hidden="true"
                />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-[min(calc(100vw-2rem),400px)] p-3 sm:w-[500px] md:w-[600px] md:p-4"
              side="bottom"
              sideOffset={10}
              align="end"
            >
              <div className="space-y-4">
                {/* Quick Filters */}
                <div>
                  <h2 className="mb-2 text-xs font-medium text-muted-foreground">Quick Filters</h2>
                  <div className="flex flex-wrap gap-1.5">
                    <Button variant="secondary" size="sm" className="h-7 text-xs">
                      Unread
                    </Button>
                    <Button variant="secondary" size="sm" className="h-7 text-xs">
                      Has Attachment
                    </Button>
                    <Button variant="secondary" size="sm" className="h-7 text-xs">
                      Starred
                    </Button>
                  </div>
                </div>

                <Separator className="my-2" />

                {/* Main Filters */}
                <div className="grid gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Search in</label>
                    <Select>
                      <SelectTrigger className="h-8">
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
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Subject</label>
                    <Input
                      placeholder="Email subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="h-8"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground">From</label>
                      <Input
                        placeholder="Sender"
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                        className="h-8"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground">To</label>
                      <Input
                        placeholder="Recipient"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        className="h-8"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Date Range</label>
                    <DateFilter />
                  </div>
                </div>

                <Separator className="my-2" />

                {/* Labels */}
                <div>
                  <h2 className="mb-2 text-xs font-medium text-muted-foreground">Labels</h2>
                  <div className="flex flex-wrap gap-1.5">
                    <Button variant="outline" size="sm" className="h-7 text-xs">
                      Work
                    </Button>
                    <Button variant="outline" size="sm" className="h-7 text-xs">
                      Personal
                    </Button>
                    <Button variant="outline" size="sm" className="h-7 text-xs">
                      Important
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs text-muted-foreground"
                    >
                      + Add
                    </Button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2">
                  <Button variant="ghost" size="sm" className="h-7 text-xs">
                    Reset
                  </Button>
                  <Button size="sm" className="h-7 text-xs">
                    Apply Filters
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}
