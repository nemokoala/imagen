import { prisma } from "@/lib/prisma";
import { ApiError } from "@/lib/errors/AppError";

export interface CreditSettings {
  dallE3: number;
  stableDiffusionXl: number;
  googleImagen: number;
  nanoBanana: number;
  zImage: number;
}

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
          dallE3: 20,
          stableDiffusionXl: 5,
          googleImagen: 20,
          nanoBanana: 20,
          zImage: 10,
        },
      });
    }

    return {
      dallE3: settings.dallE3,
      stableDiffusionXl: settings.stableDiffusionXl,
      googleImagen: settings.googleImagen,
      nanoBanana: settings.nanoBanana,
      zImage: settings.zImage,
    };
  },

  async updateCreditSettings(
    data: Partial<CreditSettings>
  ): Promise<CreditSettings> {
    // 유효성 검사
    const fields = [
      "dallE3",
      "stableDiffusionXl",
      "googleImagen",
      "nanoBanana",
      "zImage",
    ] as const;

    for (const field of fields) {
      if (data[field] !== undefined) {
        if (typeof data[field] !== "number" || data[field] < 0) {
          throw new ApiError(
            `${field}는 0 이상의 숫자여야 합니다.`,
            400,
            "INVALID_CREDIT_VALUE"
          );
        }
      }
    }

    // 설정이 없으면 생성
    const existing = await prisma.creditSettings.findUnique({
      where: { id: 1 },
    });

    if (!existing) {
      const defaultSettings = await this.getCreditSettings();
      await prisma.creditSettings.create({
        data: {
          id: 1,
          ...defaultSettings,
          ...data,
        },
      });
    } else {
      await prisma.creditSettings.update({
        where: { id: 1 },
        data,
      });
    }

    return this.getCreditSettings();
  },
};

