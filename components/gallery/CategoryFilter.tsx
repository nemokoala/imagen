import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetCategories } from "@/queries/category/queries";
import { Skeleton } from "../ui/skeleton";

const RATIO_OPTIONS = ["1:1", "16:9", "9:16"] as const;
type RatioOption = (typeof RATIO_OPTIONS)[number];

interface CategoryFilterProps {
  selectedCategories: string[];
  handleSelectAll: () => void;
  handleToggleCategory: (slug: string) => void;
  search?: string;
  setSearch?: (value: string) => void;
  selectedRatio?: string;
  onToggleRatio?: (ratio: RatioOption) => void;
  /** 스크롤 컨테이너 여백만큼 툴바를 넓힐 때 등 바깥에서 덧붙이는 클래스 */
  className?: string;
}

/** 비율 모양을 그리는 작은 아이콘 */
function RatioShape({ ratio }: { ratio: RatioOption }) {
  return (
    <span
      aria-hidden
      className={cn(
        "rounded-[2px] border-[1.5px] border-current",
        ratio === "16:9" ? "h-2 w-3.5" : ratio === "9:16" ? "h-3.5 w-2" : "size-3",
      )}
    />
  );
}

/** 갤러리 위에 붙는 한 줄 필터 툴바 (카테고리 · 비율 · 검색) */
export function CategoryFilter({
  selectedCategories,
  handleSelectAll,
  handleToggleCategory,
  search = "",
  setSearch,
  selectedRatio,
  onToggleRatio,
  className,
}: CategoryFilterProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(search);

  const { data: categories = [], isLoading } = useGetCategories();

  // 외부 search 값이 변경되면 로컬 값도 업데이트
  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearch.trim()) {
      setSearch?.(localSearch.trim());
      setIsSearchOpen(false);
    }
  };

  const clearSearch = () => {
    setLocalSearch("");
    setSearch?.("");
    setIsSearchOpen(false);
  };

  const chipClass = "h-8 shrink-0 rounded-lg px-3 text-sm font-medium";
  // 선택된 칩은 연한 포인트색, 나머지는 배경 없이 둔다.
  const chipVariant = (selected: boolean) => (selected ? "soft" : "ghost");

  return (
    <div
      className={cn(
        "sticky top-0 z-20 border-b border-border bg-background/85 py-2.5 backdrop-blur-md",
        className,
      )}
    >
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
        {isSearchOpen ? (
          <form
            onSubmit={handleSearchSubmit}
            className="flex min-w-0 flex-1 items-center gap-2"
          >
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") setIsSearchOpen(false);
                }}
                placeholder="프롬프트로 검색"
                aria-label="프롬프트 검색"
                className="h-9 bg-card pl-9"
                autoFocus
              />
            </div>
            <Button type="submit" size="sm" className="h-9">
              검색
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="h-9 text-muted-foreground"
              onClick={() => setIsSearchOpen(false)}
            >
              취소
            </Button>
          </form>
        ) : (
          // 카테고리: 넘치면 가로로 스크롤하고 오른쪽 끝을 흐리게 처리한다
          <div className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto pr-8 scrollbar-hide [mask-image:linear-gradient(to_right,#000_calc(100%-40px),transparent)]">
            {search && (
              <Button
                variant="soft"
                onClick={clearSearch}
                aria-label={`검색어 "${search}" 지우기`}
                className={cn(chipClass, "gap-1.5 pr-2")}
              >
                <Search className="size-3.5" />
                <span className="max-w-[120px] truncate">{search}</span>
                <X className="size-3.5 opacity-70" />
              </Button>
            )}
            <Button
              onClick={handleSelectAll}
              variant={chipVariant(selectedCategories.length === 0)}
              aria-pressed={selectedCategories.length === 0}
              className={chipClass}
            >
              전체
            </Button>
            {isLoading
              ? Array.from({ length: 7 }).map((_, i) => (
                  <Skeleton key={i} className="h-8 w-16 shrink-0 rounded-lg" />
                ))
              : categories.map((cat) => {
                  const selected = selectedCategories.includes(cat.slug);
                  return (
                    <Button
                      key={cat.id}
                      onClick={() => handleToggleCategory(cat.slug)}
                      variant={chipVariant(selected)}
                      aria-pressed={selected}
                      className={cn(
                        chipClass,
                        !selected && "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {cat.name}
                    </Button>
                  );
                })}
          </div>
        )}

        <div className="flex shrink-0 items-center justify-between gap-2 md:justify-end">
          {onToggleRatio && (
            <div
              role="group"
              aria-label="비율 필터"
              className="flex items-center gap-0.5 rounded-lg bg-muted p-0.5"
            >
              {RATIO_OPTIONS.map((r) => {
                const active = selectedRatio === r;
                return (
                  <button
                    key={r}
                    type="button"
                    aria-pressed={active}
                    title={active ? "다시 누르면 해제돼요" : `${r} 비율만 보기`}
                    onClick={() => onToggleRatio(r)}
                    className={cn(
                      "flex h-7 cursor-pointer items-center gap-1.5 rounded-md px-2.5 text-xs font-medium transition-colors",
                      active
                        ? "bg-card text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <RatioShape ratio={r} />
                    {r}
                  </button>
                );
              })}
            </div>
          )}

          {!isSearchOpen && setSearch && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(true)}
              aria-label="검색"
              className="size-8 rounded-lg text-muted-foreground hover:text-foreground"
            >
              <Search className="size-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
