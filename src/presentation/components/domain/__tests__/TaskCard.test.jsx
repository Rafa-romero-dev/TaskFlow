import { render, screen, fireEvent } from '@testing-library/react';
import { TaskCard } from '../TaskCard';
import { useTaskStore } from '@/presentation/store/useTaskStore';

// Mock the store
jest.mock('@/presentation/store/useTaskStore');

describe('TaskCard', () => {
    const mockDeleteTask = jest.fn();
    const mockOnEdit = jest.fn();

    beforeEach(() => {
        useTaskStore.mockReturnValue({
            deleteTask: mockDeleteTask,
        });
        mockDeleteTask.mockClear();
        mockOnEdit.mockClear();
    });

    it('renders task with todo status', () => {
        const task = {
            id: '1',
            title: 'Test Task',
            description: 'Test Description',
            status: 'todo',
        };

        render(<TaskCard task={task} onEdit={mockOnEdit} />);

        expect(screen.getByText('Test Task')).toBeInTheDocument();
        expect(screen.getByText('Test Description')).toBeInTheDocument();
        expect(screen.getByText('📋 To Do')).toBeInTheDocument();
    });

    it('renders task with in-progress status', () => {
        const task = {
            id: '2',
            title: 'In Progress Task',
            description: 'Working on it',
            status: 'in-progress',
        };

        render(<TaskCard task={task} onEdit={mockOnEdit} />);

        expect(screen.getByText('🚀 In Progress')).toBeInTheDocument();
    });

    it('renders task with done status', () => {
        const task = {
            id: '3',
            title: 'Completed Task',
            description: 'All done',
            status: 'done',
        };

        render(<TaskCard task={task} onEdit={mockOnEdit} />);

        expect(screen.getByText('✅ Done')).toBeInTheDocument();
    });

    it('calls onEdit when edit button is clicked', () => {
        const task = {
            id: '1',
            title: 'Test Task',
            description: 'Test Description',
            status: 'todo',
        };

        render(<TaskCard task={task} onEdit={mockOnEdit} />);

        const editButtons = screen.getAllByRole('button');
        const editButton = editButtons[0]; // First button is edit
        fireEvent.click(editButton);

        expect(mockOnEdit).toHaveBeenCalledWith(task);
    });

    it('calls deleteTask when delete button is clicked', () => {
        const task = {
            id: '1',
            title: 'Test Task',
            description: 'Test Description',
            status: 'todo',
        };

        render(<TaskCard task={task} onEdit={mockOnEdit} />);

        const buttons = screen.getAllByRole('button');
        const deleteButton = buttons[1]; // Second button is delete
        fireEvent.click(deleteButton);

        expect(mockDeleteTask).toHaveBeenCalledWith('1');
    });

    it('applies correct color classes for each status', () => {
        const { rerender } = render(
            <TaskCard
                task={{ id: '1', title: 'Task', description: 'Desc', status: 'todo' }}
                onEdit={mockOnEdit}
            />
        );

        let statusBadge = screen.getByText('📋 To Do');
        expect(statusBadge).toHaveClass('bg-yellow-100', 'text-yellow-800');

        rerender(
            <TaskCard
                task={{ id: '1', title: 'Task', description: 'Desc', status: 'in-progress' }}
                onEdit={mockOnEdit}
            />
        );

        statusBadge = screen.getByText('🚀 In Progress');
        expect(statusBadge).toHaveClass('bg-blue-100', 'text-blue-800');

        rerender(
            <TaskCard
                task={{ id: '1', title: 'Task', description: 'Desc', status: 'done' }}
                onEdit={mockOnEdit}
            />
        );

        statusBadge = screen.getByText('✅ Done');
        expect(statusBadge).toHaveClass('bg-green-100', 'text-green-800');
    });
});
