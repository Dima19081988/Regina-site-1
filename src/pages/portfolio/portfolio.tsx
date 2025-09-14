import React, {useState, useEffect} from "react";
import type { PortfolioImage, Category } from "../../types/portfolioData";
import { fetchCategories, fetchImages } from "../../api/portfolio";
import CategoryManagement from "./categoryManagement";
import ImageManagement from "./imageManagement";
import CategoryFilter from "./categoryFilter";
import ImageGrid from "./imagesGrid";
import "../../styles/portfolio.css";

export const Portfolio:React.FC = () => {
    const [images, setImages] = useState<PortfolioImage[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);

            const [categoriesData, imagesData] = await Promise.all([
                fetchCategories(),
                fetchImages()
            ])

            setCategories(categoriesData);
            setImages(imagesData);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Неизвестная ошибка');
            console.error('Ошибка загрузки данных', error);
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadData()
    }, []);

    const filteredImages = selectedCategory 
        ? images.filter(img => img.category.id === selectedCategory)
        : images;

    if (loading) return <div className="loading">Загрузка...</div>;
    if (error) return <div className="error">Ошибка: {error}</div>;

    return (
        <div className="portfolio-container">
            <h1>Портфолио</h1>
            <CategoryManagement
                categories={categories}
                setCategories={setCategories}
                setError={setError}
            />

            <ImageManagement
                categories={categories}
                setImages={setImages}
                setCategories={setCategories}
                setError={setError}  
            />

            <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
            />

            <ImageGrid
                images={filteredImages}
                setImages={setImages}
                setCategories={setCategories}
                setError={setError}
            />
        </div>
    )
}

export default Portfolio;