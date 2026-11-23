import { useToggleLikeMutation } from "@/queries/image/mutations";
import { Button } from "../ui/button";
import { Heart } from "lucide-react";
import { useGetLikeStatusQuery } from "@/queries/image/queries";
import { toast } from "sonner";
import { useUserStore } from "@/stores/userStore";

export const LikeButton = ({ imageId }: { imageId: number }) => {
  const { isAuthenticated } = useUserStore();
  const { data: likeStatus } = useGetLikeStatusQuery(imageId);
  const likeMutation = useToggleLikeMutation(imageId);

  const likeCount = likeStatus?.likeCount ?? 0;
  const liked = likeStatus?.liked ?? false;

  // 좋아요 토글
  const handleLikeToggle = async () => {
    if (!isAuthenticated) {
      toast.error("로그인이 필요합니다.");
      return;
    }
    if (!imageId) return;

    try {
      const response = await likeMutation.mutateAsync();
      if (response.success) {
        toast.success(response.message);
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "좋아요 처리 중 오류가 발생했습니다.";
      toast.error(message);
    }
  };

  return (
    <Button
      onClick={handleLikeToggle}
      disabled={likeMutation.isPending || !isAuthenticated}
      variant="outline"
      className={`flex items-center gap-2 ${
        liked
          ? "bg-rose-500/10 text-rose-600 ring-rose-500/30 hover:bg-rose-500/15 hover:text-rose-600 dark:bg-rose-500/15 dark:text-rose-400 dark:ring-rose-500/30"
          : ""
      }`}
    >
      <Heart className={`h-5 w-5 ${liked ? "fill-current" : ""}`} />
      <span>{likeCount}</span>
    </Button>
  );
};
