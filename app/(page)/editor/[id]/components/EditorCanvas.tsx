"use client";

import { useEditor } from "../editor-context";

export function EditorCanvas() {
  const { canvasElRef } = useEditor();

  return (
    <div className="flex flex-1 items-center justify-center overflow-auto rounded-lg bg-neutral-900">
      <canvas ref={canvasElRef} />
    </div>
  );
}
