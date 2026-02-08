import { render, screen, fireEvent } from '@testing-library/react';
import { Dropdown } from '../Dropdown';
import React from 'react';

const mockOptions = [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
];

describe('Dropdown', () => {
    it('renders with placeholder when no value is selected', () => {
        render(
            <Dropdown
                options={mockOptions}
                onChange={() => { }}
                placeholder="Select something"
            />
        );
        expect(screen.getByText('Select something')).toBeInTheDocument();
    });

    it('renders with label if provided', () => {
        render(
            <Dropdown
                label="My Label"
                options={mockOptions}
                onChange={() => { }}
            />
        );
        expect(screen.getByText('My Label')).toBeInTheDocument();
    });

    it('displays the selected option label', () => {
        render(
            <Dropdown
                options={mockOptions}
                value="2"
                onChange={() => { }}
            />
        );
        expect(screen.getByText('Option 2')).toBeInTheDocument();
    });

    it('toggles menu on click', () => {
        render(
            <Dropdown
                options={mockOptions}
                onChange={() => { }}
            />
        );

        const button = screen.getByRole('button');
        fireEvent.click(button);

        expect(screen.getByText('Option 1')).toBeInTheDocument();
        expect(screen.getByText('Option 2')).toBeInTheDocument();
    });

    it('calls onChange and closes menu when an option is selected', () => {
        const onChangeMock = jest.fn();
        render(
            <Dropdown
                options={mockOptions}
                onChange={onChangeMock}
            />
        );

        fireEvent.click(screen.getByRole('button'));
        fireEvent.click(screen.getByText('Option 1'));

        expect(onChangeMock).toHaveBeenCalledWith('1');
        expect(screen.queryByText('Option 2')).not.toBeInTheDocument();
    });

    it('renders icons for options if provided', () => {
        const MockIcon = () => <span data-testid="mock-icon" />;
        const iconOptions = [
            { value: '1', label: 'Option 1', icon: MockIcon },
        ];

        render(
            <Dropdown
                options={iconOptions}
                onChange={() => { }}
            />
        );

        fireEvent.click(screen.getByRole('button'));
        expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
    });
});
