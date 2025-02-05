import { AppSidebar } from "@/components/ui/app-sidebar";

export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <div className="h-screen w-[100%] flex">
            <AppSidebar/>
            {children}
      </div>
    );
  }
  