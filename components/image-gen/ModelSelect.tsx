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

export const ModelSelect = ({
  model,
  setModel,
  healthCheck,
  isHealthCheckLoading,
}: {
  model: string;
  setModel: (value: string) => void;
  healthCheck: { healthy: boolean };
  isHealthCheckLoading: boolean;
}) => {
  // 모델에 따른 표시 텍스트 매핑
  const getModelDisplayText = (modelValue: string) => {
    switch (modelValue) {
      case "stable-diffusion-xl":
        return "Stable Diffusion XL";
      case "dall-e-3":
        return "Dall-E 3";
      default:
        return "모델 선택";
    }
  };
  console.log(healthCheck);
  return (
    <Select
      value={model}
      onValueChange={(value) => setModel(value)}
      disabled={isHealthCheckLoading}
    >
      <SelectTrigger className="border-2 focus:border-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
        <SelectValue placeholder="모델 선택">
          <div className="flex items-center gap-2">
            {isHealthCheckLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                <span className="text-gray-500">모델 상태 확인 중...</span>
              </>
            ) : (
              getModelDisplayText(model)
            )}
          </div>
        </SelectValue>
      </SelectTrigger>

      <SelectContent>
        <SelectItem
          value="stable-diffusion-xl"
          disabled={healthCheck?.healthy === false}
        >
          <div className="flex items-center gap-2">
            {healthCheck?.healthy === true ? (
              <Badge variant="secondary" className="text-xs">
                <MiniDot />
                추천
              </Badge>
            ) : (
              <Badge variant="secondary" className="text-xs">
                <MiniDot color="red" />
                오프라인
              </Badge>
            )}
            Stable Diffusion XL
          </div>
        </SelectItem>
        <SelectItem value="dall-e-3">Dall-E 3</SelectItem>
      </SelectContent>
    </Select>
  );
};
