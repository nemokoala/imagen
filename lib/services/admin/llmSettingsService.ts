import { prisma } from "@/lib/prisma";
import { ApiError } from "@/lib/errors/AppError";

export interface LlmSettings {
  provider: string;
  geminiModel: string;
  ollamaModel: string;
  translateEnabled: boolean;
  categoryEnabled: boolean;
}

const VALID_PROVIDERS = ["ollama", "gemini"] as const;

const VALID_GEMINI_MODELS = [
  "gemini-2.5-flash-lite",
] as const;

export const llmSettingsService = {
  async getLlmSettings(): Promise<LlmSettings> {
    let settings = await prisma.llmSettings.findUnique({
      where: { id: 1 },
    });

    if (!settings) {
      settings = await prisma.llmSettings.create({
        data: {
          id: 1,
          provider: "ollama",
          geminiModel: "gemini-2.5-flash-lite",
          ollamaModel: "gemma3:4b",
          translateEnabled: true,
          categoryEnabled: true,
        },
      });
    }

    return {
      provider: settings.provider,
      geminiModel: settings.geminiModel,
      ollamaModel: settings.ollamaModel,
      translateEnabled: settings.translateEnabled,
      categoryEnabled: settings.categoryEnabled,
    };
  },

  async updateLlmSettings(data: Partial<LlmSettings>): Promise<LlmSettings> {
    if (
      data.provider !== undefined &&
      !VALID_PROVIDERS.includes(data.provider as (typeof VALID_PROVIDERS)[number])
    ) {
      throw new ApiError(
        `유효하지 않은 프로바이더입니다. (${VALID_PROVIDERS.join(", ")})`,
        400,
        "INVALID_PROVIDER",
      );
    }

    if (
      data.geminiModel !== undefined &&
      !VALID_GEMINI_MODELS.includes(
        data.geminiModel as (typeof VALID_GEMINI_MODELS)[number],
      )
    ) {
      throw new ApiError(
        `유효하지 않은 Gemini 모델입니다. (${VALID_GEMINI_MODELS.join(", ")})`,
        400,
        "INVALID_GEMINI_MODEL",
      );
    }

    const existing = await prisma.llmSettings.findUnique({
      where: { id: 1 },
    });

    if (!existing) {
      const defaults = await this.getLlmSettings();
      await prisma.llmSettings.create({
        data: { id: 1, ...defaults, ...data },
      });
    } else {
      await prisma.llmSettings.update({
        where: { id: 1 },
        data,
      });
    }

    return this.getLlmSettings();
  },

  getValidProviders() {
    return VALID_PROVIDERS;
  },

  getValidGeminiModels() {
    return VALID_GEMINI_MODELS;
  },
};
