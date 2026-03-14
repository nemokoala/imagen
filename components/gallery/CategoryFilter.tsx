import { Category } from "@/types/image.interfaces";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  categories: Category[];
  selectedCategories: string[];
  handleSelectAll: () => void;
  handleToggleCategory: (slug: string) => void;
  search?: string;
  setSearch?: (value: string) => void;
}

export function CategoryFilter({
  categories,
  selectedCategories,
  handleSelectAll,
  handleToggleCategory,
  search = "",
  setSearch,
}: CategoryFilterProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(search);

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

  return (
    <div className="sticky top-2 z-20 bg-white/80 dark:bg-gray-800/80 py-1.5 px-1.5 w-fit max-w-[calc(100dvw-2rem)] mx-auto rounded-full shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
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
              className="h-9 rounded-full border-none bg-gray-100 dark:bg-gray-700 focus-visible:ring-1 focus-visible:ring-primary flex-1 min-w-[180px] sm:w-[320px]"
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
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide rounded-full min-w-0">
            {search && (
              <div className="flex items-center gap-2 flex-shrink-0">
                <Button
                  onClick={clearSearch}
                  variant="gradient"
                  className={cn(categoryButtonClass, "gap-2 pr-2 shadow-md")}
                >
                  <span className="max-w-[100px] truncate">"{search}"</span>
                  <X size={16} className="opacity-90" />
                </Button>
                <div className="w-px h-8 bg-foreground/30 mx-1 flex-shrink-0" />
              </div>
            )}
            <Button
              onClick={handleSelectAll}
              variant={selectedCategories.length === 0 ? "gradient" : "outline"}
              className={categoryButtonClass}
            >
              전체
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat.id}
                onClick={() => handleToggleCategory(cat.slug)}
                variant={
                  selectedCategories.includes(cat.slug) ? "gradient" : "outline"
                }
                className={categoryButtonClass}
              >
                {cat.name}
              </Button>
            ))}
          </div>
        )}

        <div className="flex-shrink-0 border-l border-foreground/30 pl-1.5 ml-0.5">
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
    </div>
  );
}
