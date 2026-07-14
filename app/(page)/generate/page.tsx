"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles, Download, Eye } from "lucide-react";
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
import { cn, downloadImage, getRatio } from "@/lib/utils";
import { FetchUtil } from "@/lib/Fetch.util";
import { useSuggestCategories } from "@/queries/category/mutations";
import Link from "next/link";
import { useScrollStore } from "@/stores/scrollStore";
import { ImageFullscreenViewer } from "@/components/common/ImageFullscreenViewer";

export default function ImageGenPage() {
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

    return (
      [Model.DALL_E_3, Model.GOOGLE_IMAGEN, Model.NANO_BANANA].find((item) =>
        isCreditModelEnabled(item),
      ) ?? Model.DALL_E_3
    );
  }, [
    stableHealthCheck?.healthy,
    zimageHealthCheck?.healthy,
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

  const handleStreamGenerate = async (categories: string[]) => {
    try {
      setIsStreaming(true);
      setGenerationProgress("연결 중...");
      setImageUrl(null);
      setImageId(null);

      const response = await FetchUtil.postRaw("/api/generate-image", {
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
                toast.success("이미지 생성 완료!", {
                  description: "AI가 이미지를 생성했습니다.",
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

    if (model === Model.Z_IMAGE || model === Model.STABLE_DIFFUSION_XL) {
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
  const isGenerateDisabled =
    isPending ||
    isSuggestingCategories ||
    !prompt.trim() ||
    (credit ?? 0) < 1 ||
    isCreditSettingsLoading ||
    Boolean(creditSettingsError) ||
    !creditSettings ||
    !isSelectedModelAvailable;

  const getPreviewStyle = (targetRatio: ImageRatio) => ({
    aspectRatio:
      targetRatio === ImageRatio.RATIO_9_16
        ? "9/16"
        : targetRatio === ImageRatio.RATIO_16_9
          ? "16/9"
          : "1/1",
    maxHeight: "min(70dvh, 620px)",
    maxWidth:
      targetRatio === ImageRatio.RATIO_9_16
        ? "min(calc(70dvh * 9 / 16), 349px)"
        : targetRatio === ImageRatio.RATIO_1_1
          ? "min(70dvh, 620px)"
          : "100%",
    width: "100%",
  });

  return (
    <Layout.Content className="p-4 gap-4 md:gap-8 md:p-8">
      {/* 크레딧 정보 섹션 */}
      <div className="container flex flex-col gap-4 md:gap-6 max-w-7xl mx-auto">
        <CreditDisplay credit={credit ?? 0} isLoading={isCreditLoading} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
          {/* 입력 섹션 */}
          <Card className="shadow-xl border-0 bg-background/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold text-foreground">
                이미지 생성 설정
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-3">
                  <p className="text-sm font-medium text-subtitle mb-2">
                    프롬프트
                  </p>
                  <Textarea
                    placeholder="원하는 이미지를 자세히 설명해주세요... 예: 귀여운 고양이가 라면을 먹는 모습, 카툰 스타일, 밝은 색상"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-[120px] resize-none border-2 focus:border-purple-500 transition-colors"
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
                    isStableHealthCheckLoading={isStableHealthCheckLoading}
                    isZimageHealthCheckLoading={isZimageHealthCheckLoading}
                  />
                </div>

                {/* 비율 선택 */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-subtitle">비율</p>
                  <div className="flex gap-2">
                    {Object.values(ImageRatio).map((r) => {
                      const supported =
                        MODEL_RATIO_CONFIG[model]?.supportedRatios.includes(
                          r,
                        ) ?? true;
                      const isActive = ratio === r;
                      return (
                        <Button
                          key={r}
                          type="button"
                          variant={isActive ? "gradient" : "outline"}
                          onClick={() => setRatio(r)}
                          disabled={isPending || !supported}
                          className={`flex-1 ${isActive ? " text-white" : ""} transition-all duration-200`}
                        >
                          {r}
                        </Button>
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

              <div className="flex gap-3">
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerateDisabled}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-3 rounded-lg transition-all duration-200 transform disabled:transform-none disabled:opacity-50"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      생성 중...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      이미지 생성
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 결과 섹션 */}
          <Card
            ref={resultImageRef}
            className="overflow-hidden border-0 bg-background/85 py-0 shadow-xl ring-1 ring-black/5 backdrop-blur-sm dark:ring-white/10"
          >
            <CardHeader className="border-b border-border/60 px-5 py-4 md:px-6">
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="text-lg font-semibold text-foreground md:text-xl">
                  생성된 이미지
                </CardTitle>
                <span className="rounded-full border border-border/70 bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
                  {imageUrl ? displayRatio : ratio}
                </span>
              </div>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col p-0">
              {imageUrl ? (
                <div className="flex flex-1 flex-col">
                  <div className="flex min-h-[360px] flex-1 items-center justify-center bg-[linear-gradient(135deg,rgba(15,23,42,0.04)_0%,rgba(99,102,241,0.08)_45%,rgba(255,255,255,0.35)_100%)] p-3 dark:bg-[linear-gradient(135deg,rgba(15,23,42,0.72)_0%,rgba(67,56,202,0.25)_45%,rgba(15,23,42,0.85)_100%)] md:p-5">
                    <div
                      className={cn(
                        "relative mx-auto cursor-zoom-in overflow-hidden rounded-2xl bg-background shadow-2xl shadow-slate-950/15 ring-1 ring-black/10 dark:ring-white/10",
                        getRatio(displayRatio),
                      )}
                      style={getPreviewStyle(displayRatio)}
                      onClick={() => setIsFullscreenOpen(true)}
                    >
                      <Image
                        src={imageUrl}
                        alt="생성된 이미지"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 border-t border-border/60 bg-background/95 p-3 md:p-4">
                    <Button
                      onClick={() => downloadImage(imageUrl)}
                      variant="outline"
                      className="h-11 border-purple-200 text-purple-500 hover:bg-purple-50 dark:border-purple-900/60 dark:hover:bg-purple-950/30"
                    >
                      <Download className="mr-1 h-4 w-4" />
                      다운로드
                    </Button>
                    {imageId && (
                      <Button
                        asChild
                        variant="outline"
                        className="h-11 border-blue-200 text-blue-500 hover:bg-blue-50 dark:border-blue-900/60 dark:hover:bg-blue-950/30"
                      >
                        <Link href={`/image/${imageId}`}>
                          <Eye className="mr-1 h-4 w-4" />
                          게시물 보기
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              ) : isPending ? (
                <div className="flex flex-1 flex-col">
                  <div className="flex min-h-[360px] flex-1 items-center justify-center bg-muted/40 p-3 md:p-5">
                    <div
                      className="aurora-bg relative mx-auto overflow-hidden rounded-2xl shadow-2xl shadow-slate-950/10 ring-1 ring-black/10 dark:ring-white/10"
                      style={getPreviewStyle(ratio)}
                    >
                      {/* 부드러운 노이즈 오버레이 */}
                      <div className="absolute inset-0 bg-black/10" />
                      {/* 중앙 글로우 */}
                      <div
                        className="absolute inset-0"
                        style={{
                          background:
                            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255,255,255,0.12) 0%, transparent 70%)",
                        }}
                      />
                      {/* 텍스트 */}
                      <div className="absolute inset-x-6 bottom-6 rounded-xl border border-white/20 bg-black/20 px-4 py-3 text-center text-sm font-medium text-white/90 shadow-lg backdrop-blur-md">
                        {generationProgress ?? "이미지를 생성하는 중입니다"}
                      </div>
                    </div>
                  </div>

                  <div
                    aria-hidden="true"
                    className="invisible grid grid-cols-2 gap-2 border-t border-border/60 bg-background/95 p-3 md:p-4"
                  >
                    <div className="h-11" />
                    <div className="h-11" />
                  </div>
                </div>
              ) : (
                <div className="flex flex-1 flex-col">
                  <div className="flex min-h-[360px] flex-1 items-center justify-center bg-muted/35 p-6">
                    <div className="flex max-w-sm flex-col items-center text-center text-muted-foreground">
                      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-background shadow-sm">
                        <Sparkles className="h-8 w-8 text-purple-400" />
                      </div>
                      <p className="mb-2 text-base font-semibold text-foreground">
                        이미지가 생성되면 여기에 표시됩니다
                      </p>
                      <p className="text-sm">
                        프롬프트와 비율을 선택한 뒤 생성 버튼을 눌러주세요.
                      </p>
                    </div>
                  </div>

                  <div
                    aria-hidden="true"
                    className="invisible grid grid-cols-2 gap-2 border-t border-border/60 bg-background/95 p-3 md:p-4"
                  >
                    <div className="h-11" />
                    <div className="h-11" />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
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
