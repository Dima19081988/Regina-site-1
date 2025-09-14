import React, { useState } from "react";
import type { Category, PortfolioImage } from "../../types/portfolioData";
import { deleteImage, updateImage } from "../../api/portfolio";
import EditImageModal from "./modals/editImageModal";
import ImageItem from "./imageItem";

interface ImageGridProps {
    images: PortfolioImage[];
    setImages: React.Dispatch<React.SetStateAction<PortfolioImage[]>>;
    setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
    setError: React.Dispatch<React.SetStateAction<string | null>>;
}

const ImageGrid: React.FC<ImageGridProps> = ({
    images,
    setImages,
    setCategories,
    setError,
}) => {
    const [editingImage, setEditingImage] = useState<PortfolioImage | null>(null);

    const handleDeleteImage = async (id: number) => {
        if (!window.confirm('Вы уверены, что хотите удалить это изображение?')) return;

        try {
            await deleteImage(id);
            setImages(prev => prev.filter(img => img.id !== id));
            setCategories(prev => prev.map(cat => ({ ...cat,
                images: cat.images.filter(img => img.id !== id)
             })));
        } catch (error) {
            setError('Ошибка при удалении изображения');
            console.error('Ошибка при удалении изображения', error);
        }
    };

    const handleUpdateImage = async (title: string, description: string) => {
        if (!editingImage) return;

        try {
            const updatedImage = await updateImage(editingImage.id, {title, description});
            setImages(prev => prev.map(img => 
                img.id === updatedImage.id ? updatedImage : img
            ));

            setCategories(prev => prev.map(cat => ({
                ...cat,
                images: cat.images.map(img =>
                    img.id === updatedImage.id ? updatedImage : img
                )
            })));
            setEditingImage(null);
        } catch (error) {
            setError('Ошибка при редактировании изображения');
            console.error('Ошибка при редактировании изображения', error);
        }
    };

    return (
        <div className="images-grid-container">
            <h2>Изображения</h2>
            <div className="images-grid">
                {images.map(image => (
                    <ImageItem
                        key={image.id}
                        image={image}
                        onEdit={() => setEditingImage(image)}
                        onDelete={() => handleDeleteImage(image.id)}
                    />
                ))}
            </div>

            {images.length === 0 && (
                <div className="empty-state">
                    Нет изображений
                </div>
            )}

            {editingImage && (
                <EditImageModal
                    image={editingImage}
                    onSubmit={handleUpdateImage}
                    onClose={() => setEditingImage(null)}
                />
            )}
        </div>
    );
};

export default ImageGrid;