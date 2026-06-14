"use client";

import { useParams } from "next/navigation";
import { Layout } from "@/components/layout/Layout";
import { EditorProvider } from "./editor-context";
import { EditorToolbar } from "./components/EditorToolbar";
import { EditorCanvas } from "./components/EditorCanvas";
import { ObjectListPanel } from "./components/ObjectListPanel";
import { PropertiesBar } from "./components/PropertiesBar";

export default function EditorPage() {
  const { id } = useParams();
  const imageId = parseInt(id as string);

  return (
    <Layout.Content>
      <EditorProvider imageId={imageId}>
        <div className="flex h-full w-full flex-col gap-3 p-4">
          <EditorToolbar />
          {/* 캔버스 + 우측 상단 오브젝트 리스트 */}
          <div className="relative flex flex-1">
            <EditorCanvas />
            <ObjectListPanel />
          </div>
          {/* 하단 편집 메뉴바 */}
          <PropertiesBar />
        </div>
      </EditorProvider>
    </Layout.Content>
  );
}
