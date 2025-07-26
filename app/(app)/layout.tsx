export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="grid grid-cols-12 max-w-screen overflow-x-hidden">
      <div className="col-span-3" />
      <div className="col-span-6 grid grid-cols-1 gap-10 border-x">
        {children}
      </div>
      <div className="col-span-3" />
    </main>
  );
}
