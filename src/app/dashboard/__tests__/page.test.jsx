
import { render, screen, waitFor } from '@testing-library/react';
import DashboardPage from '../page';
import { useTaskStore } from '@/presentation/store/useTaskStore';

// Mock next/navigation
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(() => ({ push: jest.fn() })),
}));

// Mock Zustand store
jest.mock('@/presentation/store/useTaskStore');

describe('DashboardPage', () => {
    const fetchTasksMock = jest.fn();
    const deleteTaskMock = jest.fn();

    beforeEach(() => {
        fetchTasksMock.mockClear();
        deleteTaskMock.mockClear();
        useTaskStore.mockReturnValue({
            tasks: [],
            isLoading: false,
            error: null,
            fetchTasks: fetchTasksMock,
            deleteTask: deleteTaskMock,
            filter: 'all',
            groupBy: 'none',
        });
    });

    it('renders loading state initially', () => {
        useTaskStore.mockReturnValue({
            tasks: [],
            isLoading: true,
            error: null,
            fetchTasks: fetchTasksMock,
            deleteTask: deleteTaskMock,
            filter: 'all',
            groupBy: 'none',
        });

        render(<DashboardPage />);
        expect(screen.getByText(/loading tasks/i)).toBeInTheDocument();
    });

    it('renders empty state when no tasks', () => {
        useTaskStore.mockReturnValue({
            tasks: [],
            isLoading: false,
            error: null,
            fetchTasks: fetchTasksMock,
            filter: 'all',
            groupBy: 'none',
        });

        render(<DashboardPage />);
        expect(screen.getByText(/no tasks found/i)).toBeInTheDocument();
        expect(fetchTasksMock).toHaveBeenCalled();
    });

    it('renders list of tasks', () => {
        const tasks = [
            { id: '1', title: 'Task 1', description: 'Desc 1', status: 'todo' },
            { id: '2', title: 'Task 2', description: 'Desc 2', status: 'done' },
        ];

        useTaskStore.mockReturnValue({
            tasks,
            isLoading: false,
            error: null,
            fetchTasks: fetchTasksMock,
            deleteTask: deleteTaskMock,
            filter: 'all',
            groupBy: 'none',
        });

        render(<DashboardPage />);
        expect(screen.getByText('Task 1')).toBeInTheDocument();
        expect(screen.getByText('Task 2')).toBeInTheDocument();
    });

    it('renders error state', () => {
        useTaskStore.mockReturnValue({
            tasks: [],
            isLoading: false,
            error: 'Failed to fetch',
            fetchTasks: fetchTasksMock,
            deleteTask: deleteTaskMock,
            filter: 'all',
            groupBy: 'none',
        });

        render(<DashboardPage />);
        expect(screen.getByText(/failed to fetch/i)).toBeInTheDocument();
    });

    it('filters tasks correctly', () => {
        const tasks = [
            { id: '1', title: 'Task 1', description: 'Desc 1', status: 'todo' },
            { id: '2', title: 'Task 2', description: 'Desc 2', status: 'done' },
        ];

        useTaskStore.mockReturnValue({
            tasks,
            isLoading: false,
            error: null,
            fetchTasks: fetchTasksMock,
            filter: 'done', // Filtered to show only 'done'
            groupBy: 'none',
        });

        render(<DashboardPage />);
        expect(screen.queryByText('Task 1')).not.toBeInTheDocument();
        expect(screen.getByText('Task 2')).toBeInTheDocument();
    });

    it('groups tasks by status correctly', () => {
        const tasks = [
            { id: '1', title: 'Todo Task', description: 'Desc 1', status: 'todo' },
            { id: '2', title: 'Done Task', description: 'Desc 2', status: 'done' },
        ];

        useTaskStore.mockReturnValue({
            tasks,
            isLoading: false,
            error: null,
            fetchTasks: fetchTasksMock,
            filter: 'all',
            groupBy: 'status', // Grouped by status
        });

        render(<DashboardPage />);

        // Headers for groups should be visible
        expect(screen.getByText(/todo \(1\)/i)).toBeInTheDocument();
        expect(screen.getByText(/done \(1\)/i)).toBeInTheDocument();

        expect(screen.getByText('Todo Task')).toBeInTheDocument();
        expect(screen.getByText('Done Task')).toBeInTheDocument();
    });
});

