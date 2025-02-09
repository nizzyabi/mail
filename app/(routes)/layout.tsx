export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className="flex h-screen w-screen overflow-hidden">{children}</div>;
}
