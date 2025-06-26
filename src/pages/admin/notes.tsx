import React, { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent} from "react";
import "../../styles/notes.css"

interface Note {
    id: number;
    title: string;
    content: string;
    created_at?: string;
}

const notesPage: React.FC = () => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    
    const [title, setTitle] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState<boolean>(false);

    const [editId, setEditId] = useState<number | null>(null);
    const [editTitle, setEditTitle] = useState<string>('');
    const [editContent, setEditContent] = useState<string>('');
    const [deletingId, setDeletingId] = useState<number | null>(null);
    // Загрузка заметок с backend 
    useEffect(() => {
        fetch('http://localhost:3000/notes')
            .then(res => {
                if (!res.ok) throw new Error(`Ошибка загрузки: ${res.status}`);
                return res.json();
            })
            .then((data: Note[]) => {
                setNotes(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, []);
    // Обработка отправки новой заметки
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        console.log("Отправляемые данные:", { title, content });
        setSubmitError(null);

        if(!title.trim() || !content.trim()) {
            setSubmitError('Необходимо добавить текст');
            return;
        }

        setSubmitting(true);

        fetch('http://localhost:3000/notes', {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({ title, content })
        })
        .then(res => {
            if(!res.ok) throw new Error(`Ошибка при создании: ${res.status}`);
            return res.json();
        })
        .then((newNote: Note) => {
            setNotes(prevNotes => [newNote, ...prevNotes]);
            setTitle('');
            setContent('');
        })
        .catch(err => setSubmitError(err.message))
        .finally(() => setSubmitting(false));
    };
    //начало редактирования заметки
    const startEdit = (note: Note) => {
        setEditId(note.id);
        setEditTitle(note.title);
        setEditContent(note.content);
        setSubmitError(null);
    };
    // отмена редактирования
    const cancelEdit = () => {
        setEditId(null);
        setEditTitle('');
        setEditContent('');
        setSubmitError(null);
    };
    // сохранить изменения
    const saveEdit = async (e:FormEvent) => {
        e.preventDefault();
        if(!editTitle.trim() || !editContent.trim()) {
            setSubmitError(error);
            return;
        }
        setSubmitting(true);
        try {
            const res = await fetch(`http://localhost:3000/notes/${editId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: editTitle, content: editContent }),
            })
            if (!res.ok) throw new Error(`Ошибка обновления: ${res.status}`);
            const updateNote = await res.json();
            setNotes(notes.map(n => (n.id === editId ? updateNote : n)));
            cancelEdit();
        } catch (err: any) {
            setSubmitError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    // удаление заметки
    const deleteNote = async (id: number) => {
        if(!window.confirm('Удалить заметку?')) return;
        setDeletingId(null);
        try {
            const res = await fetch(`http://localhost:3000/notes/${id}`,
            { method: 'DELETE' });
            if(!res.ok) throw new Error(`Ошибка удаления: ${res.status}`);
            setNotes(notes.filter(n => n.id !== id));
        } catch (err: any) {
            alert('Ошибка при удалении: ' + err.message);
        }   finally {
        setDeletingId(null);
    }
    };

    if(loading) return <p>Загрузка заметок</p>;
    if(error) return <p>Ошибка: {error}</p>

    return (
        <div>
            {editId === null ? (
                <form  onSubmit={handleSubmit} className="form new-note-form">
                    <input 
                        type="text"
                        placeholder="заголовок"
                        value={title}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                        disabled={submitting}
                        className="note-form-input"
                    />
                    <textarea
                        placeholder="содержание"
                        value={content}
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
                        disabled={submitting}
                        rows={8}
                        className="note-form-textarea"
                    >
                    </textarea>
                    {submitError && <p className="note-form-error">{submitError}</p>}
                    <button type="submit" disabled={submitting} className="note-form-btn">
                        {submitting ? 'Сохраняем' : 'Добавить заметку'}
                    </button>
                </form>
            ) : (
                <form onSubmit={saveEdit}>
                    <input 
                        type="text"
                        placeholder="заголовок"
                        value={editTitle}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setEditTitle(e.target.value)}
                        disabled={submitting}
                        className="note-form-input"
                    />
                    <textarea
                        placeholder="содержание"
                        value={editContent}
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setEditContent(e.target.value)}
                        disabled={submitting}
                        rows={8}
                        className="note-form-textarea"
                    >
                    </textarea>
                    {submitError && <p style={{ color: 'red' }} className="note-form-error">{submitError}</p>}
                    <button type="submit" disabled={submitting}>Сохранить</button>
                    <button type="button" onClick={cancelEdit} disabled={submitting}>Отмена</button>
                </form>
            )}
            <ul className="note-list">
                {notes.map(note => (
                    <li key={note.id} className="note-item">
                        <h3 className="note-title">{note.title}</h3>
                        <p className="note-content">{note.content}</p>
                        {note.created_at && <small>{new
                            Date(note.created_at).toLocaleString()}</small>}
                        <button onClick={() => startEdit(note)}>Редактировать</button>
                        <button
                                onClick={() => deleteNote(note.id)}
                                disabled={deletingId === note.id || submitting} 
                        >
                        {deletingId === note.id ? 'Удаляем...' : 'Удалить'}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default notesPage;