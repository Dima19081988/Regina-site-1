import React,{ useState, useEffect} from "react";
import type { PortfolioImage, Category } from "../../types/portfolioData";
import { fetchCategories, fetchImages } from "../../api/portfolio";


export const Portfolio: React.FC = () => {
    const [images, setImages] = useState<PortfolioImage[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect (() => {
        fetchCategories()
        .then(data => {
            setCategories(data)
        })
        .catch(e => alert('Ошибка загрузки категорий:' + e.message))
    }, [])
    useEffect (() => {
        fetchImages()
        .then(data => {
            setImages(data)
        })
        .catch(e => alert('Ошибка загрузки категорий:' + e.message))
    }, [])


    return (
        <div></div>
    )
}