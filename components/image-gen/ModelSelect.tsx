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
import { Model } from "@/types/model.interfaces";
import { isLocalModel } from "@/constants/model.constants";
import {
  CREDIT_MODEL_SETTING_OPTIONS,
  MODEL_CREDIT_SETTINGS,
} from "@/constants/credit.constants";

export const ModelSelect = ({
  model,
  setModel,
  isModelHealthy,
  isHealthLoading,
}: {
  model: Model;
  setModel: (value: Model) => void;
  isModelHealthy: (model: Model) => boolean;
  isHealthLoading: boolean;
}) => {
  const {
    data: creditSettings,
    isLoading: isCreditSettingsLoading,
    error: creditSettingsError,
  } = useGetCreditSettingsQuery();

  const modelOptions = useMemo(() => {
    return CREDIT_MODEL_SETTING_OPTIONS.map((option) => {
      const isEnabled = creditSettings?.[option.enabledKey] ?? false;
      const isHealthy = isModelHealthy(option.model);

      return {
        ...option,
        isEnabled,
        isHealthy,
        // 로컬 모델은 서버가 꺼져 있어도 대기열 예약으로 고를 수 있다.
        isAvailable: isEnabled && (isHealthy || isLocalModel(option.model)),
      };
    });
  }, [creditSettings, isModelHealthy]);

  useEffect(() => {
    if (isHealthLoading || isCreditSettingsLoading || creditSettingsError) {
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
    isHealthLoading,
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
          <MiniDot color={isLocalModel(option.model) ? "orange" : "red"} />
          {isLocalModel(option.model) ? "오프라인 · 예약" : "오프라인"}
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
  // 관리자가 중지한 모델은 목록에서 아예 뺀다. 오프라인처럼 잠깐 못 쓰는 모델은
  // 상태를 보여 주려고 비활성으로 남겨 둔다.
  const visibleOptions = modelOptions.filter((option) => option.isEnabled);

  return (
    <Select
      value={model}
      onValueChange={(value: Model) => setModel(value)}
      disabled={
        isHealthLoading ||
        isCreditSettingsLoading ||
        Boolean(creditSettingsError) ||
        !hasAvailableModel
      }
    >
      <SelectTrigger className="h-10 w-full bg-background transition-colors disabled:cursor-not-allowed disabled:opacity-50">
        <SelectValue placeholder="모델 선택">
          <div className="flex items-center gap-2">
            {isHealthLoading || isCreditSettingsLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                <span className="text-muted-foreground">모델 설정 확인 중...</span>
              </>
            ) : creditSettings && visibleOptions.length === 0 ? (
              <span className="text-muted-foreground">사용 가능한 모델이 없습니다</span>
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
        {visibleOptions.map((option) => (
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
