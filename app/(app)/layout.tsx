export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main className="max-w-2xl mx-auto px-4 py-20">{children}</main>;
}
