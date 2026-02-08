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

import { useLanguageStore } from '@/presentation/store/useLanguageStore';
const TaskControls = () => {
    const { filter, setFilter, groupBy, setGroupBy } = useTaskStore();
    const { t } = useLanguageStore();

    const filterOptions = [
        { value: 'all', label: t.controls.allTasks, icon: Filter },
        { value: 'todo', label: t.controls.todo, icon: Circle },
        { value: 'in-progress', label: t.controls.inProgress, icon: Timer },
        { value: 'done', label: t.controls.done, icon: CheckCircle2 },
    ];

    const groupOptions = [
        { value: 'none', label: t.controls.none, icon: StretchHorizontal },
        { value: 'status', label: t.controls.byStatus, icon: LayoutGrid },
    ];

    return (
        <div className="flex flex-col sm:flex-row items-end gap-4 bg-[var(--card)] p-4 rounded-2xl border border-[var(--border)] shadow-sm">
            <Dropdown
                label={t.controls.filterBy}
                options={filterOptions}
                value={filter}
                onChange={setFilter}
                placeholder={t.controls.allTasks}
            />
            <Dropdown
                label={t.controls.groupBy}
                options={groupOptions}
                value={groupBy}
                onChange={setGroupBy}
                placeholder={t.controls.none}
            />
        </div>
    );
};

export { TaskControls };
