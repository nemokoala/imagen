import { cn } from "@/lib/utils";

const Header = () => {
  return <div>Header</div>;
};

const Content = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col h-full max-h-[calc(100dvh-60px)] overflow-y-auto",
        className
      )}
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
