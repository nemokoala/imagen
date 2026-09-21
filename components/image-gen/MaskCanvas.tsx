"use client";

import { useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import Image from "next/image";
import { Brush, Eraser, Trash2, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export interface MaskCanvasHandle {
  /** 흰색(편집) / 검은색(유지) PNG 마스크. 칠한 영역이 없으면 null. */
  exportMask: () => Promise<File | null>;
  clear: () => void;
}

interface MaskCanvasProps {
  src: string;
  disabled?: boolean;
  onPaintedChange?: (painted: boolean) => void;
  ref?: React.Ref<MaskCanvasHandle>;
}

type Tool = "brush" | "eraser";

interface Stroke {
  tool: Tool;
  /** 마스크 픽셀 기준 브러시 지름 */
  size: number;
  points: { x: number; y: number }[];
}

/** 브러시 지름은 짧은 변의 비율로 정한다. 해상도가 달라도 체감 크기가 같아진다. */
const BRUSH_RATIO_MIN = 2;
const BRUSH_RATIO_MAX = 40;
const DEFAULT_RATIO: Record<Tool, number> = { brush: 12, eraser: 18 };

/** 서버가 마스크를 약 1MP로 줄이므로 그 이상은 픽셀 처리 비용만 늘어난다. */
const MAX_MASK_PIXELS = 1_300_000;

/** 오버레이 색 (#ef4444) */
const OVERLAY_RGB = [239, 68, 68] as const;

function maskSize(width: number, height: number) {
  const scale = Math.sqrt(MAX_MASK_PIXELS / (width * height));
  if (scale >= 1) return { width, height };
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

export function MaskCanvas({ src, disabled, onPaintedChange, ref }: MaskCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const strokesRef = useRef<Stroke[]>([]);
  const activeStrokeRef = useRef<Stroke | null>(null);
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);
  const [tool, setTool] = useState<Tool>("brush");
  const [ratios, setRatios] = useState<Record<Tool, number>>(DEFAULT_RATIO);
  const [strokeCount, setStrokeCount] = useState(0);
  /** 실제로 칠해진 픽셀이 남아 있는지. 획 수와 달리 전부 지운 경우를 구분한다. */
  const [painted, setPainted] = useState(false);

  const brushSize = size
    ? Math.max(4, Math.round((Math.min(size.width, size.height) * ratios[tool]) / 100))
    : 0;

  const getContext = useCallback(() => {
    // 획마다 픽셀을 읽으므로 항상 같은 옵션으로 컨텍스트를 얻어야 한다.
    return canvasRef.current?.getContext("2d", { willReadFrequently: true }) ?? null;
  }, []);

  useEffect(() => {
    let cancelled = false;
    const image = new window.Image();
    image.onload = () => {
      if (cancelled) return;
      strokesRef.current = [];
      setStrokeCount(0);
      setSize(maskSize(image.naturalWidth, image.naturalHeight));
    };
    image.src = src;
    return () => {
      cancelled = true;
    };
  }, [src]);

  useEffect(() => {
    onPaintedChange?.(painted);
  }, [painted, onPaintedChange]);

  // 지울 것이 없으면 지우개에 머무를 이유가 없다. 새 이미지를 올렸을 때 이전 도구가
  // 지우개로 남아 아무리 칠해도 반응이 없던 문제도 여기서 함께 막는다.
  useEffect(() => {
    if (!painted) setTool("brush");
  }, [painted]);

  const drawStroke = useCallback(
    (context: CanvasRenderingContext2D, stroke: Stroke, from: number) => {
      context.save();
      context.globalCompositeOperation =
        stroke.tool === "eraser" ? "destination-out" : "source-over";
      context.strokeStyle = `rgb(${OVERLAY_RGB.join(" ")})`;
      context.fillStyle = `rgb(${OVERLAY_RGB.join(" ")})`;
      context.lineWidth = stroke.size;
      context.lineCap = "round";
      context.lineJoin = "round";
      if (stroke.points.length === 1) {
        context.beginPath();
        context.arc(stroke.points[0].x, stroke.points[0].y, stroke.size / 2, 0, Math.PI * 2);
        context.fill();
      } else {
        const start = stroke.points[Math.max(0, from - 1)];
        context.beginPath();
        context.moveTo(start.x, start.y);
        for (let i = Math.max(1, from); i < stroke.points.length; i++) {
          context.lineTo(stroke.points[i].x, stroke.points[i].y);
        }
        context.stroke();
      }
      context.restore();
    },
    [],
  );

  /**
   * 반투명 경계를 없애 마스크를 0/255로 고정한다. 지우개가 남기는 붉은 잔상을
   * 제거하고, 화면에 보이는 영역과 실제로 내보내는 마스크를 일치시킨다.
   */
  const binarize = useCallback(() => {
    const canvas = canvasRef.current;
    const context = getContext();
    if (!canvas || !context || !canvas.width || !canvas.height) return false;
    const image = context.getImageData(0, 0, canvas.width, canvas.height);
    const { data } = image;
    let any = false;
    for (let i = 0; i < data.length; i += 4) {
      const on = data[i + 3] >= 128;
      if (on) any = true;
      data[i] = OVERLAY_RGB[0];
      data[i + 1] = OVERLAY_RGB[1];
      data[i + 2] = OVERLAY_RGB[2];
      data[i + 3] = on ? 255 : 0;
    }
    context.putImageData(image, 0, 0);
    return any;
  }, [getContext]);

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    const context = getContext();
    if (!canvas || !context) return;
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (const stroke of strokesRef.current) drawStroke(context, stroke, 1);
    setPainted(binarize());
  }, [drawStroke, binarize, getContext]);

  useEffect(() => {
    redraw();
  }, [size, redraw]);

  const toCanvasPoint = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return null;
    return {
      x: ((event.clientX - rect.left) / rect.width) * canvas.width,
      y: ((event.clientY - rect.top) / rect.height) * canvas.height,
    };
  };

  const moveCursor = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const cursor = cursorRef.current;
    const canvas = canvasRef.current;
    if (!cursor || !canvas) return;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !canvas.width) return;
    const diameter = brushSize * (rect.width / canvas.width);
    cursor.style.width = `${diameter}px`;
    cursor.style.height = `${diameter}px`;
    cursor.style.transform = `translate(${event.clientX - rect.left - diameter / 2}px, ${
      event.clientY - rect.top - diameter / 2
    }px)`;
    // 커서가 이미 캔버스 위에 있는 채로 렌더되면 pointerenter가 오지 않으므로
    // 움직일 때마다 표시 상태를 갱신한다.
    cursor.style.opacity = disabled ? "0" : "1";
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (disabled || !size) return;
    const point = toCanvasPoint(event);
    if (!point) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    const stroke: Stroke = { tool, size: brushSize, points: [point] };
    activeStrokeRef.current = stroke;
    strokesRef.current = [...strokesRef.current, stroke];
    const context = getContext();
    if (context) drawStroke(context, stroke, 0);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    moveCursor(event);
    const stroke = activeStrokeRef.current;
    if (!stroke) return;
    const point = toCanvasPoint(event);
    if (!point) return;
    stroke.points.push(point);
    const context = getContext();
    if (context) drawStroke(context, stroke, stroke.points.length - 1);
  };

  const endStroke = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!activeStrokeRef.current) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    activeStrokeRef.current = null;
    setPainted(binarize());
    setStrokeCount(strokesRef.current.length);
  };

  const undo = () => {
    strokesRef.current = strokesRef.current.slice(0, -1);
    setStrokeCount(strokesRef.current.length);
    redraw();
  };

  const clear = useCallback(() => {
    const canvas = canvasRef.current;
    const context = getContext();
    strokesRef.current = [];
    setStrokeCount(0);
    setPainted(false);
    if (canvas && context) context.clearRect(0, 0, canvas.width, canvas.height);
  }, [getContext]);

  useImperativeHandle(
    ref,
    () => ({
      clear,
      exportMask: async () => {
        const canvas = canvasRef.current;
        const context = getContext();
        if (!canvas || !context || !canvas.width || !canvas.height) return null;

        const { data } = context.getImageData(0, 0, canvas.width, canvas.height);
        const output = document.createElement("canvas");
        output.width = canvas.width;
        output.height = canvas.height;
        const outputContext = output.getContext("2d");
        if (!outputContext) return null;

        const mask = outputContext.createImageData(canvas.width, canvas.height);
        let painted = false;
        for (let i = 0; i < data.length; i += 4) {
          const value = data[i + 3] >= 128 ? 255 : 0;
          if (value) painted = true;
          mask.data[i] = value;
          mask.data[i + 1] = value;
          mask.data[i + 2] = value;
          mask.data[i + 3] = 255;
        }
        if (!painted) return null;
        outputContext.putImageData(mask, 0, 0);

        const blob = await new Promise<Blob | null>((resolve) =>
          output.toBlob(resolve, "image/png"),
        );
        return blob ? new File([blob], "edit-mask.png", { type: "image/png" }) : null;
      },
    }),
    [clear, getContext],
  );

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border/70 px-2 py-1.5">
        <ToggleGroup
          type="single"
          variant="outline"
          size="sm"
          value={tool}
          onValueChange={(value) => value && setTool(value as Tool)}
          disabled={disabled}
        >
          <ToggleGroupItem value="brush" aria-label="칠하기">
            <Brush className="h-4 w-4" /> 칠하기
          </ToggleGroupItem>
          <ToggleGroupItem value="eraser" aria-label="칠 지우기" disabled={!painted}>
            <Eraser className="h-4 w-4" /> 칠 지우기
          </ToggleGroupItem>
        </ToggleGroup>

        <div className="flex min-w-28 flex-1 items-center gap-2">
          <Slider
            value={[ratios[tool]]}
            min={BRUSH_RATIO_MIN}
            max={BRUSH_RATIO_MAX}
            step={1}
            disabled={disabled}
            onValueChange={([value]) => setRatios((prev) => ({ ...prev, [tool]: value }))}
            aria-label={tool === "eraser" ? "지우개 크기" : "브러시 크기"}
          />
          <span className="w-8 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
            {ratios[tool]}%
          </span>
        </div>

        <div className="flex items-center">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={undo}
            disabled={disabled || strokeCount === 0}
            aria-label="되돌리기"
          >
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={clear}
            disabled={disabled || strokeCount === 0}
            aria-label="전체 지우기"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div
        className="relative mx-auto overflow-hidden rounded-xl border-2 border-border bg-muted/30"
        style={
          size
            ? {
                // 세로로 긴 사진이 화면을 다 먹지 않도록 높이를 기준으로 폭을 정한다.
                // 폭이 컬럼을 넘으면 max-width가 잡고 높이는 비율대로 줄어든다.
                aspectRatio: `${size.width} / ${size.height}`,
                width: `calc(min(55vh, 380px) * ${size.width / size.height})`,
                maxWidth: "100%",
              }
            : { minHeight: "10rem" }
        }
      >
        <Image
          src={src}
          alt="편집 영역 지정 대상"
          fill
          unoptimized
          draggable={false}
          className="pointer-events-none object-contain select-none"
        />
        <canvas
          ref={canvasRef}
          width={size?.width ?? 0}
          height={size?.height ?? 0}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endStroke}
          onPointerCancel={endStroke}
          onPointerEnter={moveCursor}
          onPointerLeave={() => {
            if (cursorRef.current) cursorRef.current.style.opacity = "0";
          }}
          className={`absolute inset-0 h-full w-full touch-none opacity-50 ${
            disabled ? "cursor-not-allowed" : "cursor-none"
          }`}
        />
        <div
          ref={cursorRef}
          aria-hidden
          className={`pointer-events-none absolute top-0 left-0 rounded-full border-2 border-white opacity-0 ${
            tool === "eraser" ? "border-dashed" : "bg-red-500/30"
          }`}
          // 흰 테두리 양쪽에 검은 선을 덧대 밝은 배경과 어두운 배경 모두에서 보이게 한다.
          style={{
            boxShadow:
              "0 0 0 1px rgba(0,0,0,0.85), inset 0 0 0 1px rgba(0,0,0,0.85)",
          }}
        />
      </div>
    </div>
  );
}
