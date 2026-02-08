import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/presentation/components/ui/Card';
import { Button } from '@/presentation/components/ui/Button';

import { cn } from '@/lib/utils';
import React from 'react';
import { Edit, Trash } from 'lucide-react';

import { useLanguageStore } from '@/presentation/store/useLanguageStore';

export function TaskCard({ task, onEdit, onDelete, onToggleStatus }) {
    const { t } = useLanguageStore();

    const statusColors = {
        'todo': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-900/50',
        'in-progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50',
        'done': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50',
    };

    const statusLabels = {
        'todo': `📋 ${t.status.todo}`,
        'in-progress': `🚀 ${t.status.inProgress}`,
        'done': `✅ ${t.status.done}`,
    };

    return (
        <Card className={cn(
            "hover:scale-[1.02] transition-all duration-200 group",
            task.isPending && "opacity-60 grayscale-[0.5] animate-pulse border-indigo-400"
        )}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-bold truncate pr-4">{task.title}</CardTitle>
                <button
                    onClick={() => onToggleStatus(task)}
                    title="Change Status"
                    className={cn(
                        'px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer border-none shadow-sm active:scale-95',
                        statusColors[task.status] || statusColors.todo
                    )}
                >
                    {statusLabels[task.status] || statusLabels.todo}
                </button>
            </CardHeader>
            <CardContent>
                <p className="text-slate-600 dark:text-slate-300 text-sm line-clamp-3">
                    {task.description}
                </p>
            </CardContent>
            <CardFooter className="flex justify-end gap-2 pt-2">
                <Button variant="ghost" size="icon" onClick={() => onEdit(task)}>
                    <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onDelete(task.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                    <Trash className="h-4 w-4" />
                </Button>
            </CardFooter>
        </Card>
    );
}
