export interface PortfolioImage {
    id: number;
    title: string;
    description: string | null;
    file_url: string;
    file_key: string;
    mime_type: string;
    size: number;
    category: {
        id: number;
        name: string;
    }
    created_at: string;
}

export interface Category {
    id: number;
    name: string;
    description: string | null;
    images: PortfolioImage[];
    created_at: string;
    updated_at: string;
}