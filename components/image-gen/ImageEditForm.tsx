"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  ClipboardPaste,
  Clock,
  ImagePlus,
  Loader2,
  Plus,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { MaskCanvas, type MaskCanvasHandle } from "@/components/image-gen/MaskCanvas";
import { useGetPromptTranslationQuery } from "@/queries/admin/llmSettings";
import { MAX_REFERENCE_IMAGES } from "@/constants/model.constants";
import { toast } from "sonner";

interface ImageEditFormProps {
  isPending: boolean;
  /** 관리자가 모델을 켜 두었는지 */
  isAvailable: boolean;
  /** AI 서버가 꺼져 있으면 대기열에 넣어 두고 켜질 때 편집한다. */
  isOffline?: boolean;
  creditCost?: number;
  onSubmit: (form: FormData) => Promise<void>;
}

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"];

const SOURCE_INPUT_ID = "edit-source";
const REFERENCE_INPUT_ID = "edit-reference";

interface ReferenceImage {
  file: File;
  preview: string;
}

export function ImageEditForm({
  isPending,
  isAvailable,
  isOffline = false,
  creditCost,
  onSubmit,
}: ImageEditFormProps) {
  const [source, setSource] = useState<File | null>(null);
  const [sourcePreview, setSourcePreview] = useState<string | null>(null);
  const [references, setReferences] = useState<ReferenceImage[]>([]);
  const [prompt, setPrompt] = useState("");
  const [maskEnabled, setMaskEnabled] = useState(false);
  const [hasMask, setHasMask] = useState(false);
  const maskRef = useRef<MaskCanvasHandle>(null);

  const { data: promptTranslation } = useGetPromptTranslationQuery();
  // 번역이 꺼져 있으면 지시문이 원문 그대로 모델에 전달된다. Qwen은 한국어 지시문을
  // 거의 따르지 못하므로 이때만 영어 입력을 권한다.
  const recommendEnglish = promptTranslation?.translateEnabled === false;

  const selectFile = (file: File | undefined, isReference: boolean) => {
    if (!file) return;
    if (!ALLOWED_TYPES.includes(file.type) || file.size > MAX_IMAGE_BYTES) {
      toast.error("PNG, JPEG, WebP 형식의 10MB 이하 이미지를 선택해주세요.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (isReference) {
        setReferences((prev) =>
          prev.length >= MAX_REFERENCE_IMAGES
            ? prev
            : [...prev, { file, preview: String(reader.result) }],
        );
      } else {
        setSource(file);
        setSourcePreview(String(reader.result));
        setHasMask(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const pasteFromClipboard = async (isReference: boolean) => {
    if (isReference && references.length >= MAX_REFERENCE_IMAGES) {
      toast.error(`참고 이미지는 최대 ${MAX_REFERENCE_IMAGES}장까지 추가할 수 있습니다.`);
      return;
    }
    if (!navigator.clipboard?.read) {
      toast.error("이 브라우저에서는 클립보드 이미지 읽기를 지원하지 않습니다.");
      return;
    }

    try {
      const items = await navigator.clipboard.read();
      for (const item of items) {
        const type = item.types.find((value) => ALLOWED_TYPES.includes(value));
        if (!type) continue;

        const blob = await item.getType(type);
        const extension = type === "image/jpeg" ? "jpg" : type.split("/")[1];
        selectFile(
          new File([blob], `clipboard-image.${extension}`, { type }),
          isReference,
        );
        return;
      }
      toast.error("클립보드에 PNG, JPEG 또는 WebP 이미지가 없습니다.");
    } catch {
      toast.error("클립보드 이미지를 읽지 못했습니다. 브라우저 권한을 확인해주세요.");
    }
  };

  const handleSubmit = async () => {
    if (!source || !prompt.trim()) return;
    // <image1>은 원본이므로 참고 이미지는 <image2>부터 번호가 붙는다.
    const missingSlot = [...prompt.matchAll(/<image(\d+)>/g)]
      .map((match) => Number(match[1]))
      .find((index) => index > references.length + 1);
    if (missingSlot !== undefined) {
      toast.error(
        `<image${missingSlot}>를 사용하려면 참고 이미지를 ${missingSlot - 1}장 이상 추가해주세요.`,
      );
      return;
    }
    const form = new FormData();
    form.append("source", source);
    for (const item of references) form.append("reference", item.file);
    if (maskEnabled) {
      const mask = await maskRef.current?.exportMask();
      if (!mask) {
        toast.error("편집할 영역을 브러시로 칠해주세요.");
        return;
      }
      form.append("mask", mask);
    }
    form.append("prompt", prompt.trim());
    await onSubmit(form);
  };

  const openPicker = (id: string) => document.getElementById(id)?.click();

  /** 여러 장을 한 번에 고를 수 있게 하되, 읽기 완료 순서가 아니라 고른 순서대로 붙인다. */
  const selectReferenceFiles = async (files: FileList) => {
    for (const file of Array.from(files)) {
      if (references.length >= MAX_REFERENCE_IMAGES) break;
      if (!ALLOWED_TYPES.includes(file.type) || file.size > MAX_IMAGE_BYTES) {
        toast.error("PNG, JPEG, WebP 형식의 10MB 이하 이미지를 선택해주세요.");
        continue;
      }
      const preview = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
      }).catch(() => null);
      if (!preview) continue;
      setReferences((prev) =>
        prev.length >= MAX_REFERENCE_IMAGES ? prev : [...prev, { file, preview }],
      );
    }
  };

  const fileInput = (id: string, isReference: boolean) => (
    <input
      id={id}
      type="file"
      accept="image/png,image/jpeg,image/webp"
      multiple={isReference}
      className="sr-only"
      disabled={isPending}
      onChange={(event) => {
        const { files } = event.target;
        if (files?.length) {
          if (isReference) void selectReferenceFiles(files);
          else selectFile(files[0], false);
        }
        event.target.value = "";
      }}
    />
  );

  const sectionLabel = (text: string, hint?: string) => (
    <span className="text-sm font-medium text-subtitle">
      {text}
      {hint && <span className="ml-1.5 text-xs font-normal text-muted-foreground">{hint}</span>}
    </span>
  );

  return (
    <>
      {/* 생성 패널 안에서 쓰인다: 데스크톱에서는 이 영역만 스크롤되고 제출 버튼은 아래에 고정된다 */}
      <div className="space-y-4 px-5 py-5 lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
        {/* 원본 이미지 */}
        <section className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            {sectionLabel("원본 이미지")}
            <div className="flex items-center gap-1">
              <Button
                type="button"
                size="sm"
                variant="ghost"
                disabled={isPending}
                onClick={() => void pasteFromClipboard(false)}
              >
                <ClipboardPaste className="h-4 w-4" /> 붙여넣기
              </Button>
              {source && (
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  disabled={isPending}
                  onClick={() => openPicker(SOURCE_INPUT_ID)}
                >
                  <ImagePlus className="h-4 w-4" /> 변경
                </Button>
              )}
            </div>
          </div>

          {sourcePreview && maskEnabled ? (
            <MaskCanvas
              ref={maskRef}
              src={sourcePreview}
              disabled={isPending}
              onPaintedChange={setHasMask}
            />
          ) : (
            <button
              type="button"
              disabled={isPending}
              onClick={() => openPicker(SOURCE_INPUT_ID)}
              className="flex min-h-32 w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-border bg-muted/30 transition-colors hover:border-primary/50 hover:bg-primary-soft/40"
            >
              {sourcePreview ? (
                <Image
                  src={sourcePreview}
                  alt="원본 이미지"
                  width={640}
                  height={480}
                  unoptimized
                  className="max-h-[min(50vh,360px)] w-full object-contain"
                />
              ) : (
                <span className="flex flex-col items-center gap-2 py-8 text-sm text-muted-foreground">
                  <Upload className="h-6 w-6" />
                  이미지 선택
                </span>
              )}
            </button>
          )}
          {fileInput(SOURCE_INPUT_ID, false)}

          <label
            htmlFor="edit-mask-toggle"
            className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-border/70 px-3 py-2"
          >
            <span className="text-sm text-subtitle">칠한 곳만 편집</span>
            <Switch
              id="edit-mask-toggle"
              checked={maskEnabled}
              disabled={isPending || !source}
              onCheckedChange={(checked) => {
                setMaskEnabled(checked);
                if (!checked) setHasMask(false);
              }}
            />
          </label>
        </section>

        {/* 참고 이미지 (선택, 최대 MAX_REFERENCE_IMAGES장) */}
        <section className="space-y-2">
          {references.length > 0 && (
            <>
              <div className="flex items-center justify-between gap-2">
                {sectionLabel("참고 이미지", `${references.length}/${MAX_REFERENCE_IMAGES}`)}
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  disabled={isPending}
                  onClick={() => void pasteFromClipboard(true)}
                >
                  <ClipboardPaste className="h-4 w-4" /> 붙여넣기
                </Button>
              </div>
              <ul className="space-y-1.5">
                {references.map((item, index) => (
                  <li
                    key={item.preview}
                    className="flex items-center gap-3 rounded-lg border border-border/70 p-2"
                  >
                    <Image
                      src={item.preview}
                      alt={`참고 이미지 ${index + 2}`}
                      width={96}
                      height={96}
                      unoptimized
                      className="h-12 w-12 shrink-0 rounded-md object-cover"
                    />
                    {/* 지시문에서 이 이미지를 가리킬 때 쓰는 이름. 썸네일로 구분되므로 파일 이름은 두지 않는다. */}
                    <p className="min-w-0 flex-1 font-mono text-xs text-subtitle">
                      {`<image${index + 2}>`}
                    </p>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      disabled={isPending}
                      aria-label={`참고 이미지 ${index + 2} 제거`}
                      onClick={() =>
                        setReferences((prev) => prev.filter((_, i) => i !== index))
                      }
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            </>
          )}
          {references.length < MAX_REFERENCE_IMAGES && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isPending}
              onClick={() => openPicker(REFERENCE_INPUT_ID)}
              className="w-full border-dashed text-muted-foreground"
            >
              <Plus className="h-4 w-4" />
              참고 이미지 추가
            </Button>
          )}
          {fileInput(REFERENCE_INPUT_ID, true)}
        </section>

        {/* 편집 지시문 */}
        <section className="space-y-2">
          <label htmlFor="edit-prompt" className="block text-sm font-medium text-subtitle">
            편집 지시문
          </label>
          <Textarea
            id="edit-prompt"
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder={
              recommendEnglish
                ? maskEnabled
                  ? "e.g. Replace it with a white star"
                  : references.length > 0
                    ? "e.g. Dress the person in the outfit from <image2>"
                    : "e.g. Change the background to a greenhouse"
                : maskEnabled
                  ? "예: 흰색 별무늬로 바꿔줘"
                  : references.length > 0
                    ? "예: 인물에게 <image2>의 옷을 입혀줘"
                    : "예: 배경을 온실로 바꿔줘"
            }
            className="min-h-24 resize-none bg-background"
            disabled={isPending}
          />
          {recommendEnglish && (
            <p className="text-xs text-muted-foreground">영어로 적으면 더 잘 따라요.</p>
          )}
        </section>
      </div>

      {/* 제출 - 마스크 캔버스가 길어도 버튼이 화면에 남도록 고정한다. */}
      <div className="sticky bottom-0 border-t border-border bg-card/95 px-5 py-4 backdrop-blur-sm lg:static">
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={
            isPending ||
            !isAvailable ||
            !source ||
            !prompt.trim() ||
            (maskEnabled && !hasMask)
          }
          className="h-11 w-full text-base font-semibold"
        >
          {isPending ? (
            <><Loader2 className="h-4 w-4 animate-spin" />편집 중...</>
          ) : (
            <>
              {isOffline ? <Clock className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
              {isOffline ? "대기열에 추가" : "이미지 편집"}
              {creditCost !== undefined && (
                <span className="text-sm font-normal opacity-80">
                  · {creditCost} 크레딧
                </span>
              )}
            </>
          )}
        </Button>
        {(!isAvailable || isOffline || (maskEnabled && !hasMask)) && (
          <p className="mt-2 text-center text-xs text-muted-foreground">
            {!isAvailable
              ? "지금은 편집을 쓸 수 없어요."
              : maskEnabled && !hasMask
                ? "바꿀 곳을 칠해주세요."
                : "서버가 켜지면 순서대로 편집돼요."}
          </p>
        )}
      </div>
    </>
  );
}
