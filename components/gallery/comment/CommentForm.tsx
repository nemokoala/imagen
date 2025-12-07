"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

interface CommentFormProps {
  commentContent: string;
  setCommentContent: (content: string) => void;
  onSubmit: () => void;
  loading: boolean;
}

export function CommentForm({
  commentContent,
  setCommentContent,
  onSubmit,
  loading,
}: CommentFormProps) {
  return (
    <div className="space-y-2">
      <Textarea
        placeholder="댓글을 입력하세요..."
        value={commentContent}
        onChange={(e) => setCommentContent(e.target.value)}
        className="min-h-[100px] resize-none"
      />
      <div className="flex justify-end">
        <Button
          onClick={onSubmit}
          disabled={loading || !commentContent.trim()}
          className="gradient-purple-bg text-white"
        >
          <Send className="mr-2 h-4 w-4" />
          댓글 작성
        </Button>
      </div>
    </div>
  );
}
