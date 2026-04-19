import { ApiError } from "@/lib/errors/AppError";
import { prisma } from "@/lib/prisma";
import { Model } from "@/types/model.interfaces";
import {
  CREDIT_MODEL_ENABLED_KEYS,
  CREDIT_MODEL_KEYS,
  CreditSettingsShape,
  DEFAULT_CREDIT_SETTINGS,
  MODEL_CREDIT_SETTINGS,
} from "@/constants/credit.constants";

export type CreditSettings = CreditSettingsShape;

const toCreditSettings = (settings: CreditSettings): CreditSettings => ({
  dallE3: settings.dallE3,
  stableDiffusionXl: settings.stableDiffusionXl,
  googleImagen: settings.googleImagen,
  nanoBanana: settings.nanoBanana,
  zImage: settings.zImage,
  dallE3Enabled: settings.dallE3Enabled,
  stableDiffusionXlEnabled: settings.stableDiffusionXlEnabled,
  googleImagenEnabled: settings.googleImagenEnabled,
  nanoBananaEnabled: settings.nanoBananaEnabled,
  zImageEnabled: settings.zImageEnabled,
});

export const creditSettingsService = {
  async getCreditSettings(): Promise<CreditSettings> {
    let settings = await prisma.creditSettings.findUnique({
      where: { id: 1 },
    });

    // 설정이 없으면 기본값으로 생성
    if (!settings) {
      settings = await prisma.creditSettings.create({
        data: {
          id: 1,
          ...DEFAULT_CREDIT_SETTINGS,
        },
      });
    }

    return toCreditSettings(settings);
  },

  async updateCreditSettings(
    data: Partial<CreditSettings>,
  ): Promise<CreditSettings> {
    const updateData: Partial<CreditSettings> = {};

    for (const field of CREDIT_MODEL_KEYS) {
      if (data[field] !== undefined) {
        if (
          typeof data[field] !== "number" ||
          !Number.isFinite(data[field]) ||
          data[field] < 0
        ) {
          throw new ApiError(
            `${field}는 0 이상의 숫자여야 합니다.`,
            400,
            "INVALID_CREDIT_VALUE",
          );
        }

        updateData[field] = data[field];
      }
    }

    for (const field of CREDIT_MODEL_ENABLED_KEYS) {
      if (data[field] !== undefined) {
        if (typeof data[field] !== "boolean") {
          throw new ApiError(
            `${field}는 boolean 값이어야 합니다.`,
            400,
            "INVALID_ENABLED_VALUE",
          );
        }

        updateData[field] = data[field];
      }
    }

    const existing = await prisma.creditSettings.findUnique({
      where: { id: 1 },
    });

    if (!existing) {
      const defaultSettings = await this.getCreditSettings();
      await prisma.creditSettings.create({
        data: {
          id: 1,
          ...defaultSettings,
          ...updateData,
        },
      });
    } else {
      await prisma.creditSettings.update({
        where: { id: 1 },
        data: updateData,
      });
    }

    return this.getCreditSettings();
  },

  async assertModelEnabled(model: Model | string): Promise<void> {
    const modelSetting = MODEL_CREDIT_SETTINGS[model as Model];

    if (!modelSetting) {
      throw new ApiError("지원하지 않는 모델입니다.", 400, "INVALID_MODEL");
    }

    const settings = await this.getCreditSettings();

    if (!settings[modelSetting.enabledKey]) {
      throw new ApiError(
        "현재 사용할 수 없는 모델입니다.",
        403,
        "MODEL_DISABLED",
      );
    }
  },
};
