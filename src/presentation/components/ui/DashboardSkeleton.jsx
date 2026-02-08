import React from 'react';

export function DashboardSkeleton() {
    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-pulse">
            <header className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
                        <div className="h-4 w-64 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
                    </div>
                    <div className="flex gap-2">
                        <div className="h-10 w-10 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
                        <div className="h-10 w-10 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
                    </div>
                </div>
                <div className="h-10 w-32 self-end bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
            </header>

            <div className="h-20 w-full bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-48 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
                ))}
            </div>
        </div>
    );
}
