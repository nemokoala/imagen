"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { User } from "@/types/user.interfaces";

export function CreditCell({
  user,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  isPending,
}: {
  user: User;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (credits: number) => void;
  onCancel: () => void;
  isPending: boolean;
}) {
  const [creditValue, setCreditValue] = useState(user.credits.toString());

  if (!isEditing) {
    return (
      <div className="flex items-center gap-2">
        <span>{user.credits}</span>
        <Button size="sm" variant="outline" onClick={onEdit}>
          수정
        </Button>
      </div>
    );
  }

  const handleSave = () => {
    const credits = parseInt(creditValue);
    if (isNaN(credits) || credits < 0) {
      toast.error("유효한 크레딧 값을 입력해주세요.");
      return;
    }
    onSave(credits);
  };

  return (
    <div className="flex gap-2 items-center">
      <Input
        type="number"
        value={creditValue}
        onChange={(e) => setCreditValue(e.target.value)}
        className="w-24 h-8"
        min="0"
        autoFocus
      />
      <Button size="sm" onClick={handleSave} disabled={isPending}>
        저장
      </Button>
      <Button size="sm" variant="outline" onClick={onCancel}>
        취소
      </Button>
    </div>
  );
}
