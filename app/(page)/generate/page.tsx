"use client";

import {
  type CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles, Download, Eye, Maximize2 } from "lucide-react";
import Image from "next/image";
import { Layout } from "@/components/layout/Layout";
import { useGenerateImageMutation } from "@/queries/image/mutations";
import { useHealthCheckQuery } from "@/queries/image/queries";
import { ModelSelect } from "@/components/image-gen/ModelSelect";
import { CreditDisplay } from "@/components/image-gen/CreditDisplay";
import { useGetUserCredit } from "@/queries/auth/queries";
import { useGetCreditSettingsQuery } from "@/queries/admin/creditSettings";
import { useQueryClient } from "@tanstack/react-query";
import {
  RecommendPrompt,
  RecommendPromptRef,
} from "@/components/image-gen/RecommendPrompt";
import { CategorySelect } from "@/components/image-gen/CategorySelect";
import { Model } from "@/types/model.interfaces";
import { ImageRatio } from "@/types/image.interfaces";
import { MODEL_RATIO_CONFIG } from "@/constants/model.constants";
import { MODEL_CREDIT_SETTINGS } from "@/constants/credit.constants";
import { cn, downloadImage } from "@/lib/utils";
import { FetchUtil } from "@/lib/Fetch.util";
import { useSuggestCategories } from "@/queries/category/mutations";
import Link from "next/link";
import { useScrollStore } from "@/stores/scrollStore";
import { ImageFullscreenViewer } from "@/components/common/ImageFullscreenViewer";
import { ImageEditForm } from "@/components/image-gen/ImageEditForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GenerationLoader } from "@/components/image-gen/GenerationLoader";

/** 캔버스 틀 크기를 계산할 때 쓰는 가로/세로 비 */
const RATIO_VALUE: Record<ImageRatio, number> = {
  [ImageRatio.RATIO_1_1]: 1,
  [ImageRatio.RATIO_16_9]: 16 / 9,
  [ImageRatio.RATIO_9_16]: 9 / 16,
};

export default function ImageGenPage() {
  const [activeTab, setActiveTab] = useState<"generate" | "edit">("generate");
  const [resultMode, setResultMode] = useState<"generate" | "edit">("generate");
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageId, setImageId] = useState<number | null>(null);
  const [generationProgress, setGenerationProgress] = useState<string | null>(
    null,
  );
  const [isStreaming, setIsStreaming] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [ratio, setRatio] = useState<ImageRatio>(ImageRatio.RATIO_1_1);
  const [displayRatio, setDisplayRatio] = useState<ImageRatio>(
    ImageRatio.RATIO_1_1,
  );
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);

  const queryClient = useQueryClient();
  const { setScrollPos } = useScrollStore();
  const resultImageRef = useRef<HTMLDivElement>(null);
  const recommendPromptRef = useRef<RecommendPromptRef>(null);

  const { data: stableHealthCheck, isLoading: isStableHealthCheckLoading } =
    useHealthCheckQuery({ target: "stable" });

  const { data: zimageHealthCheck, isLoading: isZimageHealthCheckLoading } =
    useHealthCheckQuery({ target: "zimage" });
  const { data: qwenHealthCheck, isLoading: isQwenHealthCheckLoading } =
    useHealthCheckQuery({ target: "qwen-image-21" });

  const { data: credit, isLoading: isCreditLoading } = useGetUserCredit();
  const {
    data: creditSettings,
    isLoading: isCreditSettingsLoading,
    error: creditSettingsError,
  } = useGetCreditSettingsQuery();

  const isCreditModelEnabled = useCallback(
    (modelValue: Model) => {
      const option = MODEL_CREDIT_SETTINGS[modelValue];
      return option && creditSettings
        ? creditSettings[option.enabledKey]
        : false;
    },
    [creditSettings],
  );

  // healthCheck에 따라 기본 모델 계산
  const defaultModel = useMemo(() => {
    if (
      stableHealthCheck?.healthy &&
      isCreditModelEnabled(Model.STABLE_DIFFUSION_XL)
    ) {
      return Model.STABLE_DIFFUSION_XL;
    }

    if (zimageHealthCheck?.healthy && isCreditModelEnabled(Model.Z_IMAGE)) {
      return Model.Z_IMAGE;
    }

    if (qwenHealthCheck?.healthy && isCreditModelEnabled(Model.QWEN_IMAGE_21)) {
      return Model.QWEN_IMAGE_21;
    }

    return (
      [Model.DALL_E_3, Model.GOOGLE_IMAGEN, Model.NANO_BANANA].find((item) =>
        isCreditModelEnabled(item),
      ) ?? Model.DALL_E_3
    );
  }, [
    stableHealthCheck?.healthy,
    zimageHealthCheck?.healthy,
    qwenHealthCheck?.healthy,
    isCreditModelEnabled,
  ]);

  // 사용자가 수동으로 선택한 모델 (없으면 기본 모델 사용)
  const [manualModel, setManualModel] = useState<Model | null>(null);

  // 실제 사용할 모델 (수동 선택이 있으면 그것을, 없으면 기본 모델 사용)
  const model = manualModel ?? defaultModel;
  const isSelectedModelEnabled = isCreditModelEnabled(model);
  const isSelectedModelHealthy =
    model === Model.STABLE_DIFFUSION_XL
      ? stableHealthCheck?.healthy === true
      : model === Model.Z_IMAGE
        ? zimageHealthCheck?.healthy === true
        : model === Model.QWEN_IMAGE_21
          ? qwenHealthCheck?.healthy === true
        : true;
  const isSelectedModelAvailable =
    isSelectedModelEnabled && isSelectedModelHealthy;

  const handleModelChange = (value: Model) => {
    setManualModel(value);
    // 변경된 모델이 현재 비율을 지원하지 않으면 1:1로 리셋
    const supported = MODEL_RATIO_CONFIG[value]?.supportedRatios ?? [];
    if (!supported.includes(ratio)) {
      setRatio(ImageRatio.RATIO_1_1);
    }
  };

  // AI 카테고리 추천
  const {
    mutate: suggestCategories,
    mutateAsync: suggestCategoriesAsync,
    isPending: isSuggestingCategories,
    isError: isSuggestingCategoriesError,
  } = useSuggestCategories((suggestedSlugs) => {
    if (suggestedSlugs.length > 0) {
      setSelectedCategories(suggestedSlugs);
    }
  });

  const handleClickRecommendPrompt = (prompt: string) => {
    suggestCategories(prompt);
    setPrompt(prompt);
  };

  const { mutate: generateImage, isPending: isMutationPending } =
    useGenerateImageMutation(
      (data) => {
        setImageUrl(data.imageUrl!);
        setImageId(data.id);
        setDisplayRatio(data.ratio ?? ratio);
        toast.success("이미지 생성 완료!", {
          description: "AI가 이미지를 생성했습니다.",
        });
        recommendPromptRef.current?.refresh(); // 추천 프롬프트 새로고침
        resultImageRef.current?.scrollIntoView({ behavior: "smooth" });
        queryClient.invalidateQueries({ queryKey: ["credit"] });
        queryClient.removeQueries({ queryKey: ["galleryImagesInfinite"] });
        queryClient.removeQueries({ queryKey: ["userImagesInfinite"] });
        setScrollPos(0);
      },
      (error) => {
        toast.error(error.message);
        queryClient.invalidateQueries({ queryKey: ["credit"] });
      },
    );

  const handleStreamGenerate = async (
    categories: string[],
    editForm?: FormData,
  ) => {
    try {
      setIsStreaming(true);
      setResultMode(editForm ? "edit" : "generate");
      setGenerationProgress("연결 중...");
      setImageUrl(null);
      setImageId(null);

      const response = editForm
        ? await FetchUtil.postRaw("/api/edit-image", editForm)
        : await FetchUtil.postRaw("/api/generate-image", {
            prompt,
            model,
            ratio,
            categories,
          });

      if (!response.ok) {
        let message = `HTTP error! status: ${response.status}`;

        try {
          const errorData = await response.json();
          message = errorData.message || message;
        } catch {
          // Ignore non-JSON error responses.
        }

        throw new Error(message);
      }

      if (!response.body) {
        throw new Error("Response body is empty");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;

        const lines = buffer.split("\n\n");
        buffer = lines.pop() || ""; // Incomplete line remains in buffer

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const dataStr = line.slice(6);
            try {
              const data = JSON.parse(dataStr);

              if (data.status === "progress") {
                setGenerationProgress(data.message);
              } else if (data.status === "complete") {
                setImageUrl(data.imageUrl);
                setImageId(data.id);
                setDisplayRatio(data.ratio ?? ratio);
                setGenerationProgress(null);
                toast.success(editForm ? "이미지 편집 완료!" : "이미지 생성 완료!", {
                  description: editForm
                    ? "편집한 이미지가 갤러리에 저장됐습니다."
                    : "AI가 이미지를 생성했습니다.",
                });
                recommendPromptRef.current?.refresh();
                resultImageRef.current?.scrollIntoView({ behavior: "smooth" });
                queryClient.invalidateQueries({ queryKey: ["credit"] });
                queryClient.removeQueries({
                  queryKey: ["galleryImagesInfinite"],
                });
                queryClient.removeQueries({ queryKey: ["userImagesInfinite"] });
                setScrollPos(0);
              } else if (data.status === "error" || data.status === "fail") {
                toast.error(
                  data.message || "이미지 생성 중 오류가 발생했습니다.",
                );
                return;
              }
            } catch (e) {
              console.error("JSON parse error", e);
            }
          }
        }
      }
    } catch (error: unknown) {
      toast.error(
        (error as Error)?.message || "이미지 생성 중 오류가 발생했습니다.",
      );
      setGenerationProgress(null);
    } finally {
      setIsStreaming(false);
      setGenerationProgress(null);
    }
  };

  const handleGenerate = async () => {
    if (isSuggestingCategories) return;

    if (!prompt.trim()) {
      toast.error("프롬프트를 입력해주세요", {
        description: "이미지 생성을 위한 설명을 입력해주세요.",
      });
      return;
    }

    if (isCreditSettingsLoading || creditSettingsError || !creditSettings) {
      toast.error("모델 설정을 불러올 수 없습니다", {
        description: "크레딧 설정을 확인한 뒤 다시 시도해주세요.",
      });
      return;
    }

    if (!isSelectedModelAvailable) {
      toast.error(
        isSelectedModelEnabled
          ? "현재 모델을 사용할 수 없습니다"
          : "현재 사용할 수 없는 모델입니다",
        {
          description: isSelectedModelEnabled
            ? "모델 서버 상태를 확인하거나 다른 모델을 선택해주세요."
            : "관리자 설정에서 비활성화된 모델입니다.",
        },
      );
      return;
    }

    // 크레딧 체크
    if (credit && credit < 1) {
      toast.error("크레딧이 부족합니다", {
        description: "이미지 생성을 위해 크레딧이 필요합니다.",
      });
      return;
    }

    // 카테고리 미선택 시 AI 추천 실행
    let categoriesToUse = selectedCategories;
    if (selectedCategories.length === 0) {
      try {
        const suggested = await suggestCategoriesAsync(prompt);
        if (suggested.length > 0) {
          categoriesToUse = suggested;
        }
      } catch {
        // 추천 실패해도 생성은 계속 진행
      }
    }

    if (
      model === Model.Z_IMAGE ||
      model === Model.QWEN_IMAGE_21 ||
      model === Model.STABLE_DIFFUSION_XL
    ) {
      await handleStreamGenerate(categoriesToUse);
    } else {
      setImageUrl(null);
      setImageId(null);
      generateImage({
        prompt,
        model,
        ratio,
        categories: categoriesToUse,
      });
    }
  };

  useEffect(() => {
    if (prompt.length === 0 && selectedCategories.length > 0) {
      setSelectedCategories([]);
    }
  }, [prompt, selectedCategories]);

  const isPending = isMutationPending || isStreaming;
  const handleImageEdit = async (form: FormData) => {
    await handleStreamGenerate([], form);
  };
  const isGenerateDisabled =
    isPending ||
    isSuggestingCategories ||
    !prompt.trim() ||
    (credit ?? 0) < 1 ||
    isCreditSettingsLoading ||
    Boolean(creditSettingsError) ||
    !creditSettings ||
    !isSelectedModelAvailable;

  const isModelStatusLoading =
    isStableHealthCheckLoading ||
    isZimageHealthCheckLoading ||
    isQwenHealthCheckLoading ||
    isCreditSettingsLoading;
  const selectedCreditCost =
    creditSettings && MODEL_CREDIT_SETTINGS[model]
      ? creditSettings[MODEL_CREDIT_SETTINGS[model].creditKey]
      : undefined;
  const generateHint =
    !isCreditLoading && (credit ?? 0) < 1
      ? "크레딧이 부족합니다. 다음 충전일까지 기다려주세요."
      : !isModelStatusLoading && creditSettings && !isSelectedModelAvailable
        ? "선택한 모델을 지금 쓸 수 없어요. 다른 모델을 골라주세요."
        : null;

  // 캔버스 틀은 결과가 있으면 결과 비율, 없으면 지금 고른 비율로 그린다.
  // 편집은 결과 비율을 미리 알 수 없으므로 1:1 틀을 쓴다.
  const canvasMode = isPending ? resultMode : activeTab;
  const frameRatio = imageUrl
    ? displayRatio
    : canvasMode === "edit"
      ? ImageRatio.RATIO_1_1
      : ratio;
  const frameStyle = { "--r": RATIO_VALUE[frameRatio] } as CSSProperties;
  // 틀이 캔버스 안에 가로·세로 모두 들어가도록 컨테이너 단위로 너비를 정한다.
  const frameClass =
    "aspect-[var(--r)] w-[min(100cqw,calc(68svh*var(--r)))] lg:w-[min(100cqw,calc(100cqh*var(--r)))]";
  const canvasTitle = isPending
    ? resultMode === "edit"
      ? "편집 중"
      : "생성 중"
    : imageUrl
      ? resultMode === "edit"
        ? "편집된 이미지"
        : "생성된 이미지"
      : "미리보기";

  return (
    <Layout.Content className="p-4 md:p-6 lg:overflow-hidden">
      <div className="mx-auto grid w-full max-w-[1600px] gap-4 lg:min-h-0 lg:flex-1 lg:grid-cols-[400px_minmax(0,1fr)] lg:grid-rows-[minmax(0,1fr)] lg:gap-6">
        {/* 설정 패널: 데스크톱에서는 안쪽만 스크롤되고 생성 버튼은 아래에 고정된다 */}
        <aside className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-card lg:min-h-0">
          <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
            <div className="min-w-0">
              <h1 className="text-lg font-semibold tracking-tight text-foreground">
                이미지 생성
              </h1>
              <p className="truncate text-xs text-muted-foreground">
                프롬프트를 쓰고 모델과 비율을 골라주세요
              </p>
            </div>
            <CreditDisplay credit={credit ?? 0} isLoading={isCreditLoading} />
          </div>

          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as "generate" | "edit")}
            className="flex min-h-0 flex-1 flex-col gap-0"
          >
            <div className="px-5 pt-4">
              <TabsList aria-label="이미지 작업 선택" className="h-10 w-full">
                <TabsTrigger value="generate" disabled={isPending}>
                  이미지 생성
                </TabsTrigger>
                <TabsTrigger value="edit" disabled={isPending}>
                  이미지 편집
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="generate" className="mt-0 flex min-h-0 flex-col">
              <div className="space-y-6 px-5 py-5 lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
                <div className="space-y-3">
                  <label
                    htmlFor="generate-prompt"
                    className="block text-sm font-medium text-subtitle"
                  >
                    프롬프트
                  </label>
                  <Textarea
                    id="generate-prompt"
                    placeholder="원하는 이미지를 자세히 설명해주세요... 예: 귀여운 고양이가 라면을 먹는 모습, 카툰 스타일, 밝은 색상"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-[120px] resize-none bg-background"
                    disabled={isPending}
                  />
                  <RecommendPrompt
                    ref={recommendPromptRef}
                    setPrompt={handleClickRecommendPrompt}
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-subtitle">AI 모델</p>
                  <ModelSelect
                    model={model}
                    setModel={handleModelChange}
                    stableHealthCheck={stableHealthCheck}
                    zimageHealthCheck={zimageHealthCheck}
                    qwenHealthCheck={qwenHealthCheck}
                    isStableHealthCheckLoading={isStableHealthCheckLoading}
                    isZimageHealthCheckLoading={isZimageHealthCheckLoading}
                    isQwenHealthCheckLoading={isQwenHealthCheckLoading}
                  />
                </div>

                {/* 비율 선택 */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-subtitle">비율</p>
                  <div
                    role="radiogroup"
                    aria-label="비율"
                    className="grid grid-cols-3 gap-1 rounded-lg bg-muted p-1"
                  >
                    {Object.values(ImageRatio).map((r) => {
                      const supported =
                        MODEL_RATIO_CONFIG[model]?.supportedRatios.includes(
                          r,
                        ) ?? true;
                      const isActive = ratio === r;
                      return (
                        <button
                          key={r}
                          type="button"
                          role="radio"
                          aria-checked={isActive}
                          onClick={() => setRatio(r)}
                          disabled={isPending || !supported}
                          className={cn(
                            "flex h-9 cursor-pointer items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40",
                            isActive
                              ? "bg-card text-foreground shadow-sm"
                              : "text-muted-foreground hover:text-foreground",
                          )}
                        >
                          {/* 비율 모양 아이콘 */}
                          <span
                            aria-hidden
                            className={cn(
                              "rounded-[3px] border-[1.5px] border-current",
                              r === ImageRatio.RATIO_16_9
                                ? "h-2.5 w-4"
                                : r === ImageRatio.RATIO_9_16
                                  ? "h-4 w-2.5"
                                  : "size-3.5",
                            )}
                          />
                          {r}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 카테고리 선택 */}
                <CategorySelect
                  selectedCategories={selectedCategories}
                  onCategoriesChange={setSelectedCategories}
                  disabled={isPending}
                  isSuggesting={isSuggestingCategories}
                  isSuggestingCategoriesError={isSuggestingCategoriesError}
                />
              </div>

              <div className="sticky bottom-0 border-t border-border bg-card/95 px-5 py-4 backdrop-blur-sm lg:static">
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerateDisabled}
                  className="h-11 w-full text-base font-semibold"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      생성 중...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      이미지 생성
                      {selectedCreditCost !== undefined && (
                        <span className="text-sm font-normal opacity-80">
                          · {selectedCreditCost} 크레딧
                        </span>
                      )}
                    </>
                  )}
                </Button>
                {generateHint && (
                  <p className="mt-2 text-center text-xs text-muted-foreground">
                    {generateHint}
                  </p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="edit" className="mt-0 flex min-h-0 flex-col">
              <ImageEditForm
                isPending={isPending}
                isAvailable={
                  qwenHealthCheck?.healthy === true &&
                  isCreditModelEnabled(Model.QWEN_IMAGE_21)
                }
                creditCost={creditSettings?.qwenImage21}
                onSubmit={handleImageEdit}
              />
            </TabsContent>
          </Tabs>
        </aside>

        {/* 결과 캔버스 */}
        <section
          ref={resultImageRef}
          aria-label="결과"
          className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-card lg:min-h-0"
        >
          <div className="flex min-h-14 flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b border-border px-5 py-2.5">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-foreground">
                {canvasTitle}
              </h2>
              {(imageUrl || canvasMode === "generate") && (
                <span className="rounded-full border border-border px-2 py-0.5 text-xs font-medium text-muted-foreground">
                  {frameRatio}
                </span>
              )}
            </div>

            {imageUrl && !isPending && (
              <div className="flex items-center gap-1.5">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsFullscreenOpen(true)}
                  aria-label="크게 보기"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => downloadImage(imageUrl)}
                >
                  <Download className="h-4 w-4" />
                  다운로드
                </Button>
                {imageId && (
                  <Button size="sm" asChild>
                    <Link href={`/image/${imageId}`}>
                      <Eye className="h-4 w-4" />
                      게시물 보기
                    </Link>
                  </Button>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center justify-center bg-muted/40 bg-[radial-gradient(circle,var(--color-border)_1px,transparent_1px)] bg-[length:20px_20px] p-4 [container-type:inline-size] md:p-6 lg:min-h-0 lg:flex-1 lg:p-8 lg:[container-type:size]">
            {isPending ? (
              <GenerationLoader
                message={generationProgress}
                mode={resultMode}
                className={frameClass}
                style={frameStyle}
              />
            ) : imageUrl ? (
              <button
                type="button"
                onClick={() => setIsFullscreenOpen(true)}
                aria-label="크게 보기"
                className={cn(
                  "relative cursor-zoom-in overflow-hidden rounded-2xl bg-background shadow-xl shadow-black/10 ring-1 ring-border animate-in fade-in zoom-in-95 duration-500",
                  frameClass,
                )}
                style={frameStyle}
              >
                <Image
                  src={imageUrl}
                  alt={resultMode === "edit" ? "편집된 이미지" : "생성된 이미지"}
                  fill
                  className={
                    resultMode === "edit" ? "object-contain" : "object-cover"
                  }
                  unoptimized
                />
              </button>
            ) : (
              <div
                className={cn(
                  "flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border bg-background/60 p-6 text-center",
                  frameClass,
                )}
                style={frameStyle}
              >
                <div className="flex size-12 items-center justify-center rounded-2xl bg-primary-soft">
                  <Sparkles className="size-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {activeTab === "edit"
                      ? "편집한 이미지가 여기에 표시됩니다"
                      : "생성한 이미지가 여기에 표시됩니다"}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {activeTab === "edit"
                      ? "원본 이미지를 올리고 편집 지시문을 입력해주세요."
                      : `${ratio} 비율로 만들어져요.`}
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      {imageUrl && (
        <ImageFullscreenViewer
          open={isFullscreenOpen}
          onOpenChange={setIsFullscreenOpen}
          src={imageUrl}
          alt="생성된 이미지 전체보기"
          ratio={displayRatio}
        />
      )}
    </Layout.Content>
  );
}
