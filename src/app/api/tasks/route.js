import { NextResponse } from 'next/server';
import { tasks, idCounter, delay } from '@/infrastructure/db/memory';
import { Task } from '@/core/entities/Task';

export async function GET() {
    await delay(500);
    return NextResponse.json(tasks);
}

export async function POST(request) {
    await delay(500);

    try {
        const { title, description, status } = await request.json();

        // In a real app, I'd increment idCounter properly, but here we can export/import mutable let variable
        // Wait, imports are live bindings, but reassigning exported `let` from another module doesn't work as expected if I want to update `idCounter` in `memory.js`.
        // I should probably have a function to add task in memory.js to encapsulate state mutation. 
        // But for now let's just push to the array.
        // However, importing `idCounter` implies I can read it. To update it I need a function.

        // Let's just generate ID randomly or use a function in memory.js if I want strictly clean code.
        // I'll update `memory.js` afterwards to be better if needed, but for now:

        const id = String(Date.now()); // Simple unique ID
        const newTask = new Task(id, title, description, status || 'todo');

        tasks.push(newTask);

        return NextResponse.json(newTask, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: 'Error creating task' }, { status: 500 });
    }
}
