import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '../page';
import { useRouter } from 'next/navigation';

// Mock next/navigation
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

// Mock fetch
global.fetch = jest.fn();

describe('LoginPage', () => {
    const pushMock = jest.fn();

    beforeEach(() => {
        useRouter.mockReturnValue({ push: pushMock });
        fetch.mockClear();
        pushMock.mockClear();
    });

    it('renders login form correctly', () => {
        render(<LoginPage />);
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    });

    it('shows validation errors for invalid input', async () => {
        render(<LoginPage />);

        fireEvent.click(screen.getByRole('button', { name: /login/i }));

        await waitFor(() => {
            expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
            expect(screen.getByText(/password must be at least 6 characters/i)).toBeInTheDocument();
        });
    });

    it('submits form successfully and redirects', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ token: '123' }),
        });

        render(<LoginPage />);

        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });

        fireEvent.click(screen.getByRole('button', { name: /login/i }));

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith('/api/auth/login', expect.objectContaining({
                method: 'POST',
                body: JSON.stringify({ email: 'test@example.com', password: 'password123' }),
            }));
            expect(pushMock).toHaveBeenCalledWith('/dashboard');
        });
    });

    it('displays error message on failed login', async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
        });

        render(<LoginPage />);

        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrongpassword' } });

        fireEvent.click(screen.getByRole('button', { name: /login/i }));

        await waitFor(() => {
            expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
        });
    });
});
