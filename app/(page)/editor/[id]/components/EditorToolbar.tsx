"use client";

import { Button } from "@/components/ui/button";
import { useEditor } from "../editor-context";

export function EditorToolbar() {
  const {
    ready,
    isSaving,
    addText,
    addRect,
    deleteSelected,
    bringForward,
    sendBackwards,
    bringToFront,
    sendToBack,
    save,
  } = useEditor();

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* 객체 추가 */}
      <Button size="sm" onClick={addText} disabled={!ready}>
        텍스트
      </Button>
      <Button size="sm" onClick={addRect} disabled={!ready}>
        사각형
      </Button>
      <Button
        size="sm"
        variant="destructive"
        onClick={deleteSelected}
        disabled={!ready}
      >
        선택 삭제
      </Button>

      {/* z-order */}
      <div className="mx-1 h-5 w-px bg-border" />
      <Button size="sm" variant="outline" onClick={bringToFront} disabled={!ready}>
        맨 앞
      </Button>
      <Button size="sm" variant="outline" onClick={bringForward} disabled={!ready}>
        앞으로
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={sendBackwards}
        disabled={!ready}
      >
        뒤로
      </Button>
      <Button size="sm" variant="outline" onClick={sendToBack} disabled={!ready}>
        맨 뒤
      </Button>

      <div className="ml-auto">
        <Button size="sm" onClick={save} disabled={!ready || isSaving}>
          {isSaving ? "저장 중..." : "저장"}
        </Button>
      </div>
    </div>
  );
}
