"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Edit2, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Comment } from "@/types/image.interfaces";
import { useState } from "react";
import { ProfileAvatar } from "@/components/auth/ProfileAvatar";
import Link from "next/link";

interface CommentItemProps {
  comment: Comment;
  currentUserId?: number;
  isAuthenticated: boolean;
  editingCommentId: number | null;
  setEditingCommentId: (id: number | null) => void;
  onReplySubmit: (parentId: number, replyContent: string) => void;
  onEdit: (commentId: number, editContent: string) => void;
  onDelete: (commentId: number) => void;
  loading: boolean;
}

export function CommentItem({
  comment,
  currentUserId,
  isAuthenticated,
  editingCommentId,
  setEditingCommentId,
  onReplySubmit,
  onEdit,
  onDelete,
  loading,
}: CommentItemProps) {
  const [editContent, setEditContent] = useState("");
  const [replyContent, setReplyContent] = useState("");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);

  const isOwner = currentUserId === comment.userId;
  const isEditing = editingCommentId === comment.id;
  const isReplying = replyingTo === comment.id;

  // 편집 모드 진입
  const handleEditClick = () => {
    setEditingCommentId(comment.id);
    setEditContent(comment.content);
  };

  // 댓글 삭제
  const handleDeleteClick = () => {
    onDelete(comment.id);
  };

  // 편집 취소
  const handleEditCancel = () => {
    setEditingCommentId(null);
    setEditContent("");
  };

  // 편집 완료
  const handleEditSubmit = async () => {
    onEdit(comment.id, editContent);
    setEditContent("");
    setEditingCommentId(null);
  };

  // 답글 토글
  const handleReplyToggle = () => {
    if (isReplying) {
      setReplyingTo(null);
      setReplyContent("");
    } else {
      setReplyingTo(comment.id);
    }
  };

  // 답글 취소
  const handleReplyCancel = () => {
    setReplyingTo(null);
    setReplyContent("");
  };

  // 답글 작성
  const handleReplySubmit = async () => {
    onReplySubmit(comment.id, replyContent);
    setReplyContent("");
    setReplyingTo(null);
  };

  // 대댓글 삭제
  const handleReplyDelete = (replyId: number) => {
    onDelete(replyId);
  };

  return (
    <div className="group/comment">
      <div className="flex items-start gap-3">
        <Link href={`/profile/${comment.user.id}`}>
          <ProfileAvatar
            profileImageUrl={comment.user.profileImageUrl || ""}
            nickname={comment.user.nickname || ""}
            size="small"
          />
        </Link>
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap items-baseline gap-x-2">
              <p className="text-sm font-semibold text-foreground">
                {comment.user.nickname}
              </p>
              <p className="text-xs text-muted-foreground">
                {format(new Date(comment.createdAt), "yyyy.MM.dd HH:mm", {
                  locale: ko,
                })}
                {comment.updatedAt !== comment.createdAt && " (수정됨)"}
              </p>
            </div>
            {isOwner && !isEditing && (
              <div className="flex items-center gap-1 transition-opacity [@media(hover:hover)]:opacity-0 group-hover/comment:opacity-100 focus-within:opacity-100">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleEditClick}
                  aria-label="댓글 수정"
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDeleteClick}
                  disabled={loading}
                  aria-label="댓글 삭제"
                  className="h-8 w-8 p-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-2">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="min-h-[80px] resize-none border-0 bg-muted/60 shadow-none focus-visible:ring-2 focus-visible:ring-ring/40 dark:bg-muted/60"
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={handleEditCancel}>
                  취소
                </Button>
                <Button
                  size="sm"
                  onClick={handleEditSubmit}
                  disabled={loading || !editContent.trim()}
                >
                  수정
                </Button>
              </div>
            </div>
          ) : (
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
              {comment.content}
            </p>
          )}

          {!isEditing && isAuthenticated && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReplyToggle}
              className="-ml-2 h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
            >
              {isReplying ? "취소" : "답글"}
            </Button>
          )}

          {/* 답글 작성 폼 */}
          {isReplying && (
            <div className="mt-2 space-y-2">
              <Textarea
                placeholder="답글을 입력하세요..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="min-h-[72px] resize-none border-0 bg-muted/60 shadow-none focus-visible:ring-2 focus-visible:ring-ring/40 dark:bg-muted/60"
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={handleReplyCancel}>
                  취소
                </Button>
                <Button
                  size="sm"
                  onClick={handleReplySubmit}
                  disabled={loading || !replyContent.trim()}
                >
                  작성
                </Button>
              </div>
            </div>
          )}

          {/* 대댓글 목록 */}
          {comment.replies.length > 0 && (
            <div className="mt-3 space-y-4">
              {comment.replies.map((reply) => (
                <div key={reply.id} className="group/reply flex items-start gap-3">
                  <ProfileAvatar
                    profileImageUrl={reply.user.profileImageUrl || ""}
                    nickname={reply.user.nickname || ""}
                    size="small"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap items-baseline gap-x-2">
                        <p className="font-semibold text-sm text-foreground">
                          {reply.user.nickname}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(
                            new Date(reply.createdAt),
                            "yyyy.MM.dd HH:mm",
                            {
                              locale: ko,
                            }
                          )}
                        </p>
                      </div>
                      {currentUserId === reply.userId && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleReplyDelete(reply.id)}
                          disabled={loading}
                          aria-label="답글 삭제"
                          className="h-7 w-7 p-0 text-muted-foreground transition-opacity hover:bg-destructive/10 hover:text-destructive [@media(hover:hover)]:opacity-0 group-hover/reply:opacity-100 focus-visible:opacity-100"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                      {reply.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
