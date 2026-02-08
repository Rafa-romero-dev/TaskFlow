import { NextResponse } from 'next/server';
import { delay } from '@/infrastructure/db/memory';

export async function POST(request) {
    await delay(500);

    try {
        const { email, password } = await request.json();

        if (email === 'test@example.com' && password === '123pass456') {
            const token = 'fake-jwt-token';
            const response = NextResponse.json({
                token,
                user: {
                    id: 'u1',
                    email: 'test@example.com',
                    name: 'Test User'
                }
            });

            // Set cookie for Server Side authentication
            response.cookies.set('session_token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 7, // 1 week
                path: '/',
            });

            return response;
        }

        return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    } catch (error) {
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
