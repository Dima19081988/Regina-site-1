import React, { useState } from "react";
import type { Category } from "../../../types/portfolioData";

    interface UploadImageModalProps {
        categories: Category[];
        onClose: () => void;
        onSubmit: (formData: FormData) => void;
    }

    const UploadImageModal: React.FC<UploadImageModalProps> = ({
        categories,
        onClose,
        onSubmit
    }) => {
        const [categoryId, setCategoryId] = useState("");
        const [title, setTitle] = useState("");
        const [description, setDescription] = useState("");
        const [file, setFile] = useState<File | null>(null);
        const [preview, setPreview] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
        setFile(selectedFile);
    
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(selectedFile);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !categoryId) return;
        
        const formData = new FormData();
        formData.append('file', file);
        formData.append('categoryId', categoryId);
        formData.append('title', title || file.name);
        if (description) formData.append('description', description);
        
        onSubmit(formData);
    };

    const resetForm = () => {
        setCategoryId('');
        setTitle('');
        setDescription('');
        setFile(null);
        setPreview(null);
    }

    const handleClose = () => {
        resetForm();
        onClose();
    }

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Загзузка нового изображения</h2>
                    <button className="close-button" onClick={onClose}>x</button>
                </div>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="image-category">Категория *</label>
                    <select 
                        id="image-category"
                        value={categoryId}
                        onChange={e => setCategoryId(e.target.value)}
                        required
                    >
                        <option value="">Выберите категорию</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id.toString()}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="image-title">Название изображения</label>
                    <input
                        id="image-title" 
                        type="text"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="введите название изображения"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="image-description">Введите описание изображения</label>
                    <textarea 
                        id="image-description"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        placeholder="введите описание изображения(необязательно)"
                        rows={4}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="image-file">Изображение *</label>
                    <input
                        id="image-file" 
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        required 
                    />
                    {preview &&(
                        <div className="image-preview">
                            <img src={preview} alt="Предпросмотр" />
                        </div>
                    )}
                </div>
                <div className="modal-actions">
                    <button type="button" onClick={handleClose}>Отмена</button>
                    <button 
                        type="submit"
                        disabled={!file || !categoryId}
                    >
                        Загрузить
                    </button>
                </div>
            </form>
        </div>
    )
}

export default UploadImageModal;