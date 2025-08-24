import { FetchUtil } from "@/lib/Fetch.util";
import { LoginFormData, RegisterFormData } from "@/schemas/auth";
import { useMutation } from "@tanstack/react-query";
import { ErrorResponse, SuccessResponse } from "@/types/common.interfaces";

export const useLoginMutation = (
  onSuccess: (
    data: SuccessResponse<{ accessToken: string; refreshToken: string }>
  ) => void,
  onError: (error: ErrorResponse) => void
) => {
  return useMutation({
    mutationFn: async (data: LoginFormData) => {
      const response = await FetchUtil.post("/api/auth/login", data);
      return response;
    },
    onSuccess: (response) => onSuccess(response),
    onError: (error) => onError(error),
  });
};
export const useRegisterMutation = (
  onSuccess: (response: SuccessResponse) => void,
  onError: (error: ErrorResponse) => void
) => {
  return useMutation({
    mutationFn: async (data: RegisterFormData) => {
      const response = await FetchUtil.post("/api/auth/register", data);
      return response;
    },
    onSuccess: (response) => onSuccess(response),
    onError: (error) => onError(error),
  });
};
