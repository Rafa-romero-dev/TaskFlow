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
});

export function TaskForm({ initialData = {}, onSubmit, onCancel, className }) {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            title: initialData.title || '',
            description: initialData.description || '',
        },
    });

    const handleFormSubmit = async (data) => {
        await onSubmit(data); // onSubmit might be async
    };

    return (
        <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className={cn("space-y-4 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl", className)}
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
                    className={cn("bg-slate-50 dark:bg-slate-950", errors.title && "border-red-500 focus-visible:ring-red-500")}
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
                    className="flex min-h-[80px] w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
                />
                {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
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
