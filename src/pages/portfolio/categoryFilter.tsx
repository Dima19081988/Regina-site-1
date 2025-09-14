import React from "react";
import type { Category } from "../../types/portfolioData";

interface CategoryFilterProps {
    categories: Category[];
    selectedCategory: number | null;
    setSelectedCategory: React.Dispatch<React.SetStateAction<number | null>>;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
    categories,
    selectedCategory,
    setSelectedCategory,
}) => {
    return (
        <div className="category-filter">
            <h2>Фильтр по категориям</h2>
            <button
                className={!selectedCategory ? 'active' : ''}
                onClick={() => setSelectedCategory(null)}
            >
                Все категории
            </button>
            {categories.map(category =>
                <button
                    key={category.id}
                    className={selectedCategory === category.id ? 'active' : ''}
                    onClick={() => setSelectedCategory(category.id)}
                >
                    {category.name}
                </button>
            )}
        </div>
    )
}

export default CategoryFilter;