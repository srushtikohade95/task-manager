const API_URL = 'http://localhost:3000/tasks';

// API Interface
const TaskAPI = {
    async fetchAll() {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch tasks');
        return response.json();
    },

    async create(title) {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title })
        });
        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error || 'Failed to add task');
        }
        return response.json();
    },

    async updateStatus(id, completed) {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed })
        });
        if (!response.ok) throw new Error('Failed to update status');
        return response.json();
    },

    async updateTitle(id, title) {
        const response = await fetch(`${API_URL}/${id}/title`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title })
        });
        if (!response.ok) throw new Error('Failed to update title');
        return response.json();
    },

    async delete(id) {
        const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete task');
    }
};
