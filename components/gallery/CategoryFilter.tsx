import { Category } from "@/types/image.interfaces";
import { Button } from "@/components/ui/button";

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
    <div className="sticky top-2 z-10 bg-white dark:bg-gray-800 backdrop-blur-sm py-2.5 px-2 w-fit max-w-[calc(100dvw-2rem)] overflow-x-auto mx-auto rounded-4xl">
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        <Button
          onClick={handleSelectAll}
          variant={selectedCategories.length === 0 ? "gradient" : "outline"}
          className="rounded-full"
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
            className="rounded-full"
          >
            {cat.name}
          </Button>
        ))}
      </div>
    </div>
  );
}
