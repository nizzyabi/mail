import { Settings } from "lucide-react";
import { Button } from "../ui/button";

export function UserButton() {
  return (
    <Button variant="outline" className="w-fit">
      <Settings className="h-[1.2rem] w-[1.2rem]" />
      <span>Account Settings</span>
    </Button>
  );
}
