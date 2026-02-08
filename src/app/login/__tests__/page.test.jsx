import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '../page';
import { useRouter } from 'next/navigation';

// Mock next/navigation
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(() => ({
        push: jest.fn(),
        replace: jest.fn(),
    })),
}));

// Mock fetch
global.fetch = jest.fn();

describe('LoginPage', () => {
    const pushMock = jest.fn();
    const replaceMock = jest.fn();

    beforeEach(() => {
        useRouter.mockReturnValue({ push: pushMock, replace: replaceMock });
        fetch.mockClear();
        pushMock.mockClear();
        replaceMock.mockClear();
        localStorage.clear();
    });

    it('renders login form correctly after checking auth', async () => {
        render(<LoginPage />);

        // Wait for isChecking to become false
        await waitFor(() => {
            expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        });

        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    });

    it('redirects if token already exists', async () => {
        localStorage.setItem('token', 'existing-token');
        render(<LoginPage />);

        await waitFor(() => {
            expect(replaceMock).toHaveBeenCalledWith('/dashboard');
        });
    });

    it('shows validation errors for invalid input', async () => {
        render(<LoginPage />);

        await waitFor(() => {
            expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        });

        fireEvent.click(screen.getByRole('button', { name: /login/i }));

        await waitFor(() => {
            expect(screen.getByText(/password must be at least 6 characters/i)).toBeInTheDocument();
        });
    });

    it('submits form successfully and redirects', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ token: 'fake-jwt-token' }),
        });

        render(<LoginPage />);

        await waitFor(() => {
            expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        });

        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: '123pass456' } });

        fireEvent.click(screen.getByRole('button', { name: /login/i }));

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith('/api/auth/login', expect.objectContaining({
                method: 'POST',
                body: JSON.stringify({ email: 'test@example.com', password: '123pass456' }),
            }));
            expect(pushMock).toHaveBeenCalledWith('/dashboard');
            expect(localStorage.getItem('token')).toBe('fake-jwt-token');
        });
    });

    it('displays error message on failed login', async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
        });

        render(<LoginPage />);

        await waitFor(() => {
            expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        });

        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrongpassword' } });

        fireEvent.click(screen.getByRole('button', { name: /login/i }));

        await waitFor(() => {
            expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
        });
    });
});
