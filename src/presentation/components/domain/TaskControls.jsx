import React from 'react';
import { Dropdown } from '@/presentation/components/ui/Dropdown';
import { useTaskStore } from '@/presentation/store/useTaskStore';
import {
    Filter,
    LayoutGrid,
    ListTodo,
    Circle,
    Timer,
    CheckCircle2,
    StretchHorizontal
} from 'lucide-react';

const TaskControls = () => {
    const { filter, setFilter, groupBy, setGroupBy } = useTaskStore();

    const filterOptions = [
        { value: 'all', label: 'All Tasks', icon: Filter },
        { value: 'todo', label: 'To Do', icon: Circle },
        { value: 'in-progress', label: 'In Progress', icon: Timer },
        { value: 'done', label: 'Done', icon: CheckCircle2 },
    ];

    const groupOptions = [
        { value: 'none', label: 'No Grouping', icon: StretchHorizontal },
        { value: 'status', label: 'By Status', icon: LayoutGrid },
    ];

    return (
        <div className="flex flex-col sm:flex-row items-end gap-4 bg-[var(--card)] p-4 rounded-2xl border border-[var(--border)] shadow-sm">
            <Dropdown
                label="Filter by"
                options={filterOptions}
                value={filter}
                onChange={setFilter}
                placeholder="All Tasks"
            />
            <Dropdown
                label="Group by"
                options={groupOptions}
                value={groupBy}
                onChange={setGroupBy}
                placeholder="No Grouping"
            />
        </div>
    );
};

export { TaskControls };
