import { create } from 'zustand';

/**
 * Task Management Store.
 * Note: CRUD operations are Server Actions,
 * this store only manages UI state like filters and grouping.
 */
export const useTaskStore = create((set) => ({
    filter: 'all',
    groupBy: 'none',

    setFilter: (filter) => set({ filter }),
    setGroupBy: (groupBy) => set({ groupBy }),
}));
