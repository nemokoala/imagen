import * as fabric from "fabric";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useGetImageByIdQuery } from "@/queries/image/queries";
import { useSaveImageEditMutation } from "@/queries/image/mutations";
import { useUserStore } from "@/stores/userStore";
import { LabelTextbox } from "@/app/(page)/editor/[id]/label-textbox";

// 캔버스가 표시될 최대 크기 (원본 비율 유지하며 이 안에 맞춤)
const MAX_CANVAS_SIZE = 768;

fabric.InteractiveFabricObject.ownDefaults = {
  ...fabric.InteractiveFabricObject.ownDefaults,
  borderColor: "#3b82f6",
  cornerColor: "#ffffff",
  cornerStrokeColor: "#3b82f6",
  cornerStyle: "circle",
  transparentCorners: false,
  cornerSize: 15,
  touchCornerSize: 30,
};

/**
 * 이미지 편집기의 모든 fabric 로직을 중앙에서 관리하는 훅.
 *
 * - 상태(source of truth)는 fabric 캔버스가 보유한다.
 * - 외부에는 캔버스 ref와 명령형 액션만 노출한다.
 * - 저장은 canvas.toJSON()(재편집용) + toDataURL()(렌더 결과)을 함께 영속화한다.
 */
export function useFabricEditor(imageId: number) {
  const router = useRouter();
  const { user } = useUserStore();
  const { data: image } = useGetImageByIdQuery(imageId);
  const saveEdit = useSaveImageEditMutation(imageId);

  const canvasElRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const [ready, setReady] = useState(false);

  // ── React ↔ fabric 동기화 상태 ──────────────────────────────────────
  // 캔버스의 객체 목록(우측 리스트용)과 현재 선택 객체(하단 편집바용)를
  // fabric 이벤트로 미러링한다. fabric이 진실의 출처이고 여기는 거울일 뿐.
  const [objects, setObjects] = useState<fabric.FabricObject[]>([]);
  const [activeObject, setActiveObject] = useState<fabric.FabricObject | null>(
    null,
  );

  const syncObjects = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    // 배경 이미지는 backgroundImage라 getObjects()에 안 잡힘 → 추가 객체만 노출
    setObjects([...canvas.getObjects()]);
  }, []);

  const syncActive = useCallback(() => {
    const canvas = fabricRef.current;
    setActiveObject(canvas?.getActiveObject() ?? null);
  }, []);

  // 진입 가드: 본인 이미지가 아니면 토스트 후 메인으로 튕김
  useEffect(() => {
    if (!image || !user) return;
    if (image.userId !== user.id) {
      toast.error("이미지를 편집할 권한이 없습니다.");
      router.replace("/");
    }
  }, [image, user, router]);

  // 1) fabric 캔버스 초기화 (마운트 시 1회)
  useEffect(() => {
    if (!canvasElRef.current) return;

    const canvas = new fabric.Canvas(canvasElRef.current, {
      backgroundColor: "#1a1a1a",
      preserveObjectStacking: true,
    });
    fabricRef.current = canvas;
    setReady(true);

    // fabric → React 한 방향 동기화
    canvas.on("object:added", syncObjects);
    canvas.on("object:removed", syncObjects);
    canvas.on("selection:created", syncActive);
    canvas.on("selection:updated", syncActive);
    canvas.on("selection:cleared", syncActive);

    return () => {
      canvas.dispose();
      fabricRef.current = null;
    };
  }, [syncObjects, syncActive]);

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
        syncObjects(); // 복원된 객체를 리스트에 반영
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
  }, [ready, image?.imageUrl, image?.editData, syncObjects]);

  // ── 객체 추가 ────────────────────────────────────────────────────────
  const addText = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const text = new LabelTextbox("텍스트 입력", {
      left: 50,
      top: 50,
      fontSize: 36,
      fill: "#ffffff",
      labelBackgroundColor: "rgba(59,130,246,0.85)",
      padding: 12,
      bgRadius: 8,
    });
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.requestRenderAll();
  }, []);

  // 선택한 라벨 텍스트의 배경 속성 변경 (추후 속성 패널에서 사용)
  const setTextBackground = useCallback(
    (props: { color?: string; padding?: number; radius?: number }) => {
      const canvas = fabricRef.current;
      const obj = canvas?.getActiveObject();
      if (!canvas || !(obj instanceof LabelTextbox)) return;

      if (props.color !== undefined) obj.labelBackgroundColor = props.color;
      if (props.padding !== undefined) obj.padding = props.padding;
      if (props.radius !== undefined) obj.bgRadius = props.radius;

      obj.dirty = true;
      obj.setCoords(); // 컨트롤 박스(테두리/핸들) 좌표 즉시 재계산
      canvas.requestRenderAll();
    },
    [],
  );

  // ── 선택 / 속성 변경 (리스트·하단 편집바에서 사용) ──────────────────
  // 리스트 항목 클릭 → 해당 fabric 객체 선택. setActiveObject는 selection
  // 이벤트를 쏘지 않으므로 React 상태도 직접 맞춘다.
  const selectObject = useCallback((obj: fabric.FabricObject) => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    canvas.setActiveObject(obj);
    canvas.requestRenderAll();
    setActiveObject(obj);
  }, []);

  // 선택 객체에 임의의 fabric 속성 적용 (fill, stroke, fontSize 등 범용)
  const updateActiveObject = useCallback(
    (props: Record<string, unknown>) => {
      const canvas = fabricRef.current;
      const obj = canvas?.getActiveObject();
      if (!canvas || !obj) return;
      obj.set(props);
      obj.dirty = true;
      obj.setCoords(); // 지오메트리 변경 시 컨트롤 박스 좌표 즉시 재계산
      canvas.requestRenderAll();
    },
    [],
  );

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
      saveEdit.mutate(
        { editData, editedImage: blob },
        {
          onSuccess: () => toast.success("저장되었습니다."),
          onError: (error) => {
            const status = (error as { statusCode?: number })?.statusCode;
            if (status === 403) {
              toast.error("이미지를 편집할 권한이 없습니다.");
              router.replace("/");
              return;
            }
            toast.error("저장에 실패했습니다.");
          },
        },
      );
    }, "image/png");
  }, [saveEdit, router]);

  return {
    // refs / state
    canvasElRef,
    fabricRef,
    ready,
    image,
    objects,
    activeObject,
    isSaving: saveEdit.isPending,
    // actions
    selectObject,
    updateActiveObject,
    addText,
    setTextBackground,
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
