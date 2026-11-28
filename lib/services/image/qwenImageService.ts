// Qwen Image 2.1 생성·편집은 대기열 워커(jobs/localRunners.ts)가 실행한다. 여기에는 상태 확인만 남는다.
export const qwenImageService = {
  async qwenImage21HealthCheck(): Promise<boolean> {
    const comfyUrl = process.env.COMFYUI_URL?.replace(/\/$/, "");
    if (!comfyUrl) return false;
    try {
      const response = await fetch(`${comfyUrl}/object_info`, {
        signal: AbortSignal.timeout(5000),
      });
      if (!response.ok) return false;
      const nodes = await response.json();
      const models = nodes.UNETLoader?.input?.required?.unet_name?.[0];
      const clips = nodes.CLIPLoader?.input?.required?.clip_name?.[0];
      const vaes = nodes.VAELoader?.input?.required?.vae_name?.[0];
      return Boolean(
        nodes.TextEncodeQwenImage21 &&
          models?.includes("qwen_image_2.1_int8_convrot.safetensors") &&
          clips?.includes("qwen3vl_8b_int8_convrot.safetensors") &&
          vaes?.includes("qwen_image_2.1_vae_bf16.safetensors"),
      );
    } catch {
      return false;
    }
  },
};
