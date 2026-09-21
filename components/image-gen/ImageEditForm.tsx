"use client";

import { useState } from "react";
import Image from "next/image";
import { ClipboardPaste, Loader2, Sparkles, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface ImageEditFormProps {
  isPending: boolean;
  isAvailable: boolean;
  creditCost?: number;
  onSubmit: (form: FormData) => Promise<void>;
}

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"];

export function ImageEditForm({
  isPending,
  isAvailable,
  creditCost,
  onSubmit,
}: ImageEditFormProps) {
  const [source, setSource] = useState<File | null>(null);
  const [sourcePreview, setSourcePreview] = useState<string | null>(null);
  const [reference, setReference] = useState<File | null>(null);
  const [referencePreview, setReferencePreview] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");

  const selectFile = (file: File | undefined, isReference: boolean) => {
    if (!file) return;
    if (!ALLOWED_TYPES.includes(file.type) || file.size > MAX_IMAGE_BYTES) {
      toast.error("PNG, JPEG, WebP 형식의 10MB 이하 이미지를 선택해주세요.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (isReference) {
        setReference(file);
        setReferencePreview(String(reader.result));
      } else {
        setSource(file);
        setSourcePreview(String(reader.result));
      }
    };
    reader.readAsDataURL(file);
  };

  const pasteFromClipboard = async (isReference: boolean) => {
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
    if (!reference && prompt.includes("<image2>")) {
      toast.error("<image2>를 사용하려면 참고 이미지를 추가해주세요.");
      return;
    }
    const form = new FormData();
    form.append("source", source);
    if (reference) form.append("reference", reference);
    form.append("prompt", prompt.trim());
    await onSubmit(form);
  };

  const filePicker = (
    id: string,
    label: string,
    preview: string | null,
    file: File | null,
    isReference: boolean,
  ) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-medium text-subtitle">
          {label}
        </label>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={isPending}
            onClick={() => void pasteFromClipboard(isReference)}
            aria-label={`${label}에 클립보드 이미지 붙여넣기`}
          >
            <ClipboardPaste className="h-4 w-4" /> 붙여넣기
          </Button>
          {isReference && file && (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              disabled={isPending}
              onClick={() => {
                setReference(null);
                setReferencePreview(null);
              }}
            >
              <X className="h-4 w-4" /> 제거
            </Button>
          )}
        </div>
      </div>
      <label
        htmlFor={id}
        className="flex min-h-40 cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-border bg-muted/30 transition-colors hover:border-purple-400 hover:bg-purple-500/5"
      >
        {preview ? (
          <Image
            src={preview}
            alt={label}
            width={320}
            height={240}
            unoptimized
            className="max-h-56 w-full object-contain"
          />
        ) : (
          <span className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
            <Upload className="h-6 w-6" />
            {isReference ? "선택 사항: 참고 이미지 추가" : "편집할 이미지 선택"}
          </span>
        )}
      </label>
      <input
        id={id}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="sr-only"
        disabled={isPending}
        onChange={(event) => selectFile(event.target.files?.[0], isReference)}
      />
      {file && <p className="truncate text-xs text-muted-foreground">{file.name}</p>}
    </div>
  );

  return (
    <Card className="border-0 bg-card/80 shadow-xl ring-1 ring-black/5 backdrop-blur-sm dark:ring-white/10">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold">이미지 편집 설정</CardTitle>
        <p className="text-sm text-muted-foreground">
          Qwen Image 2.1 로컬 모델로 이미지를 편집합니다.
          {creditCost !== undefined && ` · ${creditCost} 크레딧`}
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        {filePicker("edit-source", "원본 이미지", sourcePreview, source, false)}
        {filePicker("edit-reference", "참고 이미지", referencePreview, reference, true)}
        <div className="space-y-2">
          <label htmlFor="edit-prompt" className="text-sm font-medium text-subtitle">
            편집 지시문
          </label>
          <Textarea
            id="edit-prompt"
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="예: 인물은 유지하고 배경을 햇빛이 드는 온실로 바꿔줘. 참고 이미지를 쓸 때는 <image2>라고 적어주세요."
            className="min-h-28 resize-none border-2 focus:border-purple-500"
            disabled={isPending}
          />
        </div>
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={isPending || !isAvailable || !source || !prompt.trim()}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700"
        >
          {isPending ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" />편집 중...</>
          ) : (
            <><Sparkles className="mr-2 h-4 w-4" />이미지 편집</>
          )}
        </Button>
        {!isAvailable && (
          <p className="text-center text-xs text-muted-foreground">
            Qwen Image 2.1 모델 설정 또는 ComfyUI 연결을 확인해주세요.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
