import React, { Suspense } from 'react';
import { getTasks } from '@/infrastructure/api/tasks';
import DashboardClient from '@/presentation/components/domain/DashboardClient';
import { DashboardSkeleton } from '@/presentation/components/ui/DashboardSkeleton';
import { ErrorBoundary } from '@/presentation/components/ui/ErrorBoundary';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

/**
 * Using Server Component for Zero Bundle Size fetching.
 * Implements Streaming with Suspense.
 * Handles Auth at the Server level.
 */
export default async function DashboardPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get('session_token');

    if (!token) {
        redirect('/login');
    }

    // Initiate data fetch (Promise is passed to Client Component)
    const tasksPromise = getTasks();

    return (
        <div className="bg-pattern-grid min-h-screen bg-[var(--background)] p-6 transition-colors duration-500">
            <ErrorBoundary>
                <Suspense fallback={<DashboardSkeleton />}>
                    <DashboardClient tasksPromise={tasksPromise} />
                </Suspense>
            </ErrorBoundary>
        </div>
    );
}
