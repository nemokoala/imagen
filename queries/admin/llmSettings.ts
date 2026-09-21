import { FetchUtil } from "@/lib/Fetch.util";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { LlmSettings } from "@/lib/services/admin/llmSettingsService";
import type { PromptTranslationSettings } from "@/app/api/prompt-translation/route";

export const useGetLlmSettingsQuery = () => {
  return useQuery<LlmSettings>({
    queryKey: ["admin", "llmSettings"],
    queryFn: async (): Promise<LlmSettings> => {
      const response = await FetchUtil.get("/api/admin/llm-settings");
      return response as LlmSettings;
    },
  });
};

export const useUpdateLlmSettingsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      data: Partial<LlmSettings>,
    ): Promise<LlmSettings> => {
      const response = await FetchUtil.patch(
        "/api/admin/llm-settings",
        data,
      );
      return response as LlmSettings;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "llmSettings"] });
    },
  });
};

/** 공개 API. 편집 화면에서 영어 입력 권장 문구를 띄울지 판단하는 데 쓴다. */
export const useGetPromptTranslationQuery = () => {
  return useQuery<PromptTranslationSettings>({
    queryKey: ["promptTranslation"],
    queryFn: async (): Promise<PromptTranslationSettings> => {
      const response = await FetchUtil.get("/api/prompt-translation");
      return response as PromptTranslationSettings;
    },
  });
};
