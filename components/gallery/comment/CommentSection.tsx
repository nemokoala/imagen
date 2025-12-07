"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useUserStore } from "@/stores/userStore";
import { CommentForm } from "./CommentForm";
import { CommentItem } from "./CommentItem";
import { useGetCommentsQuery } from "@/queries/image/queries";
import {
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
} from "@/queries/image/mutations";

interface CommentSectionProps {
  imageId: number;
}

export function CommentSection({ imageId }: CommentSectionProps) {
  const { isAuthenticated, user } = useUserStore();
  const [commentContent, setCommentContent] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);

  // TanStack Query hooks
  const { data: comments = [] } = useGetCommentsQuery(imageId);
  const createCommentMutation = useCreateCommentMutation(imageId);
  const updateCommentMutation = useUpdateCommentMutation(imageId);
  const deleteCommentMutation = useDeleteCommentMutation(imageId);

  const loading =
    createCommentMutation.isPending ||
    updateCommentMutation.isPending ||
    deleteCommentMutation.isPending;

  // 댓글 작성
  const handleCommentSubmit = async () => {
    if (!isAuthenticated) {
      toast.error("로그인이 필요합니다.");
      return;
    }
    if (!commentContent.trim()) return;

    try {
      const response = await createCommentMutation.mutateAsync({
        content: commentContent,
      });
      if (response.success) {
        setCommentContent("");
        toast.success(response.message);
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "댓글 작성 중 오류가 발생했습니다.";
      toast.error(message);
    }
  };

  // 대댓글 작성
  const handleReplySubmit = async (parentId: number, replyContent: string) => {
    if (!isAuthenticated) {
      toast.error("로그인이 필요합니다.");
      return;
    }
    if (!replyContent.trim()) return;

    try {
      const response = await createCommentMutation.mutateAsync({
        content: replyContent,
        parentId,
      });
      if (response.success) {
        toast.success(response.message);
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "답글 작성 중 오류가 발생했습니다.";
      toast.error(message);
    }
  };

  // 댓글 수정
  const handleCommentEdit = async (commentId: number, editContent: string) => {
    if (!editContent.trim()) return;

    try {
      const response = await updateCommentMutation.mutateAsync({
        commentId,
        content: editContent,
      });
      if (response.success) {
        setEditingCommentId(null);
        toast.success(response.message);
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "댓글 수정 중 오류가 발생했습니다.";
      toast.error(message);
    }
  };

  // 댓글 삭제
  const handleCommentDelete = async (commentId: number) => {
    if (!confirm("댓글을 삭제하시겠습니까?")) return;

    try {
      const response = await deleteCommentMutation.mutateAsync(commentId);
      if (response.success) {
        toast.success(response.message);
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "댓글 삭제 중 오류가 발생했습니다.";
      toast.error(message);
    }
  };

  return (
    <div className="space-y-4">
      {/* 댓글 작성 폼 */}
      {isAuthenticated && (
        <CommentForm
          commentContent={commentContent}
          setCommentContent={setCommentContent}
          onSubmit={handleCommentSubmit}
          loading={loading}
        />
      )}

      {/* 댓글 목록 */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            아직 댓글이 없습니다.
          </p>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              currentUserId={user?.id}
              isAuthenticated={isAuthenticated}
              editingCommentId={editingCommentId}
              setEditingCommentId={setEditingCommentId}
              onReplySubmit={handleReplySubmit}
              onEdit={handleCommentEdit}
              onDelete={handleCommentDelete}
              loading={loading}
            />
          ))
        )}
      </div>
    </div>
  );
}
