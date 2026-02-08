import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TaskForm } from '../TaskForm';

describe('TaskForm', () => {
    const onSubmitMock = jest.fn();
    const onCancelMock = jest.fn();

    beforeEach(() => {
        onSubmitMock.mockClear();
        onCancelMock.mockClear();
    });

    it('renders correctly', () => {
        render(<TaskForm onSubmit={onSubmitMock} onCancel={onCancelMock} />);
        expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
    });

    it('validates required fields', async () => {
        render(<TaskForm onSubmit={onSubmitMock} onCancel={onCancelMock} />);

        fireEvent.click(screen.getByRole('button', { name: /save/i }));

        await waitFor(() => {
            expect(screen.getByText(/title is required/i)).toBeInTheDocument();
        });
        expect(onSubmitMock).not.toHaveBeenCalled();
    });

    it('submits valid data', async () => {
        render(<TaskForm onSubmit={onSubmitMock} onCancel={onCancelMock} />);

        fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'New Task' } });
        fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Desc' } });

        fireEvent.click(screen.getByRole('button', { name: /save/i }));

        await waitFor(() => {
            expect(onSubmitMock).toHaveBeenCalledWith(expect.objectContaining({
                title: 'New Task',
                description: 'Desc',
                status: 'todo', // Added status expectation
            }));
        });
    });

    it('pre-fills data in edit mode', () => {
        const initialData = { title: 'Existing Task', description: 'Existing Desc' };
        render(<TaskForm initialData={initialData} onSubmit={onSubmitMock} onCancel={onCancelMock} />);

        expect(screen.getByLabelText(/title/i)).toHaveValue('Existing Task');
        expect(screen.getByLabelText(/description/i)).toHaveValue('Existing Desc');
    });

    it('calls onCancel when cancel button clicked', () => {
        render(<TaskForm onSubmit={onSubmitMock} onCancel={onCancelMock} />);

        fireEvent.click(screen.getByTestId('task-form-cancel-bottom'));

        expect(onCancelMock).toHaveBeenCalled();
    });

    it('renders status field with default value', () => {
        render(<TaskForm onSubmit={onSubmitMock} onCancel={onCancelMock} />);

        const statusSelect = screen.getByLabelText(/status/i);
        expect(statusSelect).toBeInTheDocument();
        expect(statusSelect).toHaveValue('todo');
    });

    it('submits data with selected status', async () => {
        render(<TaskForm onSubmit={onSubmitMock} onCancel={onCancelMock} />);

        fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Task with status' } });
        fireEvent.change(screen.getByLabelText(/status/i), { target: { value: 'in-progress' } });

        fireEvent.click(screen.getByRole('button', { name: /save/i }));

        await waitFor(() => {
            expect(onSubmitMock).toHaveBeenCalledWith(expect.objectContaining({
                title: 'Task with status',
                status: 'in-progress',
            }));
        });
    });

    it('pre-fills status in edit mode', () => {
        const initialData = { title: 'Existing Task', description: 'Existing Desc', status: 'done' };
        render(<TaskForm initialData={initialData} onSubmit={onSubmitMock} onCancel={onCancelMock} />);

        expect(screen.getByLabelText(/status/i)).toHaveValue('done');
    });
});
