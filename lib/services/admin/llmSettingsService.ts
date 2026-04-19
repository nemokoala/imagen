import { prisma } from "@/lib/prisma";
import { ApiError } from "@/lib/errors/AppError";
import {
  DEFAULT_GEMINI_MODEL,
  DEFAULT_LLM_PROVIDER,
  DEFAULT_OLLAMA_MODEL,
  GEMINI_MODEL_OPTIONS,
  LLM_PROVIDER_OPTIONS,
  isValidGeminiModel,
  isValidLlmProvider,
} from "@/constants/llm.constants";

export interface LlmSettings {
  provider: string;
  geminiModel: string;
  ollamaModel: string;
  translateEnabled: boolean;
  categoryEnabled: boolean;
}

export const llmSettingsService = {
  async getLlmSettings(): Promise<LlmSettings> {
    let settings = await prisma.llmSettings.findUnique({
      where: { id: 1 },
    });

    if (!settings) {
      settings = await prisma.llmSettings.create({
        data: {
          id: 1,
          provider: DEFAULT_LLM_PROVIDER,
          geminiModel: DEFAULT_GEMINI_MODEL,
          ollamaModel: DEFAULT_OLLAMA_MODEL,
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
      !isValidLlmProvider(data.provider)
    ) {
      throw new ApiError(
        `유효하지 않은 프로바이더입니다. (${LLM_PROVIDER_OPTIONS.map((option) => option.value).join(", ")})`,
        400,
        "INVALID_PROVIDER",
      );
    }

    if (
      data.geminiModel !== undefined &&
      !isValidGeminiModel(data.geminiModel)
    ) {
      throw new ApiError(
        `유효하지 않은 Gemini 모델입니다. (${GEMINI_MODEL_OPTIONS.map((option) => option.value).join(", ")})`,
        400,
        "INVALID_GEMINI_MODEL",
      );
    }

    const updateData: Partial<LlmSettings> = {};

    if (data.provider !== undefined) updateData.provider = data.provider;
    if (data.geminiModel !== undefined) {
      updateData.geminiModel = data.geminiModel;
    }
    if (data.translateEnabled !== undefined) {
      updateData.translateEnabled = data.translateEnabled;
    }
    if (data.categoryEnabled !== undefined) {
      updateData.categoryEnabled = data.categoryEnabled;
    }

    if (data.ollamaModel !== undefined) {
      const ollamaModel = data.ollamaModel.trim();

      if (!ollamaModel || ollamaModel.length > 120 || /\s/.test(ollamaModel)) {
        throw new ApiError(
          "Ollama 모델명은 공백 없이 1~120자로 입력해야 합니다.",
          400,
          "INVALID_OLLAMA_MODEL",
        );
      }

      updateData.ollamaModel = ollamaModel;
    }

    await prisma.llmSettings.upsert({
      where: { id: 1 },
      create: {
        id: 1,
        provider: DEFAULT_LLM_PROVIDER,
        geminiModel: DEFAULT_GEMINI_MODEL,
        ollamaModel: DEFAULT_OLLAMA_MODEL,
        translateEnabled: true,
        categoryEnabled: true,
        ...updateData,
      },
      update: updateData,
    });

    return this.getLlmSettings();
  },

  getValidProviders() {
    return LLM_PROVIDER_OPTIONS.map((option) => option.value);
  },

  getValidGeminiModels() {
    return GEMINI_MODEL_OPTIONS.map((option) => option.value);
  },
};
