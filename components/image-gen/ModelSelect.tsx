import { useEffect, useMemo } from "react";
import { Badge } from "../ui/badge";
import { MiniDot } from "../common/MiniDot";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import { useGetCreditSettingsQuery } from "@/queries/admin/creditSettings";
import { HealthCheckResponse } from "@/types/common.interfaces";
import { Model } from "@/types/model.interfaces";
import {
  CREDIT_MODEL_SETTING_OPTIONS,
  MODEL_CREDIT_SETTINGS,
} from "@/constants/credit.constants";

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
  const {
    data: creditSettings,
    isLoading: isCreditSettingsLoading,
    error: creditSettingsError,
  } = useGetCreditSettingsQuery();

  const modelOptions = useMemo(() => {
    return CREDIT_MODEL_SETTING_OPTIONS.map((option) => {
      const isEnabled = creditSettings?.[option.enabledKey] ?? false;
      const isHealthy =
        option.model === Model.STABLE_DIFFUSION_XL
          ? stableHealthCheck?.healthy === true
          : option.model === Model.Z_IMAGE
            ? zimageHealthCheck?.healthy === true
            : true;

      return {
        ...option,
        isEnabled,
        isHealthy,
        isAvailable: isEnabled && isHealthy,
      };
    });
  }, [creditSettings, stableHealthCheck?.healthy, zimageHealthCheck?.healthy]);

  useEffect(() => {
    if (
      isStableHealthCheckLoading ||
      isZimageHealthCheckLoading ||
      isCreditSettingsLoading ||
      creditSettingsError
    ) {
      return;
    }

    const selectedOption = modelOptions.find(
      (option) => option.model === model,
    );
    if (selectedOption?.isAvailable) return;

    const nextAvailableOption = modelOptions.find(
      (option) => option.isAvailable,
    );
    if (nextAvailableOption) {
      setModel(nextAvailableOption.model);
    }
  }, [
    isStableHealthCheckLoading,
    isZimageHealthCheckLoading,
    isCreditSettingsLoading,
    creditSettingsError,
    model,
    modelOptions,
    setModel,
  ]);

  const getModelDisplayText = (modelValue: Model) => {
    return MODEL_CREDIT_SETTINGS[modelValue]?.label ?? "모델 선택";
  };

  const getModelOption = (modelValue: Model) =>
    modelOptions.find((option) => option.model === modelValue);

  const getCreditText = (modelValue: Model) => {
    const option = getModelOption(modelValue);
    if (!option) return null;

    if (isCreditSettingsLoading) {
      return (
        <Badge variant="outline" className="text-xs">
          <MiniDot color="gray" />
          설정 확인 중
        </Badge>
      );
    }

    if (creditSettingsError || !creditSettings) {
      return (
        <Badge variant="outline" className="text-xs">
          <MiniDot color="red" />
          설정 오류
        </Badge>
      );
    }

    if (!option.isEnabled) {
      return (
        <Badge variant="outline" className="text-xs">
          <MiniDot color="red" />
          중지됨
        </Badge>
      );
    }

    if (!option.isHealthy) {
      return (
        <Badge variant="outline" className="text-xs">
          <MiniDot color="red" />
          오프라인
        </Badge>
      );
    }

    return (
      <Badge variant="outline" className="text-xs">
        <MiniDot />
        {creditSettings[option.creditKey]} 크레딧
      </Badge>
    );
  };

  const hasAvailableModel = modelOptions.some((option) => option.isAvailable);

  return (
    <Select
      value={model}
      onValueChange={(value: Model) => setModel(value)}
      disabled={
        isStableHealthCheckLoading ||
        isZimageHealthCheckLoading ||
        isCreditSettingsLoading ||
        Boolean(creditSettingsError) ||
        !hasAvailableModel
      }
    >
      <SelectTrigger className="border-2 focus:border-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full">
        <SelectValue placeholder="모델 선택">
          <div className="flex items-center gap-2">
            {isStableHealthCheckLoading ||
            isZimageHealthCheckLoading ||
            isCreditSettingsLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                <span className="text-gray-500">모델 설정 확인 중...</span>
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
        {modelOptions.map((option) => (
          <SelectItem
            key={option.model}
            value={option.model}
            disabled={!option.isAvailable}
          >
            {getCreditText(option.model)}
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
