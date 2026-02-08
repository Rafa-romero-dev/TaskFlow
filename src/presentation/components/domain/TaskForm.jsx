import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/presentation/components/ui/Button';
import { Input } from '@/presentation/components/ui/Input';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

const schema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    status: z.enum(['todo', 'in-progress', 'done']).default('todo'),
});

export function TaskForm({ initialData = {}, onSubmit, onCancel, className }) {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            title: initialData.title || '',
            description: initialData.description || '',
            status: initialData.status || 'todo',
        },
    });

    const handleFormSubmit = async (data) => {
        await onSubmit(data); // onSubmit might be async
    };

    return (
        <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className={cn("space-y-4 bg-[var(--card)] text-[var(--card-foreground)] p-6 rounded-xl border border-[var(--border)] shadow-xl transition-all duration-300", className)}
        >
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    {initialData.id ? 'Edit Task' : 'New Task'}
                </h3>
                <Button type="button" variant="ghost" size="icon" onClick={onCancel}>
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                </Button>
            </div>

            <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Title
                </label>
                <Input
                    id="title"
                    placeholder="Task title"
                    {...register('title')}
                    className={cn(errors.title && "border-red-500 focus-visible:ring-red-500")}
                />
                {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Description
                </label>
                <textarea
                    id="description"
                    placeholder="Task description"
                    {...register('description')}
                    className="flex min-h-[80px] w-full rounded-xl border border-[var(--border)] bg-[var(--input-background)] text-[var(--input-foreground)] px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300"
                />
                {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
            </div>

            <div className="space-y-2">
                <label htmlFor="status" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Status
                </label>
                <select
                    id="status"
                    {...register('status')}
                    className="flex h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--input-background)] text-[var(--input-foreground)] px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300"
                >
                    <option value="todo">📋 To Do</option>
                    <option value="in-progress">🚀 In Progress</option>
                    <option value="done">✅ Done</option>
                </select>
                {errors.status && <p className="text-xs text-red-500">{errors.status.message}</p>}
            </div>

            <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Save'}
                </Button>
            </div>
        </form>
    );
}
