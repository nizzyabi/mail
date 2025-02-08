import { accounts, mails } from "@/components/mail/data";
import { Mail } from "@/components/mail/mail";

export default function MailDashboard() {
  const defaultLayout: number[] = [1, 2, 3]; // demo layout
  const defaultCollapsed = false; // defaultCollapsed

  return (
    <Mail
      accounts={accounts}
      mails={mails}
      defaultLayout={defaultLayout}
      defaultCollapsed={defaultCollapsed}
      navCollapsedSize={4}
    />
  );
}
