import { FetchUtil } from "@/lib/Fetch.util";
import {
  GenerateImageRequest,
  GenerateImageResponse,
} from "../../types/image.interfaces";
import { useMutation } from "@tanstack/react-query";
import { ErrorResponse } from "@/types/common.interfaces";

export const useGenerateImageMutation = (
  onSuccess: (data: GenerateImageResponse) => void,
  onError: (error: ErrorResponse) => void
) => {
  return useMutation({
    mutationFn: async (data: GenerateImageRequest) => {
      const response = await FetchUtil.post("/api/generate-image", data);
      return response;
    },
    onSuccess: (response) => onSuccess(response),
    onError: (error) => onError(error),
  });
};
