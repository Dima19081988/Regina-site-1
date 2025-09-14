import React from "react";
import type { PortfolioImage } from "../../types/portfolioData";

interface ImageItemProps {
    image: PortfolioImage;
    onEdit: () => void;
    onDelete: () => void;
}

const ImageItem: React.FC<ImageItemProps> = ({
    image,
    onEdit,
    onDelete,
}) => {
    return (
        <div className="image-item">
            <img 
                src={image.file_url} 
                alt={image.title}
                loading="lazy"
            />
            <div className="image-info">
                <h3>{image.title}</h3>
                {image.description && <p>{image.description}</p>}
                <p>Категория {image.category.name}</p>
                <div className="image-actions">
                    <button onClick={onEdit}>Редактировать</button>
                    <button onClick={onDelete}>Удалить</button>
                </div>
            </div>
        </div>
    )
}

export default ImageItem;