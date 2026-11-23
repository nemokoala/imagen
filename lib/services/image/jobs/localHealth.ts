import type { LocalModel } from "@/constants/model.constants";
import { Model } from "@/types/model.interfaces";
import { imageGenerationService } from "../imageGenerationService";
import { qwenImageService } from "../qwenImageService";

// Qwen은 ComfyUI가 켜져 있어도 모델 파일이 없으면 못 쓰므로 모델 단위로 확인한다.
const HEALTH_CHECKS: Record<LocalModel, () => Promise<boolean>> = {
  [Model.Z_IMAGE]: () => imageGenerationService.comfyUIHealthCheck(),
  [Model.QWEN_IMAGE_21]: () => qwenImageService.qwenImage21HealthCheck(),
  [Model.STABLE_DIFFUSION_XL]: () => imageGenerationService.stableHealthCheck(),
};

interface HealthEntry {
  healthy: boolean;
  checkedAt: number;
}

// 워커(instrumentation)와 API 라우트는 번들이 달라 모듈 상태를 공유하지 못하므로 globalThis에 둔다.
const globalForHealth = globalThis as typeof globalThis & {
  __localModelHealth?: Map<LocalModel, HealthEntry>;
};
const cache = (globalForHealth.__localModelHealth ??= new Map());

/** maxAgeMs 안에 확인한 결과가 있으면 다시 묻지 않는다. */
export async function checkLocalModelHealth(
  model: LocalModel,
  maxAgeMs = 0,
): Promise<boolean> {
  const cached = cache.get(model);
  if (cached && Date.now() - cached.checkedAt <= maxAgeMs) {
    return cached.healthy;
  }

  const healthy = await HEALTH_CHECKS[model]().catch(() => false);
  cache.set(model, { healthy, checkedAt: Date.now() });
  return healthy;
}

export function getCachedLocalModelHealth(model: LocalModel): boolean | undefined {
  return cache.get(model)?.healthy;
}

export function markLocalModelUnavailable(model: LocalModel): void {
  cache.set(model, { healthy: false, checkedAt: Date.now() });
}
