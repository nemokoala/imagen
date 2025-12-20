import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function downloadImage(imageUrl: string, prompt?: string) {
  const link = document.createElement("a");
  link.href = imageUrl;
  // prompt가 있으면 파일명에 포함 (안전한 파일명으로 변환)
  const safePrompt = prompt
    ? prompt
        .slice(0, 50)
        .replace(/[^a-z0-9가-힣]/gi, "-")
        .replace(/-+/g, "-")
    : "ai-generated-image";
  link.download = `${safePrompt}-${Date.now()}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
