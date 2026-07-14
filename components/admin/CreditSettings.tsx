"use client";

import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import {
  useGetCreditSettingsQuery,
  useUpdateCreditSettingsMutation,
} from "@/queries/admin/creditSettings";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { CreditSettings } from "@/lib/services/admin/creditSettingsService";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { CreditSettingCell } from "@/components/admin/CreditSettingCell";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  CREDIT_MODEL_SETTING_OPTIONS,
  CreditModelEnabledKey,
  CreditModelKey,
} from "@/constants/credit.constants";

type SettingRow = {
  creditKey: CreditModelKey;
  enabledKey: CreditModelEnabledKey;
  name: string;
  cost: number;
  enabled: boolean;
};

function ModelEnabledCell({
  initialValue,
  isEditing,
  onChange,
}: {
  initialValue: boolean;
  isEditing: boolean;
  onChange: (value: boolean) => void;
}) {
  const [checked, setChecked] = useState(initialValue);

  useEffect(() => {
    setChecked(initialValue);
  }, [initialValue, isEditing]);

  if (!isEditing) {
    return (
      <Badge variant={initialValue ? "default" : "destructive"}>
        {initialValue ? "사용" : "중지"}
      </Badge>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Switch
        checked={checked}
        onCheckedChange={(value) => {
          setChecked(value);
          onChange(value);
        }}
      />
      <span className="text-sm text-muted-foreground">
        {checked ? "사용" : "중지"}
      </span>
    </div>
  );
}

export function CreditSettingsComponent() {
  const { data, isLoading, error } = useGetCreditSettingsQuery();
  const updateMutation = useUpdateCreditSettingsMutation();

  const editingValuesRef = useRef<Partial<CreditSettings>>({});
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    if (data) {
      editingValuesRef.current = { ...data };
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    editingValuesRef.current = {};
    setIsEditing(false);
  };

  const handleCreditChange = useCallback(
    (key: CreditModelKey, value: number) => {
      editingValuesRef.current[key] = value;
    },
    [],
  );

  const handleEnabledChange = useCallback(
    (key: CreditModelEnabledKey, value: boolean) => {
      editingValuesRef.current[key] = value;
    },
    [],
  );

  const handleSave = async () => {
    try {
      await updateMutation.mutateAsync(editingValuesRef.current);
      toast.success("크레딧 설정이 저장되었습니다.");
      editingValuesRef.current = {};
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      toast.error("크레딧 설정 저장에 실패했습니다.");
    }
  };

  const tableData = useMemo<SettingRow[]>(() => {
    return CREDIT_MODEL_SETTING_OPTIONS.map((option) => ({
      creditKey: option.creditKey,
      enabledKey: option.enabledKey,
      name: option.label,
      cost: data?.[option.creditKey] ?? option.defaultCost,
      enabled: data?.[option.enabledKey] ?? true,
    }));
  }, [data]);

  const columns = useMemo<ColumnDef<SettingRow>[]>(
    () => [
      {
        accessorKey: "name",
        header: "모델",
        cell: ({ row }) => (
          <span className="font-medium">{row.original.name}</span>
        ),
      },
      {
        accessorKey: "enabled",
        header: "사용 여부",
        cell: ({ row }) => (
          <ModelEnabledCell
            initialValue={row.original.enabled}
            isEditing={isEditing}
            onChange={(value) =>
              handleEnabledChange(row.original.enabledKey, value)
            }
          />
        ),
      },
      {
        accessorKey: "cost",
        header: "크레딧 비용",
        cell: ({ row }) => (
          <CreditSettingCell
            initialValue={row.original.cost}
            isEditing={isEditing}
            onChange={(value) =>
              handleCreditChange(row.original.creditKey, value)
            }
          />
        ),
      },
    ],
    [isEditing, handleCreditChange, handleEnabledChange],
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
