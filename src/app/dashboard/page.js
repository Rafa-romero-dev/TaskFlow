"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { useTaskStore } from '@/presentation/store/useTaskStore';
import { TaskCard } from '@/presentation/components/domain/TaskCard';
import { TaskForm } from '@/presentation/components/domain/TaskForm';
import { TaskControls } from '@/presentation/components/domain/TaskControls';
import { Button } from '@/presentation/components/ui/Button';
import { ModeToggle } from '@/presentation/components/ui/ModeToggle';
import { Plus, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useLanguageStore } from '@/presentation/store/useLanguageStore';
import { LanguageToggle } from '@/presentation/components/ui/LanguageToggle';


export default function DashboardPage() {
    const {
        tasks,
        isLoading,
        error,
        fetchTasks,
        addTask,
        updateTask,
        filter,
        groupBy
    } = useTaskStore();
    const { t } = useLanguageStore();
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const filteredAndGroupedTasks = useMemo(() => {
        let result = tasks;

        // Apply filter
        if (filter !== 'all') {
            result = result.filter(task => task.status === filter);
        }

        // Apply grouping
        if (groupBy === 'status') {
            const groups = {
                'todo': [],
                'in-progress': [],
                'done': []
            };

            result.forEach(task => {
                if (groups[task.status]) {
                    groups[task.status].push(task);
                }
            });

            return { grouped: true, groups };
        }

        return { grouped: false, tasks: result };
    }, [tasks, filter, groupBy]);

    const handleCreate = () => {
        setEditingTask(null);
        setIsModalOpen(true);
    };

    const handleEdit = (task) => {
        setEditingTask(task);
        setIsModalOpen(true);
    };

    const handleClose = () => {
        setIsModalOpen(false);
        setEditingTask(null);
    };

    const handleSubmit = async (data) => {
        if (editingTask) {
            await updateTask(editingTask.id, data);
        } else {
            await addTask(data);
        }
        handleClose();
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/login'); // Assuming login is at /login or root, usually /login based on previous context.
        // Wait, the file structure shows src/app/login/page.js, so route is /login.
    };

    if (isLoading && tasks.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen text-slate-500 animate-pulse bg-slate-50 dark:bg-slate-950">
                {t.dashboard.loading}
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen text-red-500 bg-slate-50 dark:bg-slate-950">
                Error: {error}
            </div>
        );
    }

    return (
        <div className="bg-pattern-grid min-h-screen bg-[var(--background)] p-6 transition-colors duration-500">
            <div className="max-w-7xl mx-auto space-y-8">
                <header className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-50">{t.dashboard.title}</h1>
                            <p className="text-slate-800 dark:text-slate-50 opacity-70">{t.dashboard.subtitle}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <LanguageToggle />
                            <ModeToggle />
                            <Button variant="ghost" size="icon" onClick={handleLogout} title={t.dashboard.logout}>
                                <LogOut className="h-[1.2rem] w-[1.2rem] text-red-500 hover:text-slate-950 transition-colors" />
                            </Button>
                        </div>
                    </div>
                    <Button onClick={handleCreate} className="w-full sm:w-auto sm:self-end shadow-lg hover:shadow-indigo-500/20 transition-shadow">
                        <Plus className="mr-2 h-4 w-4" /> {t.dashboard.newTask}
                    </Button>
                </header>

                <TaskControls />

                {tasks.length === 0 && !isLoading ? (
                    <div className="text-center py-20 bg-[var(--card)] rounded-xl border border-dashed border-[var(--border)]">
                        <h3 className="text-lg font-medium text-slate-800 dark:text-slate-50">{t.dashboard.noTasks}</h3>
                        <p className="text-slate-800 dark:text-slate-50 opacity-70 mt-1">{t.dashboard.getStarted}</p>
                        <Button variant="outline" onClick={handleCreate} className="mt-4">
                            {t.dashboard.createTask}
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-12">
                        {filteredAndGroupedTasks.grouped ? (
                            Object.entries(filteredAndGroupedTasks.groups).map(([status, groupTasks]) => (
                                groupTasks.length > 0 && (
                                    <div key={status} className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <div className={cn(
                                                "w-3 h-3 rounded-full",
                                                status === 'todo' ? "bg-yellow-400" :
                                                    status === 'in-progress' ? "bg-blue-400" : "bg-green-400"
                                            )} />
                                            <h2 className="text-lg font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                                {status.replace('-', ' ')} ({groupTasks.length})
                                            </h2>
                                        </div>
                                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                            {groupTasks.map((task) => (
                                                <TaskCard key={task.id} task={task} onEdit={handleEdit} />
                                            ))}
                                        </div>
                                    </div>
                                )
                            ))
                        ) : (
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {filteredAndGroupedTasks.tasks.map((task) => (
                                    <TaskCard key={task.id} task={task} onEdit={handleEdit} />
                                ))}
                            </div>
                        )}

                        {!filteredAndGroupedTasks.grouped && filteredAndGroupedTasks.tasks.length === 0 && (
                            <div className="text-center py-20">
                                <p className="text-slate-500">{t.dashboard.noMatches}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="w-full max-w-lg animate-in zoom-in-95 duration-200">
                        <TaskForm
                            initialData={editingTask || {}}
                            onSubmit={handleSubmit}
                            onCancel={handleClose}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
