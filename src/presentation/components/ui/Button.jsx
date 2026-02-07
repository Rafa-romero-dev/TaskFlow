import { cn } from '@/lib/utils';
import React from 'react';

const Button = React.forwardRef(({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const variants = {
        primary: 'bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90 shadow-lg hover:shadow-xl',
        secondary: 'bg-[var(--secondary)] text-[var(--secondary-foreground)] hover:opacity-90',
        outline: 'border-2 border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--primary)] hover:text-[var(--primary-foreground)]',
        ghost: 'hover:bg-[var(--secondary)] hover:text-[var(--secondary-foreground)] text-[var(--foreground)]',
        danger: 'bg-red-500 text-white hover:bg-red-600 shadow-md',
    };

    const sizes = {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 py-2',
        lg: 'h-12 px-6 text-lg',
        icon: 'h-10 w-10 p-2 flex items-center justify-center',
    };

    return (
        <button
            ref={ref}
            className={cn(
                'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:pointer-events-none active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500',
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        />
    );
});

Button.displayName = 'Button';

export { Button };
