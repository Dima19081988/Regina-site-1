import React, { useState, useEffect } from "react";
import type { ChangeEvent } from "react";
import { fetchNotes, createNote, updateNote, deleteNote } from "../../api/notes.ts";
import type { Note } from "../../types/notes.ts";
import "../../styles/notes.css";

const NotesPage: React.FC = () => {
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
        fetchNotes()
            .then(setNotes)
            .catch(err => setError(err.message))
            .finally(() => setLoading(false))
    }, []);
    // Обработка отправки новой заметки
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Отправляемые данные:", { title, content });
        setSubmitError(null);

        if(!title.trim() || !content.trim()) {
            setSubmitError('Необходимо добавить текст');
            return;
        }

        setSubmitting(true);

        try {
            const newNote = await createNote(title, content);
            setNotes(prev => [newNote, ...prev]);
            setTitle('');
            setContent('');
        } catch (err: unknown) {
            if (err instanceof Error) {
                setSubmitError(err.message);
            } else {
                setSubmitError('Ошибка добавления заметки');
            }
        } finally {
            setSubmitting(false);
        }
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
    const saveEdit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!editTitle.trim() || !editContent.trim()) {
            setSubmitError('Необходимо добавить текст');
            return;
        }
        setSubmitting(true);
        try {
            if (editId !== null) {
                const updated = await updateNote(editId, editTitle, editContent);
                setNotes(notes.map(n => n.id === editId ? updated : n));
                cancelEdit();
            }
        } catch(err: unknown) {
            if (err instanceof Error) {
                setSubmitError(err.message);
            } else {
                setSubmitError('Ошибка сохранения заметки');
            }  
        } finally {
            setSubmitting(false);    
        }
    };

    // удаление заметки
    const handleDeleteNote = async (id: number) => {
        if(!window.confirm('Удалить заметку?')) return;
        setDeletingId(id);
        try {
            await deleteNote(id);
            setNotes(notes.filter(n => n.id !== id));
        } catch (err: unknown) {
            if (err instanceof Error) {
                setSubmitError(err.message);
            } else {
                setSubmitError('Ошибка удаления заметки');
            }
        } finally {
            setDeletingId(null)
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
                                onClick={() => handleDeleteNote(note.id)}
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

export default NotesPage;