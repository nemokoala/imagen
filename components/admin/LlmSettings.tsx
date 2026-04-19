"use client";

import { useState } from "react";
import {
  useGetLlmSettingsQuery,
  useUpdateLlmSettingsMutation,
} from "@/queries/admin/llmSettings";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import type { LlmSettings } from "@/lib/services/admin/llmSettingsService";
import {
  DEFAULT_GEMINI_MODEL,
  DEFAULT_LLM_PROVIDER,
  DEFAULT_OLLAMA_MODEL,
  GEMINI_MODEL_OPTIONS,
  LLM_PROVIDER_OPTIONS,
  OLLAMA_MODEL_OPTIONS,
  getOllamaModelLabel,
} from "@/constants/llm.constants";

export function LlmSettingsComponent() {
  const { data, isLoading, error } = useGetLlmSettingsQuery();
  const updateMutation = useUpdateLlmSettingsMutation();

  const [editingValues, setEditingValues] = useState<Partial<LlmSettings>>({});
  const [isEditing, setIsEditing] = useState(false);

  const currentProvider =
    editingValues.provider ?? data?.provider ?? DEFAULT_LLM_PROVIDER;
  const currentGeminiModel =
    editingValues.geminiModel ?? data?.geminiModel ?? DEFAULT_GEMINI_MODEL;
  const currentOllamaModel =
    editingValues.ollamaModel ?? data?.ollamaModel ?? DEFAULT_OLLAMA_MODEL;
  const currentTranslateEnabled =
    editingValues.translateEnabled ?? data?.translateEnabled ?? true;
  const currentCategoryEnabled =
    editingValues.categoryEnabled ?? data?.categoryEnabled ?? true;
  const selectedOllamaPreset = OLLAMA_MODEL_OPTIONS.some(
    (option) => option.value === currentOllamaModel,
  )
    ? currentOllamaModel
    : "custom";

  const handleEdit = () => {
    if (data) {
      setEditingValues(data);
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    setEditingValues({});
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      await updateMutation.mutateAsync(editingValues);
      toast.success("LLM 설정이 저장되었습니다.");
      setIsEditing(false);
      setEditingValues({});
    } catch {
      toast.error("LLM 설정 저장에 실패했습니다.");
    }
  };

  if (isLoading) return <div className="p-4">로딩 중...</div>;
  if (error) return <div className="p-4 text-red-500">에러가 발생했습니다.</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">LLM 텍스트 모델 설정</h2>
        {!isEditing ? (
          <Button onClick={handleEdit}>수정</Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={updateMutation.isPending}>
              저장
            </Button>
            <Button variant="outline" onClick={handleCancel}>
              취소
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-5 max-w-md">
        {/* 기능 on/off */}
        <div className="space-y-3">
          <label className="text-sm font-medium">기능 설정</label>

          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <p className="text-sm font-medium">프롬프트 번역</p>
              <p className="text-xs text-muted-foreground">
                한국어 프롬프트를 SDXL용 영어로 자동 변환
              </p>
            </div>
            <Switch
              checked={currentTranslateEnabled}
              onCheckedChange={(checked) =>
                isEditing &&
                setEditingValues((prev) => ({
                  ...prev,
                  translateEnabled: checked,
                }))
              }
              disabled={!isEditing}
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <p className="text-sm font-medium">카테고리 추천</p>
              <p className="text-xs text-muted-foreground">
                프롬프트 내용을 분석해 카테고리 자동 분류
              </p>
            </div>
            <Switch
              checked={currentCategoryEnabled}
              onCheckedChange={(checked) =>
                isEditing &&
                setEditingValues((prev) => ({
                  ...prev,
                  categoryEnabled: checked,
                }))
              }
              disabled={!isEditing}
            />
          </div>
        </div>

        {/* 프로바이더 선택 */}
        <div className="space-y-2">
          <label className="text-sm font-medium">프로바이더</label>
          {isEditing ? (
            <Select
              value={currentProvider}
              onValueChange={(value) =>
                setEditingValues((prev) => ({ ...prev, provider: value }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LLM_PROVIDER_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm">
                {LLM_PROVIDER_OPTIONS.find((o) => o.value === data?.provider)
                  ?.label ?? data?.provider}
              </span>
              <Badge variant={data?.provider === "ollama" ? "secondary" : "default"}>
                {data?.provider === "ollama" ? "무료" : "유료"}
              </Badge>
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            {LLM_PROVIDER_OPTIONS.find((o) => o.value === currentProvider)?.description}
          </p>
        </div>

        {/* Gemini 모델 선택 */}
        {currentProvider === "gemini" && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Gemini 모델</label>
            {isEditing ? (
              <Select
                value={currentGeminiModel}
                onValueChange={(value) =>
                  setEditingValues((prev) => ({ ...prev, geminiModel: value }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {GEMINI_MODEL_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}{" "}
                      <span className="text-muted-foreground">
                        ({option.cost})
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-sm">
                  {GEMINI_MODEL_OPTIONS.find(
                    (o) => o.value === data?.geminiModel,
                  )?.label ?? data?.geminiModel}
                </span>
                <Badge variant="outline">
                  {GEMINI_MODEL_OPTIONS.find(
                    (o) => o.value === data?.geminiModel,
                  )?.cost}
                </Badge>
              </div>
            )}
          </div>
        )}

        {/* Ollama 모델 정보 */}
        {currentProvider === "ollama" && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Ollama 모델</label>
            {isEditing ? (
              <div className="space-y-2">
                <Select
                  value={selectedOllamaPreset}
                  onValueChange={(value) => {
                    if (value === "custom") return;
                    setEditingValues((prev) => ({
                      ...prev,
                      ollamaModel: value,
                    }));
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {OLLAMA_MODEL_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}{" "}
                        <span className="text-muted-foreground">
                          ({option.value})
                        </span>
                      </SelectItem>
                    ))}
                    <SelectItem value="custom">직접 입력</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  value={currentOllamaModel}
                  onChange={(event) =>
                    setEditingValues((prev) => ({
                      ...prev,
                      ollamaModel: event.target.value,
                    }))
                  }
                  placeholder="예: gemma4:e2b, gemma4:e4b"
                />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-sm">
                  {getOllamaModelLabel(data?.ollamaModel ?? DEFAULT_OLLAMA_MODEL)}
                </span>
                <Badge variant="secondary">
                  {data?.ollamaModel ?? DEFAULT_OLLAMA_MODEL}
                </Badge>
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Ollama에 설치된 모델 태그를 입력하세요. 저장 후 번역과 카테고리
              추천에 바로 적용됩니다.
            </p>
          </div>
        )}
      </div>

      {isEditing && (
        <div className="text-sm text-gray-500">
          * 변경사항은 저장 후 즉시 적용됩니다.
        </div>
      )}
    </div>
  );
}
