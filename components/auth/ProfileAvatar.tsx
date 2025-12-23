import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
export const ProfileAvatar = ({
  profileImageUrl,
  nickname,
  size = "medium",
}: {
  profileImageUrl: string | null;
  nickname: string;
  size?: "small" | "medium" | "large" | "icon";
}) => {
  return (
    <Avatar
      className={cn(
        "h-10 w-10",
        size === "icon" && "h-6 w-6",
        size === "small" && "h-8 w-8",
        size === "medium" && "h-10 w-10",
        size === "large" && "h-24 w-24"
      )}
    >
      <AvatarImage
        src={profileImageUrl || undefined}
        alt={nickname || "User"}
      />
      <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-400 text-white">
        {nickname?.charAt(0).toUpperCase() || "U"}
      </AvatarFallback>
    </Avatar>
  );
};
