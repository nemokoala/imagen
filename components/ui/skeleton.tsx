import { cn } from "@/lib/utils";

function Skeleton({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "bg-gray-300 dark:bg-zinc-800 relative overflow-hidden rounded-md",
        className,
      )}
      {...props}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 dark:via-white/10 to-transparent" />
      {children}
    </div>
  );
}

export { Skeleton };
