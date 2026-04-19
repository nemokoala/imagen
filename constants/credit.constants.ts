import { Model } from "@/types/model.interfaces";

export const CREDIT_MODEL_KEYS = [
  "dallE3",
  "stableDiffusionXl",
  "googleImagen",
  "nanoBanana",
  "zImage",
] as const;

export const CREDIT_MODEL_ENABLED_KEYS = [
  "dallE3Enabled",
  "stableDiffusionXlEnabled",
  "googleImagenEnabled",
  "nanoBananaEnabled",
  "zImageEnabled",
] as const;

export type CreditModelKey = (typeof CREDIT_MODEL_KEYS)[number];
export type CreditModelEnabledKey =
  (typeof CREDIT_MODEL_ENABLED_KEYS)[number];

export type CreditSettingsShape = Record<CreditModelKey, number> &
  Record<CreditModelEnabledKey, boolean>;

export const DEFAULT_CREDIT_SETTINGS: CreditSettingsShape = {
  dallE3: 20,
  stableDiffusionXl: 5,
  googleImagen: 20,
  nanoBanana: 20,
  zImage: 10,
  dallE3Enabled: true,
  stableDiffusionXlEnabled: true,
  googleImagenEnabled: true,
  nanoBananaEnabled: true,
  zImageEnabled: true,
};

export type CreditModelSettingOption = {
  model: Model;
  label: string;
  creditKey: CreditModelKey;
  enabledKey: CreditModelEnabledKey;
  defaultCost: number;
};

export const CREDIT_MODEL_SETTING_OPTIONS: CreditModelSettingOption[] = [
  {
    model: Model.STABLE_DIFFUSION_XL,
    label: "Stable Diffusion XL",
    creditKey: "stableDiffusionXl",
    enabledKey: "stableDiffusionXlEnabled",
    defaultCost: DEFAULT_CREDIT_SETTINGS.stableDiffusionXl,
  },
  {
    model: Model.Z_IMAGE,
    label: "Z-Image",
    creditKey: "zImage",
    enabledKey: "zImageEnabled",
    defaultCost: DEFAULT_CREDIT_SETTINGS.zImage,
  },
  {
    model: Model.DALL_E_3,
    label: "DALL-E 3",
    creditKey: "dallE3",
    enabledKey: "dallE3Enabled",
    defaultCost: DEFAULT_CREDIT_SETTINGS.dallE3,
  },
  {
    model: Model.GOOGLE_IMAGEN,
    label: "Google Imagen",
    creditKey: "googleImagen",
    enabledKey: "googleImagenEnabled",
    defaultCost: DEFAULT_CREDIT_SETTINGS.googleImagen,
  },
  {
    model: Model.NANO_BANANA,
    label: "Nano Banana",
    creditKey: "nanoBanana",
    enabledKey: "nanoBananaEnabled",
    defaultCost: DEFAULT_CREDIT_SETTINGS.nanoBanana,
  },
];

export const MODEL_CREDIT_SETTINGS =
  CREDIT_MODEL_SETTING_OPTIONS.reduce<Record<Model, CreditModelSettingOption>>(
    (acc, option) => {
      acc[option.model] = option;
      return acc;
    },
    {} as Record<Model, CreditModelSettingOption>,
  );

export const creditConstants = {
  DALL_E_3: DEFAULT_CREDIT_SETTINGS.dallE3,
  STABLE_DIFFUSION_XL: DEFAULT_CREDIT_SETTINGS.stableDiffusionXl,
  GOOGLE_IMAGEN: DEFAULT_CREDIT_SETTINGS.googleImagen,
  NANO_BANANA: DEFAULT_CREDIT_SETTINGS.nanoBanana,
  ZIMAGE: DEFAULT_CREDIT_SETTINGS.zImage,
};
