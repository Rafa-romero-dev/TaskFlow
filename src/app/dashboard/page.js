"use client";

import React, { useEffect, useState } from 'react';
import { useTaskStore } from '@/presentation/store/useTaskStore';
import { TaskCard } from '@/presentation/components/domain/TaskCard';
import { TaskForm } from '@/presentation/components/domain/TaskForm';
import { Button } from '@/presentation/components/ui/Button';
import { ModeToggle } from '@/presentation/components/ui/ModeToggle';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';


export default function DashboardPage() {
    const { tasks, isLoading, error, fetchTasks, addTask, updateTask } = useTaskStore();
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

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

    if (isLoading && tasks.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen text-slate-500 animate-pulse bg-slate-50 dark:bg-slate-950">
                Loading tasks...
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
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6">
            <div className="max-w-7xl mx-auto space-y-8">
                <header className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">My Tasks</h1>
                        <p className="text-slate-500 dark:text-slate-400">Manage your daily goals</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <ModeToggle />
                        <Button onClick={handleCreate} className="shadow-lg hover:shadow-indigo-500/20 transition-shadow">
                            <Plus className="mr-2 h-4 w-4" /> New Task
                        </Button>
                    </div>
                </header>

                {tasks.length === 0 && !isLoading ? (
                    <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                        <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">No tasks found</h3>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">Get started by creating a new task.</p>
                        <Button variant="outline" onClick={handleCreate} className="mt-4">
                            Create Task
                        </Button>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {tasks.map((task) => (
                            <TaskCard key={task.id} task={task} onEdit={handleEdit} />
                        ))}
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
