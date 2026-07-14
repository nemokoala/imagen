import { cn } from "@/lib/utils";

export const Logo = ({ className }: { className?: string }) => {
  return (
    <span className={cn("flex items-center gap-2", className)}>
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8 flex-shrink-0"
        aria-hidden
      >
        <defs>
          <linearGradient id="logo-mark" x1="0" y1="0" x2="32" y2="32">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="9" fill="url(#logo-mark)" />
        <path
          d="M7 22.5 13 15l4 5 3-3.5 5 6z"
          fill="white"
          fillOpacity="0.9"
        />
        <path
          d="M21.5 6.5 22.6 9.4 25.5 10.5 22.6 11.6 21.5 14.5 20.4 11.6 17.5 10.5 20.4 9.4z"
          fill="white"
        />
      </svg>
      <span className="text-xl font-semibold tracking-tight text-foreground">
        Image
        <span className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
          Gen
        </span>
      </span>
    </span>
  );
};
