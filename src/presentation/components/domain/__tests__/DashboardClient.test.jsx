import { render, screen, waitFor, act } from '@testing-library/react';
import DashboardClient from '../DashboardClient';
import { useTaskStore } from '@/presentation/store/useTaskStore';
import React, { Suspense } from 'react';

// Mock next/navigation
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(() => ({ push: jest.fn(), refresh: jest.fn() })),
}));

// Mock Zustand store
jest.mock('@/presentation/store/useTaskStore');

// Mock Server Actions
jest.mock('@/app/actions/tasks', () => ({
    addTaskAction: jest.fn(),
    updateTaskAction: jest.fn(),
    deleteTaskAction: jest.fn(),
}));

describe('DashboardClient', () => {
    const mockTasks = [
        { id: 't1', title: 'Task 1', description: 'Desc 1', status: 'todo' },
        { id: 't2', title: 'Task 2', description: 'Desc 2', status: 'done' },
    ];

    beforeEach(() => {
        useTaskStore.mockReturnValue({
            filter: 'all',
            groupBy: 'none',
        });
        jest.clearAllMocks();
    });

    it('renders tasks from the resolved promise', async () => {
        const promise = Promise.resolve(mockTasks);

        await act(async () => {
            render(
                <Suspense fallback={<div data-testid="loading">Loading...</div>}>
                    <DashboardClient tasksPromise={promise} />
                </Suspense>
            );
        });

        // Use findByTestId and be very specific
        const card1 = await screen.findByTestId('task-card-t1');
        expect(card1).toBeInTheDocument();
        expect(screen.getByTestId('task-card-t2')).toBeInTheDocument();
    });

    it('shows empty state when no tasks are provided', async () => {
        const promise = Promise.resolve([]);

        await act(async () => {
            render(
                <Suspense fallback={<div data-testid="loading">Loading...</div>}>
                    <DashboardClient tasksPromise={promise} />
                </Suspense>
            );
        });

        expect(await screen.findByTestId('empty-state')).toBeInTheDocument();
    });

    it('filters tasks correctly', async () => {
        useTaskStore.mockReturnValue({
            filter: 'done',
            groupBy: 'none',
        });

        const promise = Promise.resolve(mockTasks);

        await act(async () => {
            render(
                <Suspense fallback={<div data-testid="loading">Loading...</div>}>
                    <DashboardClient tasksPromise={promise} />
                </Suspense>
            );
        });

        expect(await screen.findByTestId('task-card-t2')).toBeInTheDocument();
        expect(screen.queryByTestId('task-card-t1')).not.toBeInTheDocument();
    });

    it('groups tasks by status correctly', async () => {
        useTaskStore.mockReturnValue({
            filter: 'all',
            groupBy: 'status',
        });

        const promise = Promise.resolve(mockTasks);

        await act(async () => {
            render(
                <Suspense fallback={<div data-testid="loading">Loading...</div>}>
                    <DashboardClient tasksPromise={promise} />
                </Suspense>
            );
        });

        expect(await screen.findByTestId('group-header-todo')).toBeInTheDocument();
        expect(await screen.findByTestId('group-header-done')).toBeInTheDocument();
    });
});
