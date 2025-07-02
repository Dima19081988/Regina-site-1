import noteService from '../services/noteService.js';

const noteController = {
    async getAll(req, res) {
        try {
            const notes = await noteService.getAllNotes();
            res.json(notes);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async getById(req, res) {
        try {
            const note = await noteService.getNoteById(req.params.id);
            if(!note) return res.status(404).json({ error: 'Заметка не найдена' });
            res.json(note);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async create(req, res) {
        try {
            console.log("Полученные данные:", req.body);
            const newNote = await noteService.createNote(req.body);
            res.status(201).json(newNote);
        } catch (error) {
            console.error("Ошибка создания:", error.message);
            res.status(400).json({ error: error.message });
        }
    },

    async update(req, res) {
        try {
            const updatedNote = await noteService.updateNote(req.params.id, req.body);
            if(!updatedNote) return res.status(404).json({ error: 'Заметка не найдена' });
            res.json(updatedNote);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async delete(req, res) {
        try {
            await noteService.deleteNote(req.params.id);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

export default noteController;