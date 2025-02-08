import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useMedia } from "react-use";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { ReactElement } from "react";

interface ResponsiveModalProps {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ResponsiveModal({
  children,
  open,
  onOpenChange,
}: ResponsiveModalProps): ReactElement {
  const isDesktop = useMedia("(min-width: 1024px)", true);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <VisuallyHidden>
          <DialogHeader>
            <DialogTitle>Compose</DialogTitle>
          </DialogHeader>
        </VisuallyHidden>
        <DialogContent className="bordr-none hide-scrollbar w-full overflow-y-auto p-0 sm:max-w-lg">
          {children}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <VisuallyHidden>
          <DrawerHeader>
            <DrawerTitle>Title</DrawerTitle>
          </DrawerHeader>
        </VisuallyHidden>
        <div className="hide-scrollbar overflow-y-auto">{children}</div>
      </DrawerContent>
    </Drawer>
  );
}
