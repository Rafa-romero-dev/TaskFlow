import { tasks, delay } from '@/infrastructure/db/memory';

/**
 * Expert-level Server Data Fetching.
 * In a real Next.js app, this would query a database directly.
 * Here it returns memory tasks with a simulated delay to demonstrate Suspense.
 */
export async function getTasks() {
    await delay(800); // Simulate network latency for demonstration
    // Return a clone to prevent direct state mutation across requests
    return JSON.parse(JSON.stringify(tasks));
}
