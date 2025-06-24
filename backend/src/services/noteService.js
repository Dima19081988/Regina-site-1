const Note = require('../models/note.js');

const noteService = {
    async getAllNotes() {
        return await Note.getAll();
    },

    async getNoteById(id) {
        if(!id) throw new Error('ID заметки не указан');
        return await Note.getById(id);
    },

    async createNote(data) {
        const { title = '', content = '' } = data;
        if (typeof content !== 'string' || !content.trim()) {
            throw new Error('Содержание заметки обязательно');
        }

        return await Note.create({ title: title.trim(), content: content.trim() });
    },

    async updateNote(id, data) {
        if(!id) throw new Error('ID заметки не указан');
        const { title = '', content } = data;
        if(!title.trim()) throw new Error('Заголовок обязателен');
        if(!content.trim()) throw new Error('Содержание заметки обязательно');
        return await Note.update(id, { title: title.trim(), content: content.trim() });
    },

    async deleteNote(id) {
        if(!id) throw new Error('ID заметки не указан');
        await Note.delete(id);
    }
};

module.exports = noteService;