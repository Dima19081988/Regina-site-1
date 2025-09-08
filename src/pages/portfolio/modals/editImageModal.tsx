import React, {useState} from "react";
import type { PortfolioImage } from "../../../types/portfolioData";

interface EditImageModalProps {
    image: PortfolioImage;
    onSubmit: (title: string, description: string) => void;
    onClose: () => void;
}

const EditImageModal: React.FC<EditImageModalProps> = ({
    image,
    onSubmit,
    onClose
}) => {

    const [title, setTitle] = useState(image.title);
    const [description, setDescription] = useState(image.description || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title) return;
        onSubmit(title.trim(), description.trim())
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Редактировать изображение</h2>
                    <button className="close-button" onClick={onClose}>x</button>
                </div>
                <div className="image-preview-large">
                    <img src={image.file_url} alt={image.title} />
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <div className="edit-image-title">
                            <input
                                id="edit-image-title" 
                                type="text"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                required
                                placeholder="введите название изображения"
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="edit-image-description"></label>
                        <textarea 
                            id="edit-image-description"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            placeholder="введите описание изображения (необязательно)"
                            rows={4}
                        />
                    </div>
                    <div className="image-info">
                        <p><strong>Категория:</strong> {image.category.name}</p>
                        <p><strong>Размер файла:</strong> {(image.size / 1024 / 1024).toFixed(2)} MB</p>
                        <p><strong>Тип файла:</strong> {image.mime_type}</p>
                        <p><strong>Загружено:</strong> {new Date(image.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="modal-actions">
                        <button type="button" onClick={onClose}>Отмена</button>;
                        <button type="submit">Сохранить изменения</button>
                    </div>   
                </form>
            </div>
        </div>
    )
}

export default EditImageModal;