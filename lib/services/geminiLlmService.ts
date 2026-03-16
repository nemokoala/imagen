import { prisma } from "../prisma";
import { ApiError } from "@/lib/errors/AppError";
import { TranslateAndClassifyResult } from "./ollamaService";

const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta";

async function callGemini(
  model: string,
  prompt: string,
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new ApiError("GEMINI_API_KEY가 설정되지 않았습니다.", 500);
  }

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
    const systemPrompt = `You are an assistant that converts user natural language descriptions into concise, SDXL-ready prompts.

Rules:
- Extract subject, action, environment, style, lighting, mood, camera.
- Use short, strong keywords (no long sentences).
- Map style words (photo, anime, watercolor, cyberpunk, fantasy, etc.) into SDXL-friendly tokens.
- Add quality boosters: highly detailed, sharp focus, well composed.
- For humans: add realistic anatomy.
- Never add artist names, brands, or celebrities.
- Always respond in JSON format: { "prompt": "<final positive prompt text only>" }

User input:
${userPrompt}`;

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

  async translateAndClassify(
    userPrompt: string,
    model: string = "gemini-2.5-flash-lite",
  ): Promise<TranslateAndClassifyResult> {
    const categories = await prisma.category.findMany({
      select: { slug: true },
    });
    const availableCategories = categories.map((c) => c.slug);

    const systemPrompt = `You are an assistant that converts user natural language descriptions into concise, SDXL-ready prompts AND classifies them into categories.

Available categories (use slug values): ${availableCategories.join(", ")}

Rules for prompt:
- Extract subject, action, environment, style, lighting, mood, camera.
- Use short, strong keywords (no long sentences).
- Map style words (photo, anime, watercolor, cyberpunk, fantasy, etc.) into SDXL-friendly tokens.
- Add quality boosters: highly detailed, sharp focus, well composed.
- For humans: add realistic anatomy.
- Never add artist names, brands, or celebrities.

Rules for categories:
- Select 1-3 most relevant categories from the available list.
- Use the slug values (e.g., "landscape", "portrait", "animal").
- Only select categories that strongly match the content.

Always respond in JSON format:
{
  "prompt": "<final positive prompt text only>",
  "categories": ["<category_slug1>", "<category_slug2>"]
}

User input:
${userPrompt}`;

    const responseText = await callGemini(model, systemPrompt);

    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new ApiError("Gemini 응답에서 JSON을 찾을 수 없습니다.", 500);
      }

      const parsed = JSON.parse(jsonMatch[0]);

      const validCategories = (parsed.categories || []).filter(
        (cat: string) =>
          availableCategories.includes(cat.toLowerCase().trim()),
      );

      return {
        prompt: parsed.prompt || parsed.promt || userPrompt,
        categories: validCategories.map((c: string) =>
          c.toLowerCase().trim(),
        ),
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
