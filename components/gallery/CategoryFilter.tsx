import { Category } from "@/types/image.interfaces";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search, X, ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const RATIO_OPTIONS = ["1:1", "16:9", "9:16"] as const;
type RatioOption = (typeof RATIO_OPTIONS)[number];

interface CategoryFilterProps {
  categories: Category[];
  selectedCategories: string[];
  handleSelectAll: () => void;
  handleToggleCategory: (slug: string) => void;
  search?: string;
  setSearch?: (value: string) => void;
  selectedRatio?: string;
  onToggleRatio?: (ratio: RatioOption) => void;
}

export function CategoryFilter({
  categories,
  selectedCategories,
  handleSelectAll,
  handleToggleCategory,
  search = "",
  setSearch,
  selectedRatio,
  onToggleRatio,
}: CategoryFilterProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(search);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // 외부 search 값이 변경되면 로컬 값도 업데이트
  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearch.trim()) {
      setSearch?.(localSearch);
      setIsSearchOpen(false); // 검색 후 입력창 닫기
    }
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const clearSearch = () => {
    setLocalSearch("");
    setSearch?.("");
    setIsSearchOpen(false);
  };

  // 공통 버튼 스타일
  const iconButtonClass = "rounded-full h-9 w-9 flex-shrink-0";
  const categoryButtonClass = "rounded-full h-9 whitespace-nowrap px-4";

  if (isCollapsed === null) return null; // avoid TS error if any

  return (
    <div className="sticky top-2 z-20 mx-auto w-fit flex flex-col items-center max-w-[calc(100%-2rem)] perspective-1000">
      {/* 축소된 상태의 버튼 */}
      <div
        className={cn(
          "transition-all duration-300 ease-spring absolute top-0 z-30",
          isCollapsed
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-75 -translate-y-4 pointer-events-none",
        )}
      >
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsCollapsed(false)}
          className={cn(
            iconButtonClass,
            "!bg-background backdrop-blur-md shadow-lg border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:text-primary",
          )}
        >
          <ChevronDown size={18} />
        </Button>
      </div>

      {/* 확장된 상태의 패널 */}
      <div
        className={cn(
          "transition-all duration-300 ease-spring origin-top grid w-full",
          isCollapsed
            ? "grid-rows-[0fr] opacity-0 scale-95 pointer-events-none -translate-y-2"
            : "grid-rows-[1fr] opacity-100 scale-100 translate-y-0 pb-1",
        )}
      >
        <div className="overflow-hidden">
          <div
            className={cn(
              "bg-white/80 dark:bg-gray-800/80 py-1.5 px-1.5 w-max max-w-full mx-auto border border-gray-300 dark:border-gray-600 font-medium text-gray-800 dark:text-gray-200",
              onToggleRatio ? "rounded-2xl" : "rounded-full",
            )}
          >
            {/* 1행: 카테고리 + 검색 */}
            <div className="flex items-center gap-1.5 min-h-9 px-1">
              {isSearchOpen ? (
                <form
                  onSubmit={handleSearchSubmit}
                  className="w-full flex items-center gap-2 flex-1"
                >
                  <Input
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                    placeholder="검색어 입력..."
                    className="h-9 rounded-full border-none bg-gray-100/80 dark:bg-gray-900/80 focus-visible:ring-1 focus-visible:ring-primary flex-1 min-w-[180px] sm:w-[320px] text-gray-800 dark:text-gray-200"
                    autoFocus
                  />
                  <Button
                    type="submit"
                    variant="outline"
                    size="icon"
                    className={cn(
                      iconButtonClass,
                      "text-primary border-primary/20 hover:bg-primary/10",
                    )}
                  >
                    <Search size={18} />
                  </Button>
                </form>
              ) : (
                <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide rounded-full min-w-0 py-0.5">
                  {search && (
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button
                        onClick={clearSearch}
                        variant="gradient"
                        className={cn(
                          categoryButtonClass,
                          "gap-2 pr-2 shadow-md",
                        )}
                      >
                        <span className="max-w-[100px] truncate">{search}</span>
                        <X size={16} className="opacity-90" />
                      </Button>
                      <div className="w-px h-8 bg-foreground/30 mx-1 flex-shrink-0" />
                    </div>
                  )}
                  <Button
                    onClick={handleSelectAll}
                    variant={
                      selectedCategories.length === 0 ? "gradient" : "outline"
                    }
                    className={categoryButtonClass}
                  >
                    전체
                  </Button>
                  {categories.map((cat) => (
                    <Button
                      key={cat.id}
                      onClick={() => handleToggleCategory(cat.slug)}
                      variant={
                        selectedCategories.includes(cat.slug)
                          ? "gradient"
                          : "outline"
                      }
                      className={categoryButtonClass}
                    >
                      {cat.name}
                    </Button>
                  ))}
                </div>
              )}

              <div className="flex-shrink-0 flex items-center justify-center border-l border-foreground/30 pl-1.5 ml-0.5">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleSearch}
                  className={cn(
                    iconButtonClass,
                    isSearchOpen
                      ? "text-gray-400 hover:text-red-500 hover:bg-red-50 border-gray-200"
                      : "text-gray-500 hover:text-primary border-transparent shadow-none",
                  )}
                >
                  {isSearchOpen ? <X size={18} /> : <Search size={18} />}
                </Button>
              </div>
            </div>

            {/* 2행: 비율 필터 + 축소 버튼 */}
            {onToggleRatio && (
              <div className="flex justify-center items-center gap-1.5 px-1 pt-2 py-0.5">
                {RATIO_OPTIONS.map((r) => (
                  <Button
                    key={r}
                    onClick={() => onToggleRatio(r)}
                    variant={selectedRatio === r ? "gradient" : "outline"}
                    className={categoryButtonClass}
                  >
                    {r}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsCollapsed(true)}
                  className={cn(
                    iconButtonClass,
                    "ml-auto text-gray-500 hover:text-primary border-transparent shadow-none",
                  )}
                >
                  <ChevronUp size={18} />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
