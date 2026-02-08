import { create } from 'zustand';

/**
 * Task Management Store.
 * Note: CRUD operations have been moved to Server Actions for better Next.js 19 integration.
 * This store now only manages UI state like filters and grouping.
 */
export const useTaskStore = create((set) => ({
    filter: 'all',
    groupBy: 'none',

    setFilter: (filter) => set({ filter }),
    setGroupBy: (groupBy) => set({ groupBy }),
}));
