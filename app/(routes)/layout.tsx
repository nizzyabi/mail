import { AppSidebar } from "@/components/ui/app-sidebar";
import { SWRConfig } from "swr";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <SWRConfig
        value={{ keepPreviousData: true, revalidateOnFocus: false, revalidateIfStale: false }}
      >
        <AppSidebar />
        {children}
      </SWRConfig>
    </div>
  );
}
