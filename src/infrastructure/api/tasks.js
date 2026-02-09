import { tasks, delay } from '@/infrastructure/db/memory';

/**
 * In a real Next.js app, this would query a database.
 * Here it returns memory tasks with a simulated delay.
 */
export async function getTasks() {
    await delay(800);
    // Convert class instances to plain objects for Server-to-Client serialization
    return JSON.parse(JSON.stringify(tasks));
}
