"use client";

import React from 'react';
import { useLanguageStore } from '@/presentation/store/useLanguageStore';
import { Button } from '@/presentation/components/ui/Button';
import { Languages } from 'lucide-react';

export function LanguageToggle() {
    const { language, setLanguage } = useLanguageStore();

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'es' : 'en');
    };

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="flex items-center gap-2 font-bold transition-all hover:bg-[var(--secondary)] dark:hover:bg-[var(--primary)] px-3 rounded-xl group"
            title={language === 'en' ? 'Switch to Spanish' : 'Cambiar a Inglés'}
        >
            <Languages className="h-[1.2rem] w-[1.2rem] text-[var(--primary)] transition-colors duration-300 group-hover:text-black" />
            <span className="uppercase text-[10px] tracking-widest transition-colors duration-300 group-hover:text-black">{language}</span>
        </Button>
    );
}
