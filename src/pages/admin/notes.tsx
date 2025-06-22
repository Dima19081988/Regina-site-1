import React, { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent} from "react";


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
        setSubmitError(null);

        if(!content.trim()) {
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

    }

    if(loading) return <p>Загрузка заметок</p>;
    if(error) return <p>Ошибка: {error}</p>

    return (

    )
}