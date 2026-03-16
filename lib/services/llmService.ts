import { prisma } from "../prisma";
import { ollamaService, TranslateAndClassifyResult } from "./ollamaService";
import { geminiLlmService } from "./geminiLlmService";

type LlmProvider = "ollama" | "gemini";

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
    provider: (settings?.provider as LlmProvider) || "ollama",
    geminiModel: settings?.geminiModel || "gemini-2.5-flash-lite",
    ollamaModel: settings?.ollamaModel || "gemma3:4b",
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

    return ollamaService.translateText(userPrompt);
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
        : await ollamaService.translateText(userPrompt);
      return { prompt: translated, categories: [] };
    }

    if (config.provider === "gemini") {
      return geminiLlmService.translateAndClassify(
        userPrompt,
        config.geminiModel,
      );
    }

    return ollamaService.translateAndClassify(userPrompt);
  },

  async healthCheck(): Promise<boolean> {
    const config = await getConfig();

    if (config.provider === "gemini") {
      return geminiLlmService.healthCheck(config.geminiModel);
    }

    return ollamaService.healthCheck();
  },
};
