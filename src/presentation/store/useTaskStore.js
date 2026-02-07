import { create } from 'zustand';

export const useTaskStore = create((set) => ({
    tasks: [],
    isLoading: false,
    error: null,

    fetchTasks: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch('/api/tasks');
            if (!response.ok) throw new Error('Failed to fetch tasks');
            const data = await response.json();
            set({ tasks: data, isLoading: false });
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    },

    addTask: async (task) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(task),
            });
            if (!response.ok) throw new Error('Failed to add task');
            const newTask = await response.json();
            set((state) => ({
                tasks: [...state.tasks, newTask],
                isLoading: false
            }));
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    },

    updateTask: async (id, updates) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`/api/tasks/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates),
            });
            if (!response.ok) throw new Error('Failed to update task');
            const updatedTask = await response.json();
            set((state) => ({
                tasks: state.tasks.map((task) => (task.id === id ? updatedTask : task)),
                isLoading: false
            }));
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    },

    deleteTask: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`/api/tasks/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete task');
            set((state) => ({
                tasks: state.tasks.filter((task) => task.id !== id),
                isLoading: false
            }));
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    }
}));
