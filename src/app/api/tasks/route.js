import { NextResponse } from 'next/server';
import { tasks, delay } from '@/infrastructure/db/memory';

export async function GET() {
    await delay(500);
    return NextResponse.json(tasks);
}

export async function POST(request) {
    await delay(500);

    try {
        const { title, description, status } = await request.json();

        // Simple unique ID generation for the mock DB
        const id = String(Date.now());
        const newTask = {
            id,
            title,
            description,
            status: status || 'todo'
        };

        tasks.push(newTask);

        return NextResponse.json(newTask, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: 'Error creating task' }, { status: 500 });
    }
}
