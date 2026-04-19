import { FetchUtil } from "@/lib/Fetch.util";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreditSettings } from "@/lib/services/admin/creditSettingsService";

export const useGetCreditSettingsQuery = () => {
  return useQuery<CreditSettings>({
    queryKey: ["creditSettings"],
    queryFn: async (): Promise<CreditSettings> => {
      const response = await FetchUtil.get("/api/credit-settings");
      return response as CreditSettings;
    },
  });
};

export const useUpdateCreditSettingsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      data: Partial<CreditSettings>
    ): Promise<CreditSettings> => {
      const response = await FetchUtil.patch(
        "/api/admin/credit-settings",
        data
      );
      return response as CreditSettings;
    },
    onSuccess: () => {
      // 크레딧 설정 쿼리 무효화 (공개 API와 어드민 API 모두)
      queryClient.invalidateQueries({ queryKey: ["creditSettings"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "creditSettings"] });
    },
  });
};
