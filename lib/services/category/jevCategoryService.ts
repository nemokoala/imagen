import { prisma } from "@/lib/prisma";

const JEV_API_URL = "https://api.typesafe.ai/v1/systemone";
const JEV_MODEL = "jev-latest";
const MATCH_THRESHOLD = 0.5;

interface NoulAnswer {
  type: "noul";
  noul: number;
}

interface JevResponse {
  answers?: Record<string, NoulAnswer>;
}

export const jevCategoryService = {
  async suggestCategories(prompt: string): Promise<string[]> {
    const apiKey = process.env.TYPESAFE_API_KEY;
    if (!apiKey) {
      throw new Error("TYPESAFE_API_KEY가 설정되지 않았습니다.");
    }

    const categories = await prisma.category.findMany({
      select: { name: true, slug: true },
    });
    if (categories.length === 0) return [];

    const questions = Object.fromEntries(
      categories.map((category, index) => [
        `category_${index}`,
        {
          type: "noul",
          instructions: `Should an image generated from this prompt be tagged "${category.name}" (${category.slug})? Answer yes only when this category strongly matches the described subject or visual style. Do not assume details that are not in the prompt.`,
        },
      ]),
    );

    const response = await fetch(JEV_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ state: prompt, model: JEV_MODEL, questions }),
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      throw new Error(`JEV API 요청 실패 (${response.status})`);
    }

    const result = (await response.json()) as JevResponse;
    const scores = categories.map((category, index) => {
      const answer = result.answers?.[`category_${index}`];
      if (
        answer?.type !== "noul" ||
        !Number.isFinite(answer.noul) ||
        answer.noul < 0 ||
        answer.noul > 1
      ) {
        throw new Error("JEV 카테고리 응답이 올바르지 않습니다.");
      }
      return { slug: category.slug, score: answer.noul };
    });

    return scores
      .filter(({ score }) => score >= MATCH_THRESHOLD)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(({ slug }) => slug);
  },
};
