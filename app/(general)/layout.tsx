export default function RootGeneral({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative min-h-screen w-full bg-black flex flex-col overflow-x-hidden">
      <main className="relative flex-1 w-full flex flex-col">{children}</main>
    </div>
  );
}
