"use client";

import { useMemo, useRef, useState } from "react";
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
import { useQueryClient } from "@tanstack/react-query";
import {
  RecommendPrompt,
  RecommendPromptRef,
} from "@/components/image-gen/RecommendPrompt";
import { CategorySelect } from "@/components/image-gen/CategorySelect";
import { Model } from "@/types/model.interfaces";
import { ImageRatio } from "@/types/image.interfaces";
import { MODEL_RATIO_CONFIG } from "@/constants/model.constants";
import { cn, downloadImage, getRatio } from "@/lib/utils";
import { FetchUtil } from "@/lib/Fetch.util";
import { useSuggestCategories } from "@/queries/category/mutations";
import Link from "next/link";

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

  const queryClient = useQueryClient();
  const resultImageRef = useRef<HTMLDivElement>(null);
  const recommendPromptRef = useRef<RecommendPromptRef>(null);

  const { data: stableHealthCheck, isLoading: isStableHealthCheckLoading } =
    useHealthCheckQuery({ target: "stable" });

  const { data: zimageHealthCheck, isLoading: isZimageHealthCheckLoading } =
    useHealthCheckQuery({ target: "zimage" });

  const { data: credit, isLoading: isCreditLoading } = useGetUserCredit();

  // healthCheck에 따라 기본 모델 계산
  const defaultModel = useMemo(
    () =>
      stableHealthCheck?.healthy
        ? Model.STABLE_DIFFUSION_XL
        : zimageHealthCheck?.healthy
          ? Model.Z_IMAGE
          : Model.DALL_E_3,
    [stableHealthCheck?.healthy, zimageHealthCheck?.healthy],
  );

  // 사용자가 수동으로 선택한 모델 (없으면 기본 모델 사용)
  const [manualModel, setManualModel] = useState<Model | null>(null);

  // 실제 사용할 모델 (수동 선택이 있으면 그것을, 없으면 기본 모델 사용)
  const model = manualModel ?? defaultModel;

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
        queryClient.invalidateQueries({
          queryKey: ["galleryImagesInfinite"],
        });
        queryClient.invalidateQueries({
          queryKey: ["userImagesInfinite"],
        });
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
        throw new Error(`HTTP error! status: ${response.status}`);
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
                queryClient.invalidateQueries({
                  queryKey: ["galleryImagesInfinite"],
                });
                queryClient.invalidateQueries({
                  queryKey: ["userImagesInfinite"],
                });
              } else if (data.status === "error") {
                throw new Error(data.message);
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
    if (!prompt.trim()) {
      toast.error("프롬프트를 입력해주세요", {
        description: "이미지 생성을 위한 설명을 입력해주세요.",
      });
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

  const isPending = isMutationPending || isStreaming;

  return (
    <Layout.Content className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-800 dark:via-gray-900 dark:to-purple-950/30 p-4 gap-4 md:gap-8 md:p-8">
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
                  disabled={isPending || !prompt.trim() || (credit ?? 0) < 1}
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
            className="shadow-xl border-0 bg-background/80 backdrop-blur-sm"
          >
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold text-foreground">
                생성된 이미지
              </CardTitle>
            </CardHeader>
            <CardContent>
              {imageUrl ? (
                <div className="space-y-4">
                  <div
                    className={cn(
                      "relative mx-auto border-2 max-h-[500px] border-border rounded-xl overflow-hidden",
                      "bg-background flex items-center justify-center",
                      getRatio(displayRatio),
                    )}
                  >
                    <Image
                      src={imageUrl}
                      alt="생성된 이미지"
                      fill
                      className="w-auto h-auto object-contain transition-transform duration-300 group-hover:scale-105"
                      unoptimized
                    />
                  </div>

                  <div className="flex gap-2 mt-8">
                    <Button
                      onClick={() => downloadImage(imageUrl)}
                      variant="outline"
                      className="flex-1 border-purple-200 text-purple-400 hover:bg-purple-50"
                    >
                      <Download className="mr-1 h-4 w-4" />
                      다운로드
                    </Button>
                    {imageId && (
                      <Button
                        asChild
                        variant="outline"
                        className="flex-1 border-blue-200 text-blue-400 hover:bg-blue-50"
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
                <div
                  className="aurora-bg relative mx-auto rounded-xl overflow-hidden"
                  style={{
                    aspectRatio:
                      ratio === ImageRatio.RATIO_9_16
                        ? "9/16"
                        : ratio === ImageRatio.RATIO_16_9
                          ? "16/9"
                          : "1/1",
                    maxHeight: "500px",
                    maxWidth:
                      ratio === ImageRatio.RATIO_9_16
                        ? `${Math.round(500 * (9 / 16))}px`
                        : ratio === ImageRatio.RATIO_1_1
                          ? "500px"
                          : "100%",
                    width: "100%",
                  }}
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
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6">
                    {generationProgress && (
                      <p className="text-sm font-medium text-white/90 text-center drop-shadow-md">
                        {generationProgress}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-700/70 dark:to-blue-700/70 flex items-center justify-center mb-4">
                    <Sparkles className="h-12 w-12 text-purple-400" />
                  </div>
                  <p className="text-lg font-medium mb-2">
                    이미지가 생성되면 여기에 표시됩니다
                  </p>
                  <p className="text-sm text-gray-400">
                    프롬프트를 입력하고 생성 버튼을 눌러보세요
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout.Content>
  );
}
