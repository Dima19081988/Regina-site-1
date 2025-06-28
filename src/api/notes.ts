export interface Note {
    id: number;
    title: string;
    content: string;
    created_at?: string;
}

const API_URL = "http://localhost:3000/notes";

export async function fetchNotes(): Promise<Note[]> {
    const res = await fetch(API_URL);
    if(!res.ok) throw new Error(`Ошибка загурзки: ${res.status}`);
    return res.json();
}

export async function createNote(title: string, content: string): Promise<Note> {
    const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content })
    });
    if(!res.ok) throw new Error (`Ошибка при создании: ${res.status}`);
    return res.json();
}

export async function updateNote(id: number, title: string, content: string): Promise<Note> {
    const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content })
    });
    if(!res.ok) throw new Error(`Ошибка при редактировании: ${res.status}`);
    return res.json();
}

export async function deleteNote(id: number): Promise<void> {
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE'});
    if(!res.ok) throw new Error(`Ошибка при удалении: ${res.status}`);
}
