import { prisma } from "../prisma";

export interface TranslateAndClassifyResult {
  prompt: string;
  categories: string[];
}

export const ollamaService = {
  /**
   * DB에서 현재 사용 가능한 카테고리 slug 목록 조회
   */
  async getAvailableCategorySlugs(): Promise<string[]> {
    const categories = await prisma.category.findMany({
      select: { slug: true },
    });
    return categories.map((c) => c.slug);
  },

  async translateText(userPrompt: string): Promise<string> {
    const systemPrompt = `
  You are an assistant that converts user natural language descriptions into concise, SDXL-ready prompts.
  
  Rules:
  - Extract subject, action, environment, style, lighting, mood, camera.
  - Use short, strong keywords (no long sentences).
  - Map style words (photo, anime, watercolor, cyberpunk, fantasy, etc.) into SDXL-friendly tokens.
  - Add quality boosters: highly detailed, sharp focus, well composed.
  - For humans: add realistic anatomy.
  - Never add artist names, brands, or celebrities.
  - Always respond in JSON format: { "promt": "<final positive prompt text only>" }
  
  User input:
  ${userPrompt}
  `;

    const response = await fetch(`${process.env.OLLAMA_API_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gemma3:4b",
        prompt: systemPrompt,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to translate text");
    }

    const data = await response.json();

    if (!data.response) {
      throw new Error("Failed to translate text");
    }

    return data.response;
  },

  /**
   * 프롬프트를 번역하고 카테고리도 함께 분류합니다.
   * 번역된 프롬프트와 추천 카테고리 slug 배열을 반환합니다.
   */
  async translateAndClassify(
    userPrompt: string,
  ): Promise<TranslateAndClassifyResult> {
    // DB에서 카테고리 목록 동적 조회
    const availableCategories = await this.getAvailableCategorySlugs();

    const systemPrompt = `
You are an assistant that converts user natural language descriptions into concise, SDXL-ready prompts AND classifies them into categories.

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
${userPrompt}
`;

    const response = await fetch(`${process.env.OLLAMA_API_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gemma3:4b",
        prompt: systemPrompt,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to translate and classify");
    }

    const data = await response.json();

    if (!data.response) {
      throw new Error("Failed to translate and classify");
    }

    // JSON 응답 파싱
    try {
      // 응답에서 JSON 부분만 추출
      const jsonMatch = data.response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON found in response");
      }

      const parsed = JSON.parse(jsonMatch[0]);

      // categories 유효성 검사 - 허용된 카테고리만 필터링
      const validCategories = (parsed.categories || []).filter((cat: string) =>
        availableCategories.includes(cat.toLowerCase().trim()),
      );

      return {
        prompt: parsed.prompt || parsed.promt || userPrompt, // 'promt' 오타도 핸들링
        categories: validCategories.map((c: string) => c.toLowerCase().trim()),
      };
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      // 파싱 실패시 원본 프롬프트와 빈 카테고리 반환
      return {
        prompt: userPrompt,
        categories: [],
      };
    }
  },

  async healthCheck(): Promise<boolean> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    try {
      const response = await fetch(`${process.env.OLLAMA_API_URL}`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error("Failed to check health");
      }

      return response.ok;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error("Health check timeout");
      }
      throw error;
    }
  },
};
