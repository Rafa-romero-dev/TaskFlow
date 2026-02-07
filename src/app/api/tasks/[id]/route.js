import { NextResponse } from 'next/server';
import { tasks, delay } from '@/infrastructure/db/memory';

export async function GET(request, { params }) {
    await delay(500);
    const { id } = await params;
    const task = tasks.find(t => t.id === id);

    if (!task) {
        return NextResponse.json({ message: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json(task);
}

export async function PUT(request, { params }) {
    await delay(500);
    const { id } = await params;
    const index = tasks.findIndex(t => t.id === id);

    if (index === -1) {
        return NextResponse.json({ message: 'Task not found' }, { status: 404 });
    }

    try {
        const body = await request.json();
        // Update fields
        tasks[index] = { ...tasks[index], ...body };

        return NextResponse.json(tasks[index]);
    } catch (error) {
        return NextResponse.json({ message: 'Error updating task' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    await delay(500);
    const { id } = await params;
    const index = tasks.findIndex(t => t.id === id);

    if (index === -1) {
        return NextResponse.json({ message: 'Task not found' }, { status: 404 });
    }

    tasks.splice(index, 1);
    return new NextResponse(null, { status: 204 });
}
