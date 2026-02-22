"use client";

import { useState, useMemo } from "react";
import {
  useGetCreditSettingsQuery,
  useUpdateCreditSettingsMutation,
} from "@/queries/admin/creditSettings";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CreditSettings } from "@/lib/services/admin/creditSettingsService";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";

const MODEL_NAMES: Record<keyof CreditSettings, string> = {
  dallE3: "DALL-E 3",
  stableDiffusionXl: "Stable Diffusion XL",
  googleImagen: "Google Imagen",
  nanoBanana: "Nano Banana",
  zImage: "Z-Image",
};

type SettingRow = {
  key: keyof CreditSettings;
  name: string;
  cost: number;
};

export function CreditSettingsComponent() {
  const { data, isLoading, error } = useGetCreditSettingsQuery();
  const updateMutation = useUpdateCreditSettingsMutation();

  const [editingValues, setEditingValues] = useState<Partial<CreditSettings>>(
    {},
  );
  const [isEditing, setIsEditing] = useState(false);

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

  const handleChange = (key: keyof CreditSettings, value: string) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 0) {
      setEditingValues((prev) => ({
        ...prev,
        [key]: numValue,
      }));
    } else if (value === "") {
      setEditingValues((prev) => ({
        ...prev,
        [key]: 0,
      }));
    }
  };

  const handleSave = async () => {
    try {
      await updateMutation.mutateAsync(editingValues);
      toast.success("크레딧 설정이 저장되었습니다.");
      setIsEditing(false);
      setEditingValues({});
    } catch (error) {
      console.error(error);
      toast.error("크레딧 설정 저장에 실패했습니다.");
    }
  };

  const tableData = useMemo<SettingRow[]>(() => {
    return (Object.keys(MODEL_NAMES) as Array<keyof CreditSettings>).map(
      (key) => ({
        key,
        name: MODEL_NAMES[key],
        cost: editingValues[key] ?? data?.[key] ?? 0,
      }),
    );
  }, [editingValues, data]);

  const columns = useMemo<ColumnDef<SettingRow>[]>(
    () => [
      {
        accessorKey: "name",
        header: "모델",
        size: 200,
        cell: ({ row }) => (
          <span className="font-medium">{row.original.name}</span>
        ),
      },
      {
        accessorKey: "cost",
        header: "크레딧 비용",
        size: 300,
        cell: ({ row }) => {
          const key = row.original.key;
          return isEditing ? (
            <Input
              type="number"
              value={editingValues[key] ?? data?.[key] ?? 0}
              onChange={(e) => handleChange(key, e.target.value)}
              className="w-32"
              min="0"
            />
          ) : (
            <span>{data?.[key] ?? 0} 크레딧</span>
          );
        },
      },
    ],
    [isEditing, editingValues, data],
  );

  if (isLoading) {
    return <div className="p-4">로딩 중...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">에러가 발생했습니다.</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">크레딧 비용 설정</h2>
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

      <DataTable columns={columns} data={tableData} />

      {isEditing && (
        <div className="text-sm text-gray-500">
          * 변경사항은 저장 후 즉시 적용됩니다.
        </div>
      )}
    </div>
  );
}
