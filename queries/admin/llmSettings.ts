import { FetchUtil } from "@/lib/Fetch.util";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { LlmSettings } from "@/lib/services/admin/llmSettingsService";

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
