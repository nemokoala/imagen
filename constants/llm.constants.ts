export const DEFAULT_LLM_PROVIDER = "ollama";
export const DEFAULT_GEMINI_MODEL = "gemini-2.5-flash-lite";
export const DEFAULT_OLLAMA_MODEL = "gemma3:4b";

export const LLM_PROVIDER_OPTIONS = [
  { value: "ollama", label: "Ollama (로컬)", description: "로컬 서버 (무료)" },
  { value: "gemini", label: "Gemini Flash Lite", description: "Google API (유료)" },
] as const;

export const GEMINI_MODEL_OPTIONS = [
  {
    value: "gemini-2.5-flash-lite",
    label: "Gemini 2.5 Flash Lite",
    cost: "$0.10 / 1M input",
  },
] as const;

export const OLLAMA_MODEL_OPTIONS = [
  {
    value: "gemma3:4b",
    label: "Gemma 3 4B",
    description: "기존 로컬 모델",
  },
  {
    value: "gemma4:e2b",
    label: "Gemma 4 E2B",
    description: "신규 로컬 모델",
  },
] as const;

export type LlmProvider = (typeof LLM_PROVIDER_OPTIONS)[number]["value"];
export type GeminiModel = (typeof GEMINI_MODEL_OPTIONS)[number]["value"];

export function isValidLlmProvider(value: string): value is LlmProvider {
  return LLM_PROVIDER_OPTIONS.some((option) => option.value === value);
}

export function isValidGeminiModel(value: string): value is GeminiModel {
  return GEMINI_MODEL_OPTIONS.some((option) => option.value === value);
}

export function getOllamaModelLabel(value: string): string {
  return (
    OLLAMA_MODEL_OPTIONS.find((option) => option.value === value)?.label ??
    value
  );
}
