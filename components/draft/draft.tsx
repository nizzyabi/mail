"use client";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Drawer, DrawerContent, DrawerHeader, DrawerPortal, DrawerTitle } from "../ui/drawer";
import { AlignVerticalSpaceAround, Save, Send, Trash2, X } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Separator } from "@/components/ui/separator";
import { SidebarToggle } from "../ui/sidebar-toggle";
import { useDrafts } from "./draftHooks/useDrafts";
import { Button } from "@/components/ui/button";
import { DraftType } from "@/store/draftStates";
import { SearchBar } from "../mail/search-bar";
import { cn } from "@/lib/utils";
import { useState } from "react";
import * as React from "react";

export function Draft() {
  const { drafts, addDraft, removeDraft } = useDrafts();
  const [isCompact, setIsCompact] = useState(false);
  const [selectedDraft, setSelectedDraft] = useState<DraftType | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [open, setOpen] = useState(false);

  // checking if the screen is mobile
  React.useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    console.log(isMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  // Handle changes to subject or message
  const handleInputChange = (field: "subject" | "message", value: string) => {
    if (!selectedDraft) return;
    setSelectedDraft((prevDraft) => {
      if (!prevDraft) return null;
      return { ...prevDraft, [field]: value };
    });
  };

  const editMail = () => {
    if (!selectedDraft) return;
    addDraft(selectedDraft);
    setSelectedDraft(null); // closing panel after editing
  };

  React.useEffect(() => {
    if (selectedDraft) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [selectedDraft]);

  const handleClose = React.useCallback(() => {
    setOpen(false);
    setSelectedDraft(null);
  }, []);

  const DraftDisplay = ({ mobile }: { mobile: boolean }) => (
    <div className="flex h-full flex-col">
      <div className={cn("flex h-full flex-col", mobile ? "" : "rounded-r-lg pt-[6px]")}>
        <div className="sticky top-0 z-20 flex items-center gap-2 border-b bg-background/95 px-4 pb-[7.5px] pt-[0.5px] backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex flex-1 items-center gap-2">
            {!mobile && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" className="md:h-fit md:px-2" onClick={handleClose}>
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Close</TooltipContent>
              </Tooltip>
            )}
            <div className="flex-1 truncate text-sm font-medium">
              {selectedDraft?.subject || "No subject"}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className="md:h-fit md:px-2"
                  onClick={() => {
                    removeDraft(selectedDraft?.id || ""); // Remove the draft
                    setSelectedDraft(null);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Discard</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Discard</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" className="md:h-fit md:px-2" onClick={editMail}>
                  <Save className="h-4 w-4" />
                  <span className="sr-only">Save</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Save</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button className="md:h-fit md:px-2">
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Send</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Send</TooltipContent>
            </Tooltip>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <input
            type="text"
            placeholder="Subject"
            className="mb-4 w-full rounded-md border p-2 dark:bg-[#090909]"
            value={selectedDraft?.subject || ""}
            onChange={(e) => handleInputChange("subject", e.target.value)}
          />
          <textarea
            placeholder="Write your message..."
            className="h-[calc(100%-120px)] w-full resize-none rounded-md border p-2 dark:bg-[#090909]"
            value={selectedDraft?.message || ""}
            onChange={(e) => handleInputChange("message", e.target.value)}
          />
        </div>
      </div>
    </div>
  );

  return (
    <TooltipProvider delayDuration={0}>
      <div className="rounded-inherit flex">
        <ResizablePanelGroup
          direction="horizontal"
          autoSaveId={"draft-panel-layout"}
          className="rounded-inherit overflow-hidden"
        >
          <ResizablePanel defaultSize={isMobile ? 100 : 35} minSize={isMobile ? 100 : 35}>
            <div className="flex-1 overflow-y-auto">
              <div>
                <div className="sticky top-0 z-10 rounded-t-md bg-background pt-[6px]">
                  <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-1">
                      <SidebarToggle className="h-fit px-2" />
                    </div>
                    <SearchBar filters={false} />
                    <div className="flex items-center space-x-1.5">
                      <Button
                        variant="ghost"
                        className="md:h-fit md:px-2"
                        onClick={() => setIsCompact(!isCompact)}
                      >
                        <AlignVerticalSpaceAround />
                      </Button>
                    </div>
                  </div>
                  <Separator className="mt-2" />
                </div>

                <div className="h-[calc(93vh)]">
                  {drafts.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">No drafts available</div>
                  ) : (
                    <div className="space-y-1">
                      {drafts.map((draft) => (
                        <div
                          key={draft.id}
                          className={`flex cursor-pointer items-center justify-between p-4 transition-colors hover:bg-secondary/80 ${
                            selectedDraft?.id === draft.id ? "bg-secondary" : ""
                          }`}
                          onClick={() => {
                            setSelectedDraft(draft); // selecting the draft
                          }}
                        >
                          <div className="mr-4 min-w-0 flex-1">
                            <h3 className="truncate font-medium">
                              {draft.subject || "No subject"}
                            </h3>
                            <p className="mt-1 truncate text-sm text-muted-foreground">
                              {draft.message?.substring(0, 50) || "No message"}...
                            </p>
                          </div>
                          <div className="flex shrink-0 gap-2">
                            <Button
                              variant="ghost"
                              size="default"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeDraft(draft.id);
                              }}
                              className="opacity-100 hover:bg-destructive hover:text-destructive-foreground group-hover:opacity-100"
                            >
                              <Trash2 />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </ResizablePanel>
          {isDesktop && selectedDraft && <ResizableHandle withHandle />}
          {selectedDraft && isDesktop && (
            <ResizablePanel
              defaultSize={isMobile ? 0 : 65}
              minSize={isMobile ? 0 : 25}
              className="hidden md:block"
            >
              <DraftDisplay mobile={false} />
            </ResizablePanel>
          )}
        </ResizablePanelGroup>
        {selectedDraft && !isDesktop && (
          <>
            <Drawer
              open={open}
              onOpenChange={(open) => {
                if (!open) {
                  setSelectedDraft(null);
                }
                setOpen(open);
              }}
            >
              <DrawerPortal>
                <DrawerContent className="h-[calc(100vh-3rem)] p-0">
                  <DrawerHeader className="sr-only">
                    <DrawerTitle>Draft Details</DrawerTitle>
                  </DrawerHeader>
                  <div className="flex h-full flex-col overflow-hidden">
                    <DraftDisplay mobile={true} />
                  </div>
                </DrawerContent>
              </DrawerPortal>
            </Drawer>
          </>
        )}
      </div>
    </TooltipProvider>
  );
}
