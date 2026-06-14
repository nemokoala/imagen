"use client";

import * as fabric from "fabric";
import { useEditor } from "../editor-context";
import { LabelTextbox } from "../label-textbox";

function objectLabel(obj: fabric.FabricObject, index: number): string {
  if (
    obj instanceof fabric.Textbox ||
    obj instanceof fabric.IText ||
    obj instanceof LabelTextbox
  ) {
    const t = (obj as fabric.Textbox).text?.trim();
    return t ? `텍스트: ${t.slice(0, 12)}` : "텍스트";
  }
  if (obj instanceof fabric.Rect) return "사각형";
  if (obj instanceof fabric.Circle) return "원";
  if (obj instanceof fabric.FabricImage) return "이미지";
  return obj.type ?? `객체 ${index + 1}`;
}

export function ObjectListPanel() {
  const { objects, activeObject, selectObject } = useEditor();

  // 상단 레이어가 리스트 위에 오도록 역순 표시 (getObjects()는 0이 맨 아래)
  const items = [...objects].reverse();

  return (
    <div className="absolute right-4 top-4 z-10 w-48 rounded-lg border border-border bg-background/90 p-2 shadow-lg backdrop-blur">
      <div className="mb-2 px-1 text-xs font-semibold text-muted-foreground">
        레이어
      </div>
      {items.length === 0 ? (
        <p className="px-1 py-2 text-xs text-muted-foreground">
          추가된 객체가 없습니다
        </p>
      ) : (
        <ul className="space-y-1">
          {items.map((obj, i) => (
            <li key={objects.length - 1 - i}>
              <button
                onClick={() => selectObject(obj)}
                className={`w-full truncate rounded px-2 py-1.5 text-left text-sm transition-colors ${
                  obj === activeObject
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`}
              >
                {objectLabel(obj, i)}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
