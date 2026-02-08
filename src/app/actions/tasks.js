"use server";

import { tasks } from '@/infrastructure/db/memory';
import { revalidatePath } from 'next/cache';

export async function addTaskAction(data) {
    const id = String(Date.now());
    const newTask = {
        id,
        title: data.title,
        description: data.description,
        status: data.status || 'todo'
    };

    tasks.push(newTask);
    console.log('Server Action: Task Added', newTask);

    revalidatePath('/dashboard');
    return newTask;
}

export async function updateTaskAction(id, data) {
    const index = tasks.findIndex(t => t.id === id);
    if (index !== -1) {
        tasks[index] = { ...tasks[index], ...data };
        console.log('Server Action: Task Updated', id);
        revalidatePath('/dashboard');
    }
}

export async function deleteTaskAction(id) {
    const index = tasks.findIndex(t => t.id === id);
    if (index !== -1) {
        tasks.splice(index, 1);
        console.log('Server Action: Task Deleted', id);
        revalidatePath('/dashboard');
    }
}
