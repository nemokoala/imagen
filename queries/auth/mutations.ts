import { FetchUtil } from "@/lib/Fetch.util";
import { LoginFormData, RegisterFormData } from "@/schemas/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ErrorResponse } from "@/types/common.interfaces";
import {
  LoginResponse,
  RegisterResponse,
  LogoutResponse,
} from "@/types/auth.interfaces";
import { User } from "@/types/user.interfaces";

export const useLoginMutation = (
  onSuccess: (data: LoginResponse) => void,
  onError: (error: ErrorResponse) => void,
) => {
  return useMutation({
    mutationFn: async (data: LoginFormData): Promise<LoginResponse> => {
      const response = await FetchUtil.post<LoginFormData>(
        "/api/auth/login",
        data,
      );
      return response as LoginResponse;
    },
    onSuccess: (response) => onSuccess(response),
    onError: (error) => onError(error as ErrorResponse),
  });
};

export const useRegisterMutation = (
  onSuccess: (response: RegisterResponse) => void,
  onError: (error: ErrorResponse) => void,
) => {
  return useMutation({
    mutationFn: async (data: RegisterFormData): Promise<RegisterResponse> => {
      const response = await FetchUtil.post<RegisterFormData>(
        "/api/auth/register",
        data,
      );
      return response as RegisterResponse;
    },
    onSuccess: (response) => onSuccess(response),
    onError: (error) => onError(error as ErrorResponse),
  });
};

export const useLogoutMutation = (
  onSuccess: (response: LogoutResponse) => void,
  onError: (error: ErrorResponse) => void,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (): Promise<LogoutResponse> => {
      const response = await FetchUtil.post<Record<string, never>>(
        "/api/auth/logout",
        {},
      );
      return response as LogoutResponse;
    },
    onSuccess: (response) => {
      onSuccess(response);
      queryClient.removeQueries({ queryKey: ["userInfo"] });
    },
    onError: (error) => onError(error as ErrorResponse),
  });
};

export const useUpdateProfile = (
  onSuccess?: (user: User) => void,
  onError?: (error: ErrorResponse) => void,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: FormData) => {
      const response = await FetchUtil.patch("/api/auth/user", data);
      return response as User;
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["userInfo"], updatedUser);
      queryClient.invalidateQueries({ queryKey: ["user", updatedUser.id] });
      if (onSuccess) onSuccess(updatedUser);
    },
    onError: (error) => {
      if (onError) onError(error as ErrorResponse);
    },
  });
};
