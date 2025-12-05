import { Select } from "@radix-ui/react-select";
import { Badge } from "../ui/badge";
import { MiniDot } from "../common/MiniDot";
import { Loader2 } from "lucide-react";
import {
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import { creditConstants } from "@/constants/credit.constants";
import { HealthCheckResponse } from "@/types/common.interfaces";

export const ModelSelect = ({
  model,
  setModel,
  stableHealthCheck,
  zimageHealthCheck,
  isStableHealthCheckLoading,
  isZimageHealthCheckLoading,
}: {
  model: string;
  setModel: (value: string) => void;
  stableHealthCheck: HealthCheckResponse | undefined;
  zimageHealthCheck: HealthCheckResponse | undefined;
  isStableHealthCheckLoading: boolean;
  isZimageHealthCheckLoading: boolean;
}) => {
  // 모델에 따른 표시 텍스트 매핑
  const getModelDisplayText = (modelValue: string) => {
    switch (modelValue) {
      case "stable-diffusion-xl":
        return "Stable Diffusion XL";
      case "dall-e-3":
        return "Dall-E 3";
      case "google-imagen":
        return "Google Imagen";
      case "nano-banana":
        return "Nano Banana";
      case "Z-Image":
        return "Z-Image";
      default:
        return "모델 선택";
    }
  };
  const getCreditText = (modelValue: string) => {
    switch (modelValue) {
      case "stable-diffusion-xl":
        return (
          <Badge variant="outline" className="text-xs">
            <MiniDot />
            {creditConstants.STABLE_DIFFUSION_XL} 크레딧
          </Badge>
        );
      case "dall-e-3":
        return (
          <Badge variant="outline" className="text-xs">
            <MiniDot />
            {creditConstants.DALL_E_3} 크레딧
          </Badge>
        );
      case "google-imagen":
        return (
          <Badge variant="outline" className="text-xs">
            <MiniDot />
            {creditConstants.GOOGLE_IMAGEN} 크레딧
          </Badge>
        );
      case "nano-banana":
        return (
          <Badge variant="outline" className="text-xs">
            <MiniDot />
            {creditConstants.NANO_BANANA} 크레딧
          </Badge>
        );
      case "Z-Image":
        return (
          <Badge variant="outline" className="text-xs">
            <MiniDot />
            {creditConstants.ZIMAGE} 크레딧
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Select
      value={model}
      onValueChange={(value) => setModel(value)}
      disabled={isStableHealthCheckLoading || isZimageHealthCheckLoading}
    >
      <SelectTrigger className="border-2 focus:border-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full">
        <SelectValue placeholder="모델 선택">
          <div className="flex items-center gap-2">
            {isStableHealthCheckLoading || isZimageHealthCheckLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                <span className="text-gray-500">모델 상태 확인 중...</span>
              </>
            ) : (
              <>
                {getCreditText(model)}
                {getModelDisplayText(model)}
              </>
            )}
          </div>
        </SelectValue>
      </SelectTrigger>

      <SelectContent>
        <SelectItem
          value="stable-diffusion-xl"
          disabled={stableHealthCheck?.healthy !== true}
        >
          {stableHealthCheck?.healthy === true ? (
            getCreditText("stable-diffusion-xl")
          ) : (
            <Badge variant="outline" className="text-xs">
              <MiniDot color="red" />
              오프라인
            </Badge>
          )}
          Stable Diffusion XL
        </SelectItem>
        <SelectItem
          value="Z-Image"
          disabled={zimageHealthCheck?.healthy !== true}
        >
          {zimageHealthCheck?.healthy === true ? (
            getCreditText("Z-Image")
          ) : (
            <Badge variant="outline" className="text-xs">
              <MiniDot color="red" />
              오프라인
            </Badge>
          )}
          Z-Image
        </SelectItem>
        <SelectItem value="dall-e-3">
          {getCreditText("dall-e-3")}
          Dall-E 3
        </SelectItem>
        <SelectItem value="google-imagen">
          {getCreditText("google-imagen")}
          Google Imagen
        </SelectItem>
        <SelectItem value="nano-banana">
          {getCreditText("nano-banana")}
          Nano Banana
        </SelectItem>
      </SelectContent>
    </Select>
  );
};
