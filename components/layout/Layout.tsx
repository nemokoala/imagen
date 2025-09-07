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
        "flex flex-col h-full max-h-[calc(100dvh-60px)] overflow-y-auto content",
        className
      )}
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
