import React, { useEffect, useState } from "react";
import type { Category } from "../../../types/portfolioData";

interface EditCategoryModalProps {
    category: Category;
    onSubmit: (name: string, description: string) => void;
    onClose: () => void; 
}

const EditCategoryModal: React.FC<EditCategoryModalProps> = ({
    category,
    onSubmit,
    onClose
}) => {

    const [name, setName] = useState(category.name);
    const [description, setDescription] = useState(category.description || '')

    useEffect(() => {
        setName(category.name);
        setDescription(category.description || '')
    }, [category]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!name.trim()) return;
        onSubmit(name.trim(), description.trim())
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Редактировать категорию</h2>
                    <button className="close-button" onClick={onClose}>x</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="edit-category-group">Название категории *</label>
                        <input
                            id="edit-category-group" 
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                            placeholder="введите название категории"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="edit-category-description"></label>
                        <textarea
                            id="edit-category-description"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            placeholder="введите описание категории (необязательно)"
                            rows={4}
                        />
                    </div>
                    <div className="modal-actions">
                        <button type="button" onClick={onClose}>Отмена</button>;
                        <button type="submit"></button>
                    </div>                      
                </form>
            </div>
        </div>
    )
}

export default EditCategoryModal;