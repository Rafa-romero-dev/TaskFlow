import { render, screen, fireEvent } from '@testing-library/react';
import { TaskCard } from '../TaskCard';

describe('TaskCard', () => {
    const mockOnDelete = jest.fn();
    const mockOnEdit = jest.fn();
    const mockOnToggleStatus = jest.fn();

    const task = {
        id: '1',
        title: 'Test Task',
        description: 'Test Description',
        status: 'todo',
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders task with todo status', () => {
        render(
            <TaskCard
                task={task}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
                onToggleStatus={mockOnToggleStatus}
            />
        );

        expect(screen.getByTestId('task-title')).toHaveTextContent('Test Task');
        expect(screen.getByTestId('task-description')).toHaveTextContent('Test Description');
        expect(screen.getByTestId('status-toggle')).toHaveTextContent('📋 To Do');
    });

    it('calls onEdit when edit button is clicked', () => {
        render(
            <TaskCard
                task={task}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
                onToggleStatus={mockOnToggleStatus}
            />
        );

        fireEvent.click(screen.getByTestId('edit-task'));
        expect(mockOnEdit).toHaveBeenCalledWith(task);
    });

    it('calls onDelete when delete button is clicked', () => {
        render(
            <TaskCard
                task={task}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
                onToggleStatus={mockOnToggleStatus}
            />
        );

        fireEvent.click(screen.getByTestId('delete-task'));
        expect(mockOnDelete).toHaveBeenCalledWith('1');
    });

    it('calls onToggleStatus when status badge is clicked', () => {
        render(
            <TaskCard
                task={task}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
                onToggleStatus={mockOnToggleStatus}
            />
        );

        fireEvent.click(screen.getByTestId('status-toggle'));
        expect(mockOnToggleStatus).toHaveBeenCalledWith(task);
    });

    it('applies pending styles when isPending is true', () => {
        const pendingTask = { ...task, isPending: true };
        render(
            <TaskCard
                task={pendingTask}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
                onToggleStatus={mockOnToggleStatus}
            />
        );

        const card = screen.getByTestId('task-card-1');
        expect(card).toHaveClass('opacity-60', 'animate-pulse');
    });
});
