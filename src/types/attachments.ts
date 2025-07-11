export interface Attachment {
    id: number;
    file_name: string;
    mime_type: string;
    size: number;
    created_at?: string;
}