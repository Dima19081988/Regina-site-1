import type { Attachment } from "../types/attachments.ts";

const API_URL = "http://localhost:3000/api/attachments";

export async function uploadAttachment(file: File): Promise<Attachment> {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData,
    });

    if(!res.ok) throw new Error('Ошибка загрузка файла');
    return await res.json();
}

export async function fetchAttachments(): Promise<Attachment[]> {
    const res = await fetch(API_URL);
    if(!res.ok) throw new Error('Ошибка получения списка файлов');
    return await res.json();
}

export async function deleteAttachment(id: number): Promise<void> {
    const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
    });
    if(!res.ok) throw new Error('Ошибка удаления файла');
}

export function getAttachmentDownloadUrl(id: number) {
    return `${API_URL}/download/${id}`;
}