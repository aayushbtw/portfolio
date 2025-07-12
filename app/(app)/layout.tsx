export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="px-2">
      <div className="mx-auto md:max-w-3xl">{children}</div>
    </main>
  );
}
