import React, { useState } from "react";

interface CreateCategoryModalProps {
    onClose: () => void;
    onSubmit: (name: string, description: string) => void;
}

const CreateCategoryModal: React.FC<CreateCategoryModalProps> = ({
  onClose,
  onSubmit
}) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name) return;
        onSubmit(name, description);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Создать новую категорию</h2>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="category-name">Название категории *</label>
                        <input
                            id="category-name"
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                            placeholder="введите название категории"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="category-description">Описание</label>
                        <textarea
                            id="category-description"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            placeholder="введите описание категории (необязательно)"
                            rows={3}
                        />
                    </div>
                    <div className="modal-actions">
                        <button type="button" onClick={onClose}>Отмена</button>
                        <button type="submit">Создать</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateCategoryModal;