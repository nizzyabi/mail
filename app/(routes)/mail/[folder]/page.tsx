import { cookies } from "next/headers";

import { accounts } from "@/components/mail/data";
import { Mail } from "@/components/mail/mail";

interface MailPageProps {
  params: Promise<{
    folder: string;
  }>;
}

const AllowedFolders = ["inbox", "draft", "sent", "spam", "trash", "archive"];

export default async function MailPage({ params }: MailPageProps) {
  const resolvedParams = await params;

  if (!AllowedFolders.includes(resolvedParams.folder)) {
    return <div>Invalid folder</div>;
  }

  const cookieStore = await cookies();
  const layout = cookieStore.get("react-resizable-panels:layout:mail");
  const collapsed = cookieStore.get("react-resizable-panels:collapsed");

  const defaultLayout = layout ? JSON.parse(layout.value) : undefined;
  const defaultCollapsed = collapsed ? JSON.parse(collapsed.value) : undefined;

  return (
    <div className="w-full bg-white dark:bg-sidebar">
      <div className="flex-col bg-[#090909] dark:text-gray-100 md:m-2 md:flex md:rounded-md md:border">
        <Mail
          accounts={accounts}
          folder={resolvedParams.folder}
          defaultLayout={defaultLayout}
          defaultCollapsed={defaultCollapsed}
          navCollapsedSize={4}
        />
      </div>
    </div>
  );
}
