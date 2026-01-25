"use client";
import { Badge } from "@/components/ui/badge";
import { Loader2, X } from "lucide-react";
import { useGetCategories } from "@/queries/category/queries";
import { cn } from "@/lib/utils";

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface CategorySelectProps {
  selectedCategories: string[]; // slug 배열
  onCategoriesChange: (categories: string[]) => void;
  disabled?: boolean;
  isSuggesting?: boolean; // 외부에서 전달받는 로딩 상태
}

export function CategorySelect({
  selectedCategories,
  onCategoriesChange,
  disabled = false,
  isSuggesting = false,
}: CategorySelectProps) {
  const { data: categories = [], isLoading: isCategoriesLoading } =
    useGetCategories();

  const handleToggleCategory = (slug: string) => {
    if (disabled || isSuggesting) return;

    const isSelected = selectedCategories.includes(slug);
    if (isSelected) {
      onCategoriesChange(selectedCategories.filter((c) => c !== slug));
    } else {
      onCategoriesChange([...selectedCategories, slug]);
    }
  };

  if (isCategoriesLoading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm">카테고리 로딩 중...</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-subtitle">카테고리</p>
        {isSuggesting && (
          <div className="flex items-center gap-1 text-xs text-purple-600">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>AI 분석 중...</span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((category: Category) => {
          const isSelected = selectedCategories.includes(category.slug);
          return (
            <Badge
              key={category.id}
              variant={isSelected ? "default" : "outline"}
              className={cn(
                "cursor-pointer transition-all duration-200 select-none",
                isSelected
                  ? "bg-purple-600 hover:bg-purple-700 text-white border-purple-600"
                  : "hover:bg-purple-50 hover:border-purple-300 text-muted-foreground",
                disabled && "opacity-50 cursor-not-allowed",
              )}
              onClick={() => handleToggleCategory(category.slug)}
            >
              {category.name}
              {isSelected && <X className="h-3 w-3 ml-1" />}
            </Badge>
          );
        })}
      </div>

      {selectedCategories.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {selectedCategories.length}개 카테고리 선택됨
          <span className="ml-1 text-purple-500">(AI 추천)</span>
        </p>
      )}
    </div>
  );
}
