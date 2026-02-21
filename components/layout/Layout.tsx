import { cn } from "@/lib/utils";

const Header = () => {
  return <div>Header</div>;
};

const Content = ({
  children,
  className,
  ref,
}: {
  children: React.ReactNode;
  className?: string;
  ref?: React.RefObject<HTMLDivElement | null>;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col h-full max-h-[calc(100dvh-60px)] overflow-y-auto bg-gradient-to-br from-blue-50 via-white to-purple-50",
        "dark:from-gray-900 dark:via-gray-800 dark:to-purple-950/50",
        "outline-none transform-gpu flex-shrink-0",
        className,
      )}
      style={{ WebkitOverflowScrolling: "touch" }}
      ref={ref}
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
