export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="m-0 flex h-[100dvh] w-full flex-col items-center overflow-hidden bg-zinc-50">
      {children}
    </div>
  );
}
