import { Category } from "@/types/image.interfaces";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

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

  useEffect(() => {
    setLocalSearch(search);
    if (search) setIsSearchOpen(true);
  }, [search]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch?.(localSearch);
  };

  const toggleSearch = () => {
    if (isSearchOpen) {
      setIsSearchOpen(false);
      if (search) {
        setLocalSearch("");
        setSearch?.("");
      }
    } else {
      setIsSearchOpen(true);
    }
  };

  const iconButtonClass = "rounded-full h-9 w-9 flex-shrink-0";
  const categoryButtonClass = "rounded-full h-9 whitespace-nowrap px-4";

  return (
    <motion.div
      layout
      transition={{ type: "spring", stiffness: 350, damping: 35 }}
      className="sticky top-2 z-20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md py-1.5 px-1.5 w-fit max-w-[calc(100dvw-2rem)] mx-auto rounded-full shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden"
    >
      <div className="flex items-center gap-1.5 min-h-9 px-1">
        <AnimatePresence mode="wait" initial={false}>
          {!isSearchOpen ? (
            <motion.div
              key="categories"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex gap-1.5 overflow-x-auto scrollbar-hide rounded-full min-w-0"
            >
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
            </motion.div>
          ) : (
            <motion.form
              key="search"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onSubmit={handleSearchSubmit}
              className="w-full flex items-center gap-2 flex-1"
            >
              <Input
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="프롬프트, 사용자 입력"
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
            </motion.form>
          )}
        </AnimatePresence>

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
    </motion.div>
  );
}
