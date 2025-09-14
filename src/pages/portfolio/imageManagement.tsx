import React, { useState } from "react";
import type { Category, PortfolioImage } from "../../types/portfolioData";
import { uploadImage } from "../../api/portfolio";
import UploadImageModal from "./modals/uploadImageModal";


interface ImageManagementProps {
    categories: Category[];
    setImages: React.Dispatch<React.SetStateAction<PortfolioImage[]>>;
    setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
    setError: React.Dispatch<React.SetStateAction<string | null>>;
}

const ImageManagement: React.FC<ImageManagementProps> = ({
    categories,
    setImages,
    setCategories,
    setError
}) => {

    const [showUploadModal, setShowUploadModal] = useState(false);

    const handleUploadImage = async (formData: FormData) => {
        try {
            const newImage = await uploadImage(formData);
            setImages(prev => [...prev, newImage]);
            setCategories(prev => prev.map(cat =>
                cat.id === newImage.category.id
                ? {...cat, images: [...cat.images, newImage]}
                : cat
            ));

            setShowUploadModal(false);
        } catch (error) {
            setError('Ошибка при загрузке изображения');
            console.error('Ошибка при загрузке изображения', error);
        }
    }

    return (
        <div className="image-management">
            <h2>Управление изображениями</h2>
            <button onClick={() => setShowUploadModal(true)}>
                Загрузить новое изображение
            </button>
            
            {showUploadModal && (
                <UploadImageModal
                    categories={categories}
                    onClose={() => setShowUploadModal(false)}
                    onSubmit={handleUploadImage}
                />
            )}
        </div>
    )
}

export default ImageManagement;