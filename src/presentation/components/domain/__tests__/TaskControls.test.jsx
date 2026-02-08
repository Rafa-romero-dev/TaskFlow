import { render, screen, fireEvent } from '@testing-library/react';
import { TaskControls } from '../TaskControls';
import { useTaskStore } from '@/presentation/store/useTaskStore';

// Mock the store
jest.mock('@/presentation/store/useTaskStore');

describe('TaskControls', () => {
    const setFilterMock = jest.fn();
    const setGroupByMock = jest.fn();

    beforeEach(() => {
        useTaskStore.mockReturnValue({
            filter: 'all',
            setFilter: setFilterMock,
            groupBy: 'none',
            setGroupBy: setGroupByMock,
        });
        setFilterMock.mockClear();
        setGroupByMock.mockClear();
    });

    it('renders filter and group dropdowns', () => {
        render(<TaskControls />);
        expect(screen.getByText(/filter by/i)).toBeInTheDocument();
        expect(screen.getByText(/group by/i)).toBeInTheDocument();
    });

    it('calls setFilter when a filter is selected', () => {
        render(<TaskControls />);

        // Open Filter dropdown
        const filterButton = screen.getAllByRole('button')[0];
        fireEvent.click(filterButton);

        // Select 'Done' filter
        const doneOption = screen.getByText(/done/i);
        fireEvent.click(doneOption);

        expect(setFilterMock).toHaveBeenCalledWith('done');
    });

    it('calls setGroupBy when a group is selected', () => {
        render(<TaskControls />);

        // Open Group dropdown
        const groupButton = screen.getAllByRole('button')[1];
        fireEvent.click(groupButton);

        // Select 'By Status' group
        const statusOption = screen.getByText(/by status/i);
        fireEvent.click(statusOption);

        expect(setGroupByMock).toHaveBeenCalledWith('status');
    });
});
