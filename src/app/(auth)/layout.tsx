export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-zinc-100">
      <div className="z-20 w-full">{children}</div>
      <div className="absolute inset-0 z-10 bg-zinc-800 opacity-80 mix-blend-darken" />
    </div>
  );
}
