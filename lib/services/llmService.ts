import { prisma } from "../prisma";
import { ollamaService, TranslateAndClassifyResult } from "./ollamaService";
import { geminiLlmService } from "./geminiLlmService";
import {
  DEFAULT_GEMINI_MODEL,
  DEFAULT_LLM_PROVIDER,
  DEFAULT_OLLAMA_MODEL,
  LlmProvider,
  isValidLlmProvider,
} from "@/constants/llm.constants";

interface LlmConfig {
  provider: LlmProvider;
  geminiModel: string;
  ollamaModel: string;
  translateEnabled: boolean;
  categoryEnabled: boolean;
}

async function getConfig(): Promise<LlmConfig> {
  const settings = await prisma.llmSettings.findUnique({
    where: { id: 1 },
  });

  return {
    provider:
      settings?.provider && isValidLlmProvider(settings.provider)
        ? settings.provider
        : DEFAULT_LLM_PROVIDER,
    geminiModel: settings?.geminiModel || DEFAULT_GEMINI_MODEL,
    ollamaModel: settings?.ollamaModel || DEFAULT_OLLAMA_MODEL,
    translateEnabled: settings?.translateEnabled ?? true,
    categoryEnabled: settings?.categoryEnabled ?? true,
  };
}

export const llmService = {
  async translateText(userPrompt: string): Promise<string> {
    const config = await getConfig();

    if (!config.translateEnabled) return userPrompt;

    if (config.provider === "gemini") {
      return geminiLlmService.translateText(userPrompt, config.geminiModel);
    }

    return ollamaService.translateText(userPrompt, config.ollamaModel);
  },

  /**
   * 이미지 편집 지시문 전용 변환. 편집 모델은 키워드 나열이 아니라 명령문을 받아야 한다.
   */
  async translateEditInstruction(
    userPrompt: string,
    masked = false,
  ): Promise<string> {
    const config = await getConfig();

    if (!config.translateEnabled) return userPrompt;

    if (config.provider === "gemini") {
      return geminiLlmService.translateEditInstruction(
        userPrompt,
        config.geminiModel,
        masked,
      );
    }

    return ollamaService.translateEditInstruction(
      userPrompt,
      config.ollamaModel,
      masked,
    );
  },

  async translateAndClassify(
    userPrompt: string,
  ): Promise<TranslateAndClassifyResult> {
    const config = await getConfig();

    if (!config.categoryEnabled) {
      // 번역도 꺼져있으면 원본 반환, 켜져있으면 번역만 수행
      if (!config.translateEnabled) return { prompt: userPrompt, categories: [] };

      const translated = config.provider === "gemini"
        ? await geminiLlmService.translateText(userPrompt, config.geminiModel)
        : await ollamaService.translateText(userPrompt, config.ollamaModel);
      return { prompt: translated, categories: [] };
    }

    if (config.provider === "gemini") {
      return geminiLlmService.translateAndClassify(
        userPrompt,
        config.geminiModel,
      );
    }

    return ollamaService.translateAndClassify(userPrompt, config.ollamaModel);
  },

  async healthCheck(): Promise<boolean> {
    const config = await getConfig();

    if (config.provider === "gemini") {
      return geminiLlmService.healthCheck(config.geminiModel);
    }

    return ollamaService.healthCheck();
  },
};
