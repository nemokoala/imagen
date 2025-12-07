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
        liked ? "bg-red-50 border-red-300 text-red-600 hover:bg-red-100" : ""
      }`}
    >
      <Heart className={`h-5 w-5 ${liked ? "fill-red-600" : ""}`} />
      <span>{likeCount}</span>
    </Button>
  );
};
