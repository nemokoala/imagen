"use client";

import { useParams } from "next/navigation";
import { Layout } from "@/components/layout/Layout";
import { EditorProvider } from "./editor-context";
import { EditorToolbar } from "./components/EditorToolbar";
import { EditorCanvas } from "./components/EditorCanvas";

export default function EditorPage() {
  const { id } = useParams();
  const imageId = parseInt(id as string);

  return (
    <Layout.Content>
      <EditorProvider imageId={imageId}>
        <div className="flex h-full w-full flex-col gap-3 p-4">
          <EditorToolbar />
          <EditorCanvas />
        </div>
      </EditorProvider>
    </Layout.Content>
  );
}
