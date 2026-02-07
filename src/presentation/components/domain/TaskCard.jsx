import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/presentation/components/ui/Card';
import { Button } from '@/presentation/components/ui/Button';
import { useTaskStore } from '@/presentation/store/useTaskStore';
import { cn } from '@/lib/utils';
import React from 'react';
import { Edit, Trash } from 'lucide-react';

export function TaskCard({ task, onEdit }) {
    const { deleteTask } = useTaskStore();

    const statusColors = {
        pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
        'in-progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
        completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    };

    return (
        <Card className="hover:scale-[1.02] transition-transform duration-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-bold truncate pr-4">{task.title}</CardTitle>
                <span className={cn('px-2.5 py-0.5 rounded-full text-xs font-medium', statusColors[task.status] || statusColors.pending)}>
                    {task.status}
                </span>
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
                <Button variant="ghost" size="icon" onClick={() => deleteTask(task.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                    <Trash className="h-4 w-4" />
                </Button>
            </CardFooter>
        </Card>
    );
}
