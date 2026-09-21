import { ApiError } from "@/lib/errors/AppError";
import { prisma } from "@/lib/prisma";
import { NSFW_CAPABLE_MODELS } from "@/constants/model.constants";
import { Model } from "@/types/model.interfaces";

const JEV_API_URL = "https://api.typesafe.ai/v1/systemone";
const SEXUAL_CONTENT_THRESHOLD = 0.7;

interface JevSafetyResponse {
  answers?: {
    sexual_content?: { type?: string; noul?: number };
  };
}

export const promptSafetyService = {
  async assertAllowed(prompt: string, model: Model): Promise<void> {
    if (!NSFW_CAPABLE_MODELS.has(model)) return;

    const settings = await prisma.llmSettings.findUnique({
      where: { id: 1 },
      select: { sexualContentFilterEnabled: true },
    });
    if (!settings?.sexualContentFilterEnabled) return;

    const apiKey = process.env.TYPESAFE_API_KEY;
    if (!apiKey) {
      throw new ApiError(
        "프롬프트 필터를 사용할 수 없습니다. 잠시 후 다시 시도해주세요.",
        503,
        "PROMPT_FILTER_UNAVAILABLE",
      );
    }

    let score: number;
    try {
      const response = await fetch(JEV_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          state: prompt,
          model: "jev-latest",
          questions: {
            sexual_content: {
              type: "noul",
              instructions:
                "Does this prompt request an image with erotic sexual content, sexualized nudity, or sexual activity? Answer no for ordinary nonsexual portraits, clothing, swimwear, or medical and educational anatomy.",
            },
          },
        }),
        signal: AbortSignal.timeout(8000),
      });
      if (!response.ok) {
        throw new Error(`JEV API 요청 실패 (${response.status})`);
      }

      const result = (await response.json()) as JevSafetyResponse;
      const answer = result.answers?.sexual_content;
      const candidateScore = answer?.noul;
      if (
        answer?.type !== "noul" ||
        typeof candidateScore !== "number" ||
        !Number.isFinite(candidateScore) ||
        candidateScore < 0 ||
        candidateScore > 1
      ) {
        throw new Error("JEV 선정성 검사 응답이 올바르지 않습니다.");
      }
      score = candidateScore;
    } catch (error) {
      console.error("프롬프트 선정성 검사 실패:", error);
      throw new ApiError(
        "프롬프트 필터를 사용할 수 없습니다. 잠시 후 다시 시도해주세요.",
        503,
        "PROMPT_FILTER_UNAVAILABLE",
      );
    }

    if (score >= SEXUAL_CONTENT_THRESHOLD) {
      throw new ApiError(
        "선정적인 내용이 포함된 프롬프트는 사용할 수 없습니다. 내용을 수정해주세요.",
        400,
        "SEXUAL_CONTENT_BLOCKED",
      );
    }
  },
};
