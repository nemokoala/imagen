import * as fabric from "fabric";
import { useCallback, useEffect, useRef, useState } from "react";
import { useGetImageByIdQuery } from "@/queries/image/queries";
import { useSaveImageEditMutation } from "@/queries/image/mutations";

// 캔버스가 표시될 최대 크기 (원본 비율 유지하며 이 안에 맞춤)
const MAX_CANVAS_SIZE = 768;

/**
 * 이미지 편집기의 모든 fabric 로직을 중앙에서 관리하는 훅.
 *
 * - 상태(source of truth)는 fabric 캔버스가 보유한다.
 * - 외부에는 캔버스 ref와 명령형 액션만 노출한다.
 * - 저장은 canvas.toJSON()(재편집용) + toDataURL()(렌더 결과)을 함께 영속화한다.
 */
export function useFabricEditor(imageId: number) {
  const { data: image } = useGetImageByIdQuery(imageId);
  const saveEdit = useSaveImageEditMutation(imageId);

  const canvasElRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const [ready, setReady] = useState(false);

  // 1) fabric 캔버스 초기화 (마운트 시 1회)
  useEffect(() => {
    if (!canvasElRef.current) return;

    const canvas = new fabric.Canvas(canvasElRef.current, {
      backgroundColor: "#1a1a1a",
      preserveObjectStacking: true,
    });
    fabricRef.current = canvas;
    setReady(true);

    return () => {
      canvas.dispose();
      fabricRef.current = null;
    };
  }, []);

  // 2) 이미지 로드: 저장된 편집본(editData)이 있으면 복원, 없으면 원본을 배경으로
  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas || !ready || !image?.imageUrl) return;

    let cancelled = false;

    (async () => {
      const img = await fabric.FabricImage.fromURL(image.imageUrl, {
        crossOrigin: "anonymous",
      });
      if (cancelled || !fabricRef.current) return;

      // 원본 비율 유지하며 MAX_CANVAS_SIZE 안에 맞춤
      const natW = img.width ?? MAX_CANVAS_SIZE;
      const natH = img.height ?? MAX_CANVAS_SIZE;
      const scale = Math.min(MAX_CANVAS_SIZE / natW, MAX_CANVAS_SIZE / natH);
      const w = Math.round(natW * scale);
      const h = Math.round(natH * scale);

      canvas.setDimensions({ width: w, height: h });

      if (image.editData) {
        // 이전에 저장한 편집 상태 복원
        await canvas.loadFromJSON(image.editData);
        canvas.requestRenderAll();
        return;
      }

      // 배경 이미지로 깔기 (편집 불가 객체)
      img.scale(scale);
      img.set({ selectable: false, evented: false });
      canvas.backgroundImage = img;
      canvas.requestRenderAll();
    })();

    return () => {
      cancelled = true;
    };
  }, [ready, image?.imageUrl, image?.editData]);

  // ── 객체 추가 ────────────────────────────────────────────────────────
  const addText = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const text = new fabric.IText("텍스트 입력", {
      left: 50,
      top: 50,
      fontSize: 36,
      fill: "#ffffff",
    });
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.requestRenderAll();
  }, []);

  const addRect = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const rect = new fabric.Rect({
      left: 80,
      top: 80,
      width: 160,
      height: 120,
      fill: "rgba(0,0,0,0)",
      stroke: "#ff4d4d",
      strokeWidth: 3,
    });
    canvas.add(rect);
    canvas.setActiveObject(rect);
    canvas.requestRenderAll();
  }, []);

  const deleteSelected = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    canvas.getActiveObjects().forEach((o) => canvas.remove(o));
    canvas.discardActiveObject();
    canvas.requestRenderAll();
  }, []);

  // ── z-order (선택 객체) ──────────────────────────────────────────────
  const bringToFront = useCallback(() => {
    const canvas = fabricRef.current;
    const obj = canvas?.getActiveObject();
    if (!canvas || !obj) return;
    canvas.bringObjectToFront(obj);
    canvas.requestRenderAll();
  }, []);

  const sendToBack = useCallback(() => {
    const canvas = fabricRef.current;
    const obj = canvas?.getActiveObject();
    if (!canvas || !obj) return;
    canvas.sendObjectToBack(obj);
    canvas.requestRenderAll();
  }, []);

  const bringForward = useCallback(() => {
    const canvas = fabricRef.current;
    const obj = canvas?.getActiveObject();
    if (!canvas || !obj) return;
    canvas.bringObjectForward(obj);
    canvas.requestRenderAll();
  }, []);

  const sendBackwards = useCallback(() => {
    const canvas = fabricRef.current;
    const obj = canvas?.getActiveObject();
    if (!canvas || !obj) return;
    canvas.sendObjectBackwards(obj);
    canvas.requestRenderAll();
  }, []);

  // ── 저장: 캔버스 렌더 결과(PNG blob) + JSON 모두 저장 ──────────────
  const save = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    canvas.discardActiveObject();
    canvas.requestRenderAll();

    const editData = JSON.stringify(canvas.toJSON());

    // multiplier 인자로 추후 원본 해상도 출력 확장 가능
    const exported = canvas.toCanvasElement();
    exported.toBlob((blob) => {
      if (!blob) return;
      saveEdit.mutate({ editData, editedImage: blob });
    }, "image/png");
  }, [saveEdit]);

  return {
    // refs / state
    canvasElRef,
    fabricRef,
    ready,
    image,
    isSaving: saveEdit.isPending,
    // actions
    addText,
    addRect,
    deleteSelected,
    bringToFront,
    sendToBack,
    bringForward,
    sendBackwards,
    save,
  };
}

export type FabricEditor = ReturnType<typeof useFabricEditor>;
