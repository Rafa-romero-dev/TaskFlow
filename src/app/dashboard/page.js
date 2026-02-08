import React, { Suspense } from 'react';
import { getTasks } from '@/infrastructure/api/tasks';
import DashboardClient from '@/presentation/components/domain/DashboardClient';
import { DashboardSkeleton } from '@/presentation/components/ui/DashboardSkeleton';
import { ErrorBoundary } from '@/presentation/components/ui/ErrorBoundary';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

/**
 * Senior Architect Review:
 * 1. Converted to Server Component for Zero Bundle Size fetching.
 * 2. Implements Streaming with Suspense.
 * 3. Handles Auth at the Server level using cookies.
 */
export default async function DashboardPage() {
    // 1. Server-side auth check
    const cookieStore = await cookies();
    const token = cookieStore.get('session_token');

    if (!token) {
        redirect('/login');
    }

    // 2. Initiate data fetch (Promise is passed to Client Component)
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
