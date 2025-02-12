import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

export function UserButton() {
  return (
    <Button variant="outline" className="w-fit">
      <Settings className="h-[1.2rem] w-[1.2rem]" />
      <span>Account Settings</span>
    </Button>
  );
}
