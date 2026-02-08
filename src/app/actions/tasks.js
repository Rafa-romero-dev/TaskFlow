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
    revalidatePath('/dashboard');
    return newTask;
}

export async function updateTaskAction(id, data) {
    const index = tasks.findIndex(t => t.id === id);
    if (index !== -1) {
        tasks[index] = { ...tasks[index], ...data };
        revalidatePath('/dashboard');
    }
}

export async function deleteTaskAction(id) {
    const index = tasks.findIndex(t => t.id === id);
    if (index !== -1) {
        tasks.splice(index, 1);
        revalidatePath('/dashboard');
    }
}
