"use client";

import * as fabric from "fabric";
import { useEffect, useState, type ReactNode } from "react";
import { ChevronUp, ChevronDown, Trash2 } from "lucide-react";
import { useEditor } from "../editor-context";
import { LabelTextbox } from "../label-textbox";

// 인스타 감성 프리셋 팔레트
const PRESET_COLORS = [
  "#ffffff",
  "#000000",
  "#ED4956",
  "#C13584",
  "#833AB4",
  "#405DE6",
  "#FCAF45",
];

// fabric의 fill/stroke(rgba 등)를 input[type=color]용 #rrggbb로 변환 (best effort)
function toHex(color: unknown): string {
  if (typeof color !== "string") return "#000000";
  if (color.startsWith("#")) return color.slice(0, 7);
  const m = color.match(/\d+/g);
  if (m && m.length >= 3) {
    const [r, g, b] = m.map(Number);
    return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
  }
  return "#000000";
}

// ── 재사용 UI 조각 ────────────────────────────────────────────────────
function IconButton({
  label,
  onClick,
  danger,
  children,
}: {
  label: string;
  onClick: () => void;
  danger?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition active:scale-95 ${
        danger
          ? "bg-red-500/15 text-red-400 hover:bg-red-500/25"
          : "bg-white/10 text-white hover:bg-white/20"
      }`}
    >
      {children}
    </button>
  );
}

function ColorSwatches({
  value,
  onChange,
}: {
  value: string;
  onChange: (c: string) => void;
}) {
  return (
    <div className="flex shrink-0 items-center gap-1.5">
      {PRESET_COLORS.map((c) => {
        const active = value.toLowerCase() === c.toLowerCase();
        return (
          <button
            key={c}
            type="button"
            aria-label={`색상 ${c}`}
            onClick={() => onChange(c)}
            style={{ background: c }}
            className={`h-6 w-6 rounded-full transition ${
              active
                ? "ring-2 ring-white ring-offset-2 ring-offset-neutral-900"
                : "ring-1 ring-white/20 hover:ring-white/50"
            }`}
          />
        );
      })}
      {/* 커스텀 색상 (무지개 원 → 네이티브 피커) */}
      <label
        className="relative h-6 w-6 cursor-pointer overflow-hidden rounded-full ring-1 ring-white/20 hover:ring-white/50"
        style={{
          background:
            "conic-gradient(red, orange, yellow, lime, aqua, blue, magenta, red)",
        }}
        title="커스텀 색상"
      >
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
      </label>
    </div>
  );
}

function SliderField({
  label,
  min,
  max,
  value,
  onChange,
}: {
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex shrink-0 items-center gap-2">
      <span className="whitespace-nowrap text-xs font-medium text-white/60">
        {label}
      </span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1.5 w-28 cursor-pointer rounded-full accent-pink-500"
      />
      <span className="w-6 text-right text-xs tabular-nums text-white/80">
        {value}
      </span>
    </div>
  );
}

function Divider() {
  return <div className="h-6 w-px shrink-0 bg-white/10" />;
}

// 선택 객체의 편집 가능한 값을 로컬 state 초기값으로 추출
function readVals(obj: fabric.FabricObject) {
  return {
    fill: toHex(obj.fill),
    stroke: toHex(obj.stroke),
    strokeWidth: typeof obj.strokeWidth === "number" ? obj.strokeWidth : 0,
    fontSize: (obj as fabric.Textbox).fontSize ?? 36,
    bgColor: toHex((obj as LabelTextbox).labelBackgroundColor),
    padding: typeof obj.padding === "number" ? obj.padding : 0,
    radius: (obj as LabelTextbox).bgRadius ?? 0,
  };
}

/**
 * 입력값은 로컬 state로 관리해 드래그 중 실시간으로 반영하고,
 * 변경 시 fabric에도 push한다. 선택 객체가 바뀌면 fabric 값으로 재동기화.
 */
function ObjectProperties({ obj }: { obj: fabric.FabricObject }) {
  const {
    updateActiveObject,
    setTextBackground,
    deleteSelected,
    bringForward,
    sendBackwards,
  } = useEditor();

  const [vals, setVals] = useState(() => readVals(obj));

  // 선택 객체 변경 시 로컬 입력값을 fabric에서 다시 동기화
  useEffect(() => {
    setVals(readVals(obj));
  }, [obj]);

  const isText = obj instanceof fabric.Textbox || obj instanceof fabric.IText;
  const isLabel = obj instanceof LabelTextbox;
  const isShape = obj instanceof fabric.Rect || obj instanceof fabric.Circle;

  return (
    <div className="flex items-center gap-4 overflow-x-auto rounded-2xl bg-neutral-900/95 p-2.5 text-white shadow-xl ring-1 ring-white/10 backdrop-blur [scrollbar-width:none]">
      {/* 공통 액션 */}
      <div className="flex shrink-0 items-center gap-1.5">
        <IconButton label="앞으로" onClick={bringForward}>
          <ChevronUp className="h-4 w-4" />
        </IconButton>
        <IconButton label="뒤로" onClick={sendBackwards}>
          <ChevronDown className="h-4 w-4" />
        </IconButton>
        <IconButton label="삭제" onClick={deleteSelected} danger>
          <Trash2 className="h-4 w-4" />
        </IconButton>
      </div>

      {/* 텍스트 */}
      {isText && (
        <>
          <Divider />
          <ColorSwatches
            value={vals.fill}
            onChange={(v) => {
              setVals((s) => ({ ...s, fill: v }));
              updateActiveObject({ fill: v });
            }}
          />
          <SliderField
            label="크기"
            min={8}
            max={120}
            value={vals.fontSize}
            onChange={(v) => {
              setVals((s) => ({ ...s, fontSize: v }));
              updateActiveObject({ fontSize: v });
            }}
          />
        </>
      )}

      {/* 라벨 배경 */}
      {isLabel && (
        <>
          <Divider />
          <span className="shrink-0 text-xs font-medium text-white/60">
            배경
          </span>
          <ColorSwatches
            value={vals.bgColor}
            onChange={(v) => {
              setVals((s) => ({ ...s, bgColor: v }));
              setTextBackground({ color: v });
            }}
          />
          <SliderField
            label="여백"
            min={0}
            max={40}
            value={vals.padding}
            onChange={(v) => {
              setVals((s) => ({ ...s, padding: v }));
              setTextBackground({ padding: v });
            }}
          />
          <SliderField
            label="라운드"
            min={0}
            max={40}
            value={vals.radius}
            onChange={(v) => {
              setVals((s) => ({ ...s, radius: v }));
              setTextBackground({ radius: v });
            }}
          />
        </>
      )}

      {/* 도형 */}
      {isShape && (
        <>
          <Divider />
          <span className="shrink-0 text-xs font-medium text-white/60">
            채움
          </span>
          <ColorSwatches
            value={vals.fill}
            onChange={(v) => {
              setVals((s) => ({ ...s, fill: v }));
              updateActiveObject({ fill: v });
            }}
          />
          <span className="shrink-0 text-xs font-medium text-white/60">선</span>
          <ColorSwatches
            value={vals.stroke}
            onChange={(v) => {
              setVals((s) => ({ ...s, stroke: v }));
              updateActiveObject({ stroke: v });
            }}
          />
          <SliderField
            label="선두께"
            min={0}
            max={20}
            value={vals.strokeWidth}
            onChange={(v) => {
              setVals((s) => ({ ...s, strokeWidth: v }));
              updateActiveObject({ strokeWidth: v });
            }}
          />
        </>
      )}
    </div>
  );
}

export function PropertiesBar() {
  const { activeObject } = useEditor();

  if (!activeObject) {
    return (
      <div className="flex h-14 items-center justify-center rounded-2xl bg-neutral-900/95 text-sm text-white/50 ring-1 ring-white/10 backdrop-blur">
        편집할 요소를 선택하세요
      </div>
    );
  }

  return <ObjectProperties obj={activeObject} />;
}
