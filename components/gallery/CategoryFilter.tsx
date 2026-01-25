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
    <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm py-3 -mx-1 px-2">
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
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
