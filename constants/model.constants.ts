import { ImageRatio } from "@/types/image.interfaces";
import { Model } from "@/types/model.interfaces";

interface RatioResolution {
  width: number;
  height: number;
  size: string;
}

interface ModelRatioConfig {
  supportedRatios: ImageRatio[];
  resolutions: Partial<Record<ImageRatio, RatioResolution>>;
  /** Google Imagen 등 aspectRatio 문자열을 직접 사용하는 경우 */
  aspectRatioMap?: Partial<Record<ImageRatio, string>>;
}

export const MODEL_RATIO_CONFIG: Record<Model, ModelRatioConfig> = {
  [Model.DALL_E_3]: {
    supportedRatios: [
      ImageRatio.RATIO_1_1,
      ImageRatio.RATIO_9_16,
      ImageRatio.RATIO_16_9,
    ],
    resolutions: {
      [ImageRatio.RATIO_1_1]: { width: 1024, height: 1024, size: "1024x1024" },
      [ImageRatio.RATIO_9_16]: {
        width: 1024,
        height: 1792,
        size: "1024x1792",
      },
      [ImageRatio.RATIO_16_9]: {
        width: 1792,
        height: 1024,
        size: "1792x1024",
      },
    },
  },
  [Model.STABLE_DIFFUSION_XL]: {
    supportedRatios: [
      ImageRatio.RATIO_1_1,
      ImageRatio.RATIO_9_16,
      ImageRatio.RATIO_16_9,
    ],
    resolutions: {
      [ImageRatio.RATIO_1_1]: { width: 1024, height: 1024, size: "1024x1024" },
      [ImageRatio.RATIO_9_16]: { width: 768, height: 1344, size: "768x1344" },
      [ImageRatio.RATIO_16_9]: { width: 1344, height: 768, size: "1344x768" },
    },
  },
  [Model.GOOGLE_IMAGEN]: {
    supportedRatios: [
      ImageRatio.RATIO_1_1,
      ImageRatio.RATIO_9_16,
      ImageRatio.RATIO_16_9,
    ],
    resolutions: {
      [ImageRatio.RATIO_1_1]: { width: 1024, height: 1024, size: "1024x1024" },
      [ImageRatio.RATIO_9_16]: {
        width: 1024,
        height: 1792,
        size: "1024x1792",
      },
      [ImageRatio.RATIO_16_9]: {
        width: 1792,
        height: 1024,
        size: "1792x1024",
      },
    },
    aspectRatioMap: {
      [ImageRatio.RATIO_1_1]: "1:1",
      [ImageRatio.RATIO_9_16]: "9:16",
      [ImageRatio.RATIO_16_9]: "16:9",
    },
  },
  [Model.Z_IMAGE]: {
    supportedRatios: [
      ImageRatio.RATIO_1_1,
      ImageRatio.RATIO_9_16,
      ImageRatio.RATIO_16_9,
    ],
    resolutions: {
      [ImageRatio.RATIO_1_1]: { width: 1024, height: 1024, size: "1024x1024" },
      [ImageRatio.RATIO_9_16]: { width: 720, height: 1280, size: "720x1280" },
      [ImageRatio.RATIO_16_9]: { width: 1280, height: 720, size: "1280x720" },
    },
  },
  [Model.NANO_BANANA]: {
    supportedRatios: [ImageRatio.RATIO_1_1],
    resolutions: {
      [ImageRatio.RATIO_1_1]: { width: 1024, height: 1024, size: "1024x1024" },
    },
  },
};

/** 모델+ratio에 맞는 해상도 반환 (없으면 1024x1024 기본값) */
export function getResolution(model: Model, ratio: ImageRatio): RatioResolution {
  return (
    MODEL_RATIO_CONFIG[model]?.resolutions[ratio] ?? {
      width: 1024,
      height: 1024,
      size: "1024x1024",
    }
  );
}

/** 모델이 해당 ratio를 지원하는지 확인 */
export function isSupportedRatio(model: Model, ratio: ImageRatio): boolean {
  return MODEL_RATIO_CONFIG[model]?.supportedRatios.includes(ratio) ?? false;
}
