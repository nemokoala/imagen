import { Category } from "@/types/image.interfaces";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  categories: Category[];
  selectedCategories: string[];
  handleSelectAll: () => void;
  handleToggleCategory: (slug: string) => void;
}
export function CategoryFilter({
  categories,
  selectedCategories,
  handleSelectAll,
  handleToggleCategory,
}: CategoryFilterProps) {
  return (
    <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm py-3 -mx-1 px-2">
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        <button
          onClick={handleSelectAll}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
            selectedCategories.length === 0
              ? "bg-purple-600 text-white"
              : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700",
          )}
        >
          전체
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleToggleCategory(cat.slug)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
              selectedCategories.includes(cat.slug)
                ? "bg-purple-600 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700",
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}
