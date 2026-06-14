"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useFabricEditor, type FabricEditor } from "@/hooks/use-fabric-editor";

/**
 * 편집기 중앙 store.
 * fabric 로직(use-fabric-editor)을 한 곳에서 제공하고,
 * 하위 패널(툴바/레이어/속성)은 prop drilling 없이 useEditor()로 접근한다.
 */
const EditorContext = createContext<FabricEditor | null>(null);

export function EditorProvider({
  imageId,
  children,
}: {
  imageId: number;
  children: ReactNode;
}) {
  const editor = useFabricEditor(imageId);
  return (
    <EditorContext.Provider value={editor}>{children}</EditorContext.Provider>
  );
}

export function useEditor(): FabricEditor {
  const ctx = useContext(EditorContext);
  if (!ctx) {
    throw new Error("useEditor must be used within an EditorProvider");
  }
  return ctx;
}
