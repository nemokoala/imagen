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
import { useGetCreditSettingsQuery } from "@/queries/admin/creditSettings";
import { HealthCheckResponse } from "@/types/common.interfaces";
import { Model } from "@/types/model.interfaces";

export const ModelSelect = ({
  model,
  setModel,
  stableHealthCheck,
  zimageHealthCheck,
  isStableHealthCheckLoading,
  isZimageHealthCheckLoading,
}: {
  model: Model;
  setModel: (value: Model) => void;
  stableHealthCheck: HealthCheckResponse | undefined;
  zimageHealthCheck: HealthCheckResponse | undefined;
  isStableHealthCheckLoading: boolean;
  isZimageHealthCheckLoading: boolean;
}) => {
  const { data: creditSettings } = useGetCreditSettingsQuery();

  // 기본 크레딧 값 (fallback)
  const defaultCredits = {
    dallE3: 20,
    stableDiffusionXl: 5,
    googleImagen: 20,
    nanoBanana: 20,
    zImage: 10,
  };

  // 모델에 따른 표시 텍스트 매핑
  const getModelDisplayText = (modelValue: Model) => {
    switch (modelValue) {
      case Model.STABLE_DIFFUSION_XL:
        return "Stable Diffusion XL";
      case Model.DALL_E_3:
        return "Dall-E 3";
      case Model.GOOGLE_IMAGEN:
        return "Google Imagen";
      case Model.NANO_BANANA:
        return "Nano Banana";
      case Model.Z_IMAGE:
        return "Z-Image";
      default:
        return "모델 선택";
    }
  };
  const getCreditText = (modelValue: Model) => {
    // 크레딧 설정이 로딩 중이거나 없으면 기본값 사용
    const credits = creditSettings || defaultCredits;

    switch (modelValue) {
      case Model.STABLE_DIFFUSION_XL:
        return (
          <Badge variant="outline" className="text-xs">
            <MiniDot />
            {credits.stableDiffusionXl} 크레딧
          </Badge>
        );
      case Model.DALL_E_3:
        return (
          <Badge variant="outline" className="text-xs">
            <MiniDot />
            {credits.dallE3} 크레딧
          </Badge>
        );
      case Model.GOOGLE_IMAGEN:
        return (
          <Badge variant="outline" className="text-xs">
            <MiniDot />
            {credits.googleImagen} 크레딧
          </Badge>
        );
      case Model.NANO_BANANA:
        return (
          <Badge variant="outline" className="text-xs">
            <MiniDot />
            {credits.nanoBanana} 크레딧
          </Badge>
        );
      case Model.Z_IMAGE:
        return (
          <Badge variant="outline" className="text-xs">
            <MiniDot />
            {credits.zImage} 크레딧
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Select
      value={model}
      onValueChange={(value: Model) => setModel(value)}
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
            getCreditText(Model.STABLE_DIFFUSION_XL)
          ) : (
            <Badge variant="outline" className="text-xs">
              <MiniDot color="red" />
              오프라인
            </Badge>
          )}
          Stable Diffusion XL
        </SelectItem>
        <SelectItem
          value={Model.Z_IMAGE}
          disabled={zimageHealthCheck?.healthy !== true}
        >
          {zimageHealthCheck?.healthy === true ? (
            getCreditText(Model.Z_IMAGE)
          ) : (
            <Badge variant="outline" className="text-xs">
              <MiniDot color="red" />
              오프라인
            </Badge>
          )}
          Z-Image
        </SelectItem>
        <SelectItem value={Model.DALL_E_3}>
          {getCreditText(Model.DALL_E_3)}
          Dall-E 3
        </SelectItem>
        <SelectItem value={Model.GOOGLE_IMAGEN}>
          {getCreditText(Model.GOOGLE_IMAGEN)}
          Google Imagen
        </SelectItem>
        <SelectItem value={Model.NANO_BANANA}>
          {getCreditText(Model.NANO_BANANA)}
          Nano Banana
        </SelectItem>
      </SelectContent>
    </Select>
  );
};
