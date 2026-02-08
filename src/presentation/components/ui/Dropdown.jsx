import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

const Dropdown = ({
    label,
    options,
    value,
    onChange,
    placeholder = 'Select option',
    className
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const selectedOption = options.find(opt => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className={cn("relative inline-block text-left w-full sm:w-auto", className)} ref={dropdownRef}>
            <div className="flex flex-col gap-1.5">
                {label && (
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1">
                        {label}
                    </span>
                )}
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={cn(
                        "inline-flex items-center justify-between w-full rounded-xl border-none bg-[var(--input-background)] px-4 py-2.5 text-sm font-medium text-[var(--input-foreground)] hover:cursor-pointer hover:bg-[var(--secondary)] hover:text-slate-950 dark:hover:bg-[var(--primary)] dark:hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:ring-offset-2 focus:ring-offset-[var(--background)]",
                        isOpen && "ring-2 ring-[var(--ring)]"
                    )}
                >
                    <div className="flex items-center gap-2">
                        {selectedOption?.icon && <selectedOption.icon className="h-4 w-4" />}
                        <span>{selectedOption ? selectedOption.label : placeholder}</span>
                    </div>
                    <ChevronDown className={cn("ml-2 h-4 w-4 transition-transform duration-300", isOpen && "rotate-180")} />
                </button>
            </div>

            {isOpen && (
                <div className="absolute right-0 z-50 mt-2 w-full origin-top-right rounded-xl bg-[var(--card)] shadow-2xl border-none ring-1 ring-black ring-opacity-5 focus:outline-none animate-dropdown overflow-hidden">
                    <div className="py-1">
                        {options.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                                className={cn(
                                    "flex items-center gap-3 w-full px-4 py-3 text-sm transition-colors duration-200 hover:cursor-pointer hover:bg-[var(--secondary)] hover:text-slate-950 dark:hover:bg-[var(--primary)] dark:hover:text-white",
                                    value === option.value ? "bg-[var(--secondary)]/20 dark:bg-[var(--primary)]/20 font-bold text-[var(--foreground)]" : "text-[var(--card-foreground)]"
                                )}
                            >
                                {option.icon && <option.icon className={cn("h-4 w-4", value === option.value ? "text-[var(--primary)]" : "text-slate-400")} />}
                                <span>{option.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export { Dropdown };
