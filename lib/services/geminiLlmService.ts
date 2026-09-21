import { prisma } from "../prisma";
import { ApiError } from "@/lib/errors/AppError";
import { TranslateAndClassifyResult } from "./ollamaService";
import { REMOVAL_FALLBACK_RULE } from "@/constants/llm.constants";

const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta";

const GEMINI_REQUEST_LIMIT = 100;
let geminiRequestCount = 0;

export function getGeminiRequestCount() {
  return geminiRequestCount;
}

export function resetGeminiRequestCount() {
  geminiRequestCount = 0;
}

async function callGemini(model: string, prompt: string): Promise<string> {
  if (geminiRequestCount >= GEMINI_REQUEST_LIMIT) {
    throw new ApiError(
      `Gemini API 요청 한도(${GEMINI_REQUEST_LIMIT}회)에 도달했습니다.`,
      429,
    );
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new ApiError("GEMINI_API_KEY가 설정되지 않았습니다.", 500);
  }

  geminiRequestCount++;
  console.log("Gemini request count:", geminiRequestCount);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
    const response = await fetch(
      `${GEMINI_API_BASE}/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 512,
            responseMimeType: "application/json",
          },
        }),
        signal: controller.signal,
      },
    );
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        `Gemini API 오류: ${errorData?.error?.message || response.statusText}`,
        response.status,
      );
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new ApiError("Gemini 응답이 올바르지 않습니다.", 500);
    }

    return text;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === "AbortError") {
      throw new ApiError("Gemini API 응답 시간이 초과되었습니다.", 408);
    }
    if (error instanceof ApiError) throw error;
    throw new ApiError("Gemini API 연결 중 오류가 발생했습니다.", 500);
  }
}

export const geminiLlmService = {
  async translateText(
    userPrompt: string,
    model: string = "gemini-2.5-flash-lite",
  ): Promise<string> {
    const systemPrompt = `Convert input to SDXL prompt. Keywords only, no sentences. Add: highly detailed, sharp focus, well composed. No artist/brand names. JSON: {"prompt":"..."}

Input: ${userPrompt}`;

    const responseText = await callGemini(model, systemPrompt);

    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) return responseText;

      const parsed = JSON.parse(jsonMatch[0]);
      return parsed.prompt || parsed.promt || userPrompt;
    } catch {
      console.error("Failed to parse Gemini response");
      return userPrompt;
    }
  },

  /**
   * 이미지 편집 지시문을 영어 명령문 한 줄로 정리한다.
   * `translateText`는 SDXL용 키워드 나열을 만들기 때문에 편집 모델에는 쓸 수 없다.
   */
  async translateEditInstruction(
    userPrompt: string,
    model: string = "gemini-2.5-flash-lite",
    masked = false,
  ): Promise<string> {
    const systemPrompt = `Rewrite the image editing instruction below as ONE short English imperative sentence for an image editing model.
${
      masked
        ? "The user painted a region of the image and the instruction applies only to that region."
        : "The instruction applies to the whole image."
    }
Rules:
- Describe the desired RESULT, not the act of editing. Never use the words edit, select, selected, region, area, mask or painted.
- To delete, remove, erase or hide something, name what should be there instead. ${REMOVAL_FALLBACK_RULE}
- Keep whatever the user wants preserved. Do not invent new subjects, styles or quality keywords.
- Keep any <image1> or <image2> placeholder exactly as written.
JSON: {"instruction":"..."}

Input: ${userPrompt}`;

    const responseText = await callGemini(model, systemPrompt);

    try {
      // 모델이 JSON을 두 번 뱉는 경우가 있어 첫 객체만 비탐욕으로 집는다.
      const jsonMatch = responseText.match(/\{[\s\S]*?\}/);
      if (!jsonMatch) return userPrompt;

      const parsed = JSON.parse(jsonMatch[0]);
      return typeof parsed.instruction === "string" && parsed.instruction.trim()
        ? parsed.instruction.trim()
        : userPrompt;
    } catch {
      console.error("Failed to parse Gemini edit instruction response");
      return userPrompt;
    }
  },

  async translateAndClassify(
    userPrompt: string,
    model: string = "gemini-2.5-flash-lite",
  ): Promise<TranslateAndClassifyResult> {
    const categories = await prisma.category.findMany({
      select: { slug: true },
    });
    const availableCategories = categories.map((c) => c.slug);

    const systemPrompt = `Convert input to SDXL prompt and pick 1-3 categories.
Prompt: keywords only, no sentences. Add: highly detailed, sharp focus, well composed. No artist/brand names.
Categories (slugs): ${availableCategories.join(", ")}
JSON: {"prompt":"...","categories":["slug1"]}

Input: ${userPrompt}`;

    const responseText = await callGemini(model, systemPrompt);

    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new ApiError("Gemini 응답에서 JSON을 찾을 수 없습니다.", 500);
      }

      const parsed = JSON.parse(jsonMatch[0]);

      const validCategories = (parsed.categories || []).filter((cat: string) =>
        availableCategories.includes(cat.toLowerCase().trim()),
      );

      return {
        prompt: parsed.prompt || parsed.promt || userPrompt,
        categories: validCategories.map((c: string) => c.toLowerCase().trim()),
      };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      console.error("Failed to parse Gemini response:", error);
      return { prompt: userPrompt, categories: [] };
    }
  },

  async healthCheck(model: string = "gemini-2.5-flash-lite"): Promise<boolean> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new ApiError("GEMINI_API_KEY가 설정되지 않았습니다.", 500);
    }

    try {
      const response = await fetch(
        `${GEMINI_API_BASE}/models/${model}?key=${apiKey}`,
        { signal: AbortSignal.timeout(5000) },
      );

      if (!response.ok) {
        throw new ApiError(
          "Gemini API 상태 확인에 실패했습니다.",
          response.status,
        );
      }

      return true;
    } catch (error) {
      if (
        error instanceof Error &&
        (error.name === "TimeoutError" || error.name === "AbortError")
      ) {
        throw new ApiError("Gemini API 연결 시간이 초과되었습니다.", 408);
      }
      if (error instanceof ApiError) throw error;
      throw new ApiError("Gemini API 상태 확인 중 오류가 발생했습니다.", 500);
    }
  },
};
