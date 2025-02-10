import { AppSidebar } from "@/components/ui/app-sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed flex h-screen w-screen">
      <AppSidebar />
      {children}
    </div>
  );
}
