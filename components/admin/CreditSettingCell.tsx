"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

export function CreditSettingCell({
  initialValue,
  isEditing,
  onChange,
}: {
  initialValue: number;
  isEditing: boolean;
  onChange: (value: number) => void;
}) {
  const [inputValue, setInputValue] = useState(initialValue.toString());

  useEffect(() => {
    setInputValue(initialValue.toString());
  }, [initialValue, isEditing]);

  if (!isEditing) {
    return <span>{initialValue} 크레딧</span>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    const num = parseInt(e.target.value);
    if (!isNaN(num) && num >= 0) onChange(num);
    else if (e.target.value === "") onChange(0);
  };

  return (
    <Input
      type="number"
      value={inputValue}
      onChange={handleChange}
      className="w-32"
      min="0"
    />
  );
}
