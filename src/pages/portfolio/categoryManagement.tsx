import React, { useState, useEffect } from "react";
import { createCategory, updateCategory, deleteCategory } from "../../api/portfolio";
import type { Category } from "../../types/portfolioData";
import EditCategoryModal from "./modals/editCategoryModal";
import CreateCategoryModal from "./modals/createCategoryModal";

interface CategoryManagementProps {
    categories: Category[];
    setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
    setError: React.Dispatch<React.SetStateAction<string | null>>
}

const CategoryManagement: React.FC<CategoryManagementProps> = ({
    categories,
    setCategories,
    setError
}) => {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    const handleCreateCategory = async (name: string, description: string) => {
        try {
            const category = await createCategory(name, description);
            setCategories(prev => [...prev, category]);
            setShowCreateModal(false);
        } catch (error) {
            setError('Ошибка при создании категории');
            console.error('Ошибка при создании категории:', error);
        }
    }

    const handleDeleteCategory = async (id: number) => {
        if (!window.confirm('Вы уверены, что хотите удалить эту категорию? Все изображения в ней также будут удалены.')) return;
        try {
            await deleteCategory(id);
            setCategories(prev => prev.filter(cat => cat.id !== id));
        } catch (error) {
            setError('Ошибка при удалении категории');
            console.error('Ошибка при удалении категории:', error);
        }
    }

    const handleUpdateCategory = async (name: string, description: string) => {
        if (!editingCategory) return;

        try {
            await updateCategory(editingCategory.id, {name, description});
            setCategories(prev => prev.map(cat => 
                cat.id === editingCategory.id ? {...cat, name, description} : cat
            ));
            setEditingCategory(null);
        } catch (error) {
            setError('Ошибка редактирования категории');
            console.error('Ошибка редактирования категории:', error);
        }
    }

    return (
        <div className="category-management">
            <h2>Управление портфолио</h2>
            <button onClick={() => setShowCreateModal(true)}>
                Создать новую категорию
            </button>
            <div className="category-list">
                {categories.map(category => (
                    <div key={category.id} className="category-item">
                        <h3>{category.name}</h3>
                        <p>{category.description}</p>
                        <button onClick={() => setEditingCategory(category)}>
                            Редактировать
                        </button>
                        <button onClick={() => handleDeleteCategory(category.id)}>
                            Удалить
                        </button>
                    </div>
                ))}
            </div>

            {showCreateModal}
        </div>
    )
}