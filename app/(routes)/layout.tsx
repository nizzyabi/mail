import { AppSidebar } from "@/components/ui/app-sidebar";
import { SWRConfig } from "swr";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig>
      <AppSidebar />
      {children}
    </SWRConfig>
  );
}
