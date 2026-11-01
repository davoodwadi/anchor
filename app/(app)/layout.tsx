export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Each page draws its own AwPage background and top bar
  return <main className="min-h-svh bg-black">{children}</main>;
}
