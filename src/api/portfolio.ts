import type { PortfolioImage, Category } from "../types/portfolioData.ts";


const API_BASE = '/api/portfolio';

export async function fetchCategories(): Promise<Category[]> {
    try {
        const response = await fetch(`${API_BASE}/categories`);
        if(!response.ok) throw new Error ('Ошибка получения категорий');
        return await response.json();
    } catch (error) {
        console.error('Ошибка получения категорий:', error);
        throw error;
    }
}

export async function fetchImages(): Promise<PortfolioImage[]> {
    try {
        const response = await fetch(`${API_BASE}/images`);
        if(!response.ok) throw new Error ('Ошибка получения изображений');
        return await response.json();
    } catch (error) {
        console.error('Ошибка загрузки изображений:', error);
        throw error;
    }    
}

export async function fetchImage(id: number): Promise<PortfolioImage> {
    try {
        const response = await fetch(`${API_BASE}/images/${id}`);
        if(!response.ok) throw new Error ('Ошибка получения изображения');
        return await response.json();
    } catch (error) {
        console.error('Ошибка загрузки изображения:', error);
        throw error;
    }    
}

export async function deleteImage(id: number): Promise<void> {
    try {
        const response = await fetch(`${API_BASE}/images/${id}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        if(!response.ok) throw new Error ('Ошибка удаления изображения');
    } catch (error) {
        console.error('Ошибка удаления изображения:', error);
        throw error;
    }    
}

export async function updateImage(id: number, data: Partial<PortfolioImage>): Promise<PortfolioImage> {
    try {
        const response = await fetch(`${API_BASE}/images/${id}`, {
            method: 'PATCH',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(data),
            credentials: 'include'
        });
        if(!response.ok) throw new Error ('Ошибка обновления изображения');
        return await response.json();
    } catch (error) {
        console.error('Ошибка обновления изображения:', error);
        throw error;
    }
}

export async function uploadImage(formData: FormData): Promise<PortfolioImage> {
    try {
        const response = await fetch(`${API_BASE}/upload`, {
            method: 'POST',
            body: formData,
            credentials: 'include'
        })

        if(!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'Ошибка загрузки изображения');
        }
        return await response.json();
    } catch (error) {
        console.error('Ошибка загрузки изображения:', error);
        throw error;
    }    
}

export async function createCategory(name: string, description?: string): Promise<Category> {
    try {
        const response = await fetch(`${API_BASE}/categories`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({ name, description }),
            credentials: 'include'
        })
        if (!response.ok) throw new Error('Ошибка создания категории');
        return await response.json();
    } catch (error) {
        console.error('Ошибка создания категории:', error);
        throw error;
    } 
}

export async function deleteCategory(id: number): Promise<void> {
    try {
        const response = await fetch(`${API_BASE}/categories/${id}`, {
            method: 'DELETE',
            credentials: 'include'
        })
        if(!response.ok) throw new Error ('Ошибка удаления категории');
    } catch (error) {
        console.error('Ошибка удаления категории:', error);
        throw error;
    }
}

export async function updateCategory(id: number, data: Partial<Category>): Promise<void> {
    try {
        const response = await fetch(`${API_BASE}/categories/${id}`, {
            method: 'PATCH',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(data),
            credentials: 'include'
        });
        if (!response.ok) throw new Error('Ошибка обновления категории');
    } catch (error) {
        console.error('Error updating category:', error);
        throw error;
    }
}