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
    <div className="rounded-2xl bg-muted/60 p-2 transition-shadow focus-within:ring-2 focus-within:ring-ring/40">
      <Textarea
        placeholder="댓글을 남겨 보세요"
        aria-label="댓글 입력"
        value={commentContent}
        onChange={(e) => setCommentContent(e.target.value)}
        onKeyDown={(e) => {
          // Ctrl/⌘ + Enter 로 바로 등록
          if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            if (!loading && commentContent.trim()) onSubmit();
          }
        }}
        className="min-h-[64px] resize-none border-0 bg-transparent px-2 shadow-none focus-visible:ring-0 dark:bg-transparent"
      />
      <div className="flex items-center justify-between gap-2 pl-2">
        <span className="hidden text-xs text-muted-foreground sm:inline">
          Ctrl + Enter로 등록
        </span>
        <Button
          size="sm"
          onClick={onSubmit}
          disabled={loading || !commentContent.trim()}
          className="ml-auto"
        >
          <Send className="h-3.5 w-3.5" />
          등록
        </Button>
      </div>
    </div>
  );
}
