import { AppSidebar } from "@/components/ui/app-sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar />
      {children}
    </div>
  );
}
