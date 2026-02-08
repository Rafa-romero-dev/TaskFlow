import { act, renderHook, waitFor } from '@testing-library/react';
import { useTaskStore } from '@/presentation/store/useTaskStore';

// Mock fetch globally
global.fetch = jest.fn();

describe('useTaskStore', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useTaskStore.setState({ tasks: [], isLoading: false, error: null });
    });

    it('should fetch tasks successfully', async () => {
        const mockTasks = [{ id: '1', title: 'Task 1' }];
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockTasks,
        });

        const { result } = renderHook(() => useTaskStore());

        await act(async () => {
            await result.current.fetchTasks();
        });

        expect(result.current.tasks).toEqual(mockTasks);
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBe(null);
    });

    it('should handle fetch tasks error', async () => {
        fetch.mockRejectedValueOnce(new Error('Network error'));

        const { result } = renderHook(() => useTaskStore());

        await act(async () => {
            await result.current.fetchTasks();
        });

        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBe('Network error');
    });

    it('should add a task', async () => {
        const newTask = { id: '2', title: 'Task 2' };
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => newTask,
        });

        const { result } = renderHook(() => useTaskStore());

        await act(async () => {
            await result.current.addTask({ title: 'Task 2' });
        });

        expect(result.current.tasks).toContainEqual(newTask);
    });

    it('should delete a task', async () => {
        const initialTasks = [{ id: '1', title: 'Task 1' }];
        useTaskStore.setState({ tasks: initialTasks });

        fetch.mockResolvedValueOnce({ ok: true });

        const { result } = renderHook(() => useTaskStore());

        await act(async () => {
            await result.current.deleteTask('1');
        });

        expect(result.current.tasks).toHaveLength(0);
    });

    it('should update a task', async () => {
        const initialTasks = [{ id: '1', title: 'Task 1', status: 'todo' }];
        useTaskStore.setState({ tasks: initialTasks });

        const updatedTask = { id: '1', title: 'Task 1', status: 'done' };
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => updatedTask,
        });

        const { result } = renderHook(() => useTaskStore());

        await act(async () => {
            await result.current.updateTask('1', { status: 'done' });
        });

        expect(result.current.tasks[0].status).toBe('done');
    });

    it('should update the filter', () => {
        const { result } = renderHook(() => useTaskStore());

        act(() => {
            result.current.setFilter('done');
        });

        expect(result.current.filter).toBe('done');
    });

    it('should update the grouping', () => {
        const { result } = renderHook(() => useTaskStore());

        act(() => {
            result.current.setGroupBy('status');
        });

        expect(result.current.groupBy).toBe('status');
    });
});
