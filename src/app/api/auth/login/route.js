import { NextResponse } from 'next/server';
import { delay } from '@/infrastructure/db/memory';

export async function POST(request) {
    await delay(500);

    try {
        const { email, password } = await request.json();

        if (email === 'test@example.com' && password === 'password123') {
            return NextResponse.json({
                token: 'fake-jwt-token',
                user: {
                    id: 'u1',
                    email: 'test@example.com',
                    name: 'Test User'
                }
            });
        }

        return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    } catch (error) {
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
