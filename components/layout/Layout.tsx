import { cn } from "@/lib/utils";

const Header = () => {
  return <div>Header</div>;
};

const Content = ({
  children,
  className,
  ref,
  onScrollChange,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  ref?: React.RefObject<HTMLDivElement | null>;
  onScrollChange?: (scrollTop: number) => void;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col h-full max-h-[calc(100dvh-60px)] overflow-y-auto [scrollbar-gutter:stable] bg-gradient-to-br from-blue-50 via-white to-purple-50",
        "dark:from-zinc-950 dark:via-zinc-900 dark:to-purple-950/40",
        "outline-none flex-shrink-0",
        className,
      )}
      style={{ WebkitOverflowScrolling: "touch" }}
      ref={ref}
      onScroll={
        onScrollChange
          ? (e) => onScrollChange(e.currentTarget.scrollTop)
          : undefined
      }
      {...props}
    >
      {children}
    </div>
  );
};

const Bottom = () => {
  return <div>Bottom</div>;
};

export const Layout = {
  Header: Header,
  Content: Content,
  Bottom: Bottom,
};
