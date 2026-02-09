"use client";

import React, { use, useOptimistic, useTransition, useState } from 'react';
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
import { addTaskAction, updateTaskAction, deleteTaskAction } from '@/app/actions/tasks';

export default function DashboardClient({ tasksPromise }) {
    // 1. Consumer of the Server Promise using React 19 use()
    const initialTasks = use(tasksPromise);

    // 2. React 19 Optimistic state management
    const [optimisticTasks, addOptimisticTask] = useOptimistic(
        initialTasks,
        (state, { action, task }) => {
            switch (action) {
                case 'add':
                    return [...state, { ...task, id: 'temp-' + Date.now(), isPending: true }];
                case 'update':
                    return state.map(t => t.id === task.id ? { ...t, ...task, isPending: true } : t);
                case 'delete':
                    return state.filter(t => t.id !== task.id);
                default:
                    return state;
            }
        }
    );

    const { filter, groupBy } = useTaskStore();
    const { t } = useLanguageStore();
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [taskToDelete, setTaskToDelete] = useState(null);

    // 3. React 19 Compiler handles memoization automatically
    let filteredTasks = optimisticTasks;
    if (filter !== 'all') {
        filteredTasks = filteredTasks.filter(task => task.status === filter);
    }

    const filteredAndGroupedTasks = (() => {
        if (groupBy === 'status') {
            const groups = { 'todo': [], 'in-progress': [], 'done': [] };
            filteredTasks.forEach(task => {
                if (groups[task.status]) groups[task.status].push(task);
            });
            return { grouped: true, groups };
        }
        return { grouped: false, tasks: filteredTasks };
    })();

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

    const handleSubmit = (data) => {
        startTransition(async () => {
            if (editingTask) {
                addOptimisticTask({ action: 'update', task: { ...editingTask, ...data } });
                await updateTaskAction(editingTask.id, data);
            } else {
                addOptimisticTask({ action: 'add', task: { ...data, status: 'todo' } });
                await addTaskAction(data);
            }
            handleClose();
        });
    };

    const handleDelete = (id) => {
        setTaskToDelete(id);
    };

    const handleConfirmDelete = () => {
        if (!taskToDelete) return;
        const id = taskToDelete;
        startTransition(async () => {
            addOptimisticTask({ action: 'delete', task: { id } });
            await deleteTaskAction(id);
            setTaskToDelete(null);
        });
    };

    const handleStatusCycle = (task) => {
        const statusMap = {
            'todo': 'in-progress',
            'in-progress': 'done',
            'done': 'todo'
        };
        const nextStatus = statusMap[task.status] || 'todo';

        startTransition(async () => {
            addOptimisticTask({ action: 'update', task: { ...task, status: nextStatus } });
            await updateTaskAction(task.id, { status: nextStatus });
        });
    };

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        localStorage.removeItem('token');
        router.push('/login');
    };

    return (
        <div className="bg-pattern-grid min-h-screen bg-[var(--background)] p-6 transition-colors duration-500">
            <div className="max-w-[600px] lg:max-w-7xl mx-auto space-y-8">
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

                {optimisticTasks.length === 0 ? (
                    <div className="text-center py-20 bg-[var(--card)] rounded-xl border border-dashed border-[var(--border)]" data-testid="empty-state">
                        <h3 className="text-lg font-medium text-slate-800 dark:text-slate-50">{t.dashboard.noTasks}</h3>
                        <p className="text-slate-800 dark:text-slate-50 opacity-70 mt-1">{t.dashboard.getStarted}</p>
                        <Button variant="outline" onClick={handleCreate} className="mt-4">
                            {t.dashboard.createTask}
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-12" data-testid="task-list">
                        {filteredAndGroupedTasks.grouped ? (
                            Object.entries(filteredAndGroupedTasks.groups).map(([status, groupTasks]) => (
                                groupTasks.length > 0 && (
                                    <div key={status} className="space-y-4" data-testid={`group - ${status} `}>
                                        <div className="flex items-center gap-2">
                                            <div className={cn(
                                                "w-3 h-3 rounded-full",
                                                status === 'todo' ? "bg-yellow-400" :
                                                    status === 'in-progress' ? "bg-blue-400" : "bg-green-400"
                                            )} />
                                            <h2 className="text-lg font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400" data-testid={`group - header - ${status} `}>
                                                {status.replace('-', ' ')} ({groupTasks.length})
                                            </h2>
                                        </div>
                                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                            {groupTasks.map((task) => (
                                                <TaskCard
                                                    key={task.id}
                                                    task={task}
                                                    onEdit={handleEdit}
                                                    onDelete={() => handleDelete(task.id)}
                                                    onToggleStatus={handleStatusCycle}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )
                            ))
                        ) : (
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" data-testid="task-list-simple">
                                {filteredAndGroupedTasks.tasks.map((task) => (
                                    <TaskCard
                                        key={task.id}
                                        task={task}
                                        onEdit={handleEdit}
                                        onDelete={() => handleDelete(task.id)}
                                        onToggleStatus={handleStatusCycle}
                                    />
                                ))}
                            </div>
                        )}

                        {!filteredAndGroupedTasks.grouped && filteredAndGroupedTasks.tasks.length === 0 && (
                            <div className="text-center py-20" data-testid="no-matches-message">
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

            {taskToDelete && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-md p-4 animate-in fade-in duration-300">
                    <div className="bg-[var(--card)] border border-[var(--border)] p-8 rounded-2xl shadow-2xl max-w-sm w-full animate-in zoom-in-95 duration-200 text-center">
                        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Plus className="rotate-45 h-8 w-8" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">{t.common.deleteAction}</h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-8">{t.common.confirmDelete}</p>
                        <div className="flex gap-4">
                            <Button
                                variant="outline"
                                className="flex-1 rounded-xl"
                                onClick={() => setTaskToDelete(null)}
                                data-testid="cancel-delete"
                            >
                                {t.common.cancel}
                            </Button>
                            <Button
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl border-none"
                                onClick={handleConfirmDelete}
                                data-testid="confirm-delete"
                            >
                                {t.common.delete}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Global pending indicator for transitions */}
            {isPending && (
                <div className="fixed bottom-4 right-4 bg-indigo-600 text-white px-4 py-2 rounded-full shadow-lg text-xs font-bold animate-bounce z-50">
                    {t.common.validatingSession}
                </div>
            )}
        </div>
    );
}
