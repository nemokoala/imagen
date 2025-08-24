"use client";

import { cn } from "@/lib/utils";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="m-0 flex h-[100dvh] w-full flex-col items-center overflow-hidden bg-zinc-50">
        {children}
      </div>
    </>
  );
}

function Header({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn("min-h-11 w-full max-w-screen-md rounded-none", className)}
    >
      {children}
    </div>
  );
}

function Content({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "w-full max-w-screen-md flex-1 overflow-y-auto bg-zinc-50 p-3 scrollbar-hide",
        className
      )}
    >
      {children}
    </div>
  );
}

function Bottom({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("h-[70px] w-full rounded-none bg-white", className)}>
      {children}
    </div>
  );
}

Layout.Header = Header;
Layout.Content = Content;
Layout.Bottom = Bottom;

export default Layout;
