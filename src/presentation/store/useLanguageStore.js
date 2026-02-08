import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import en from '@/dictionaries/en.json';
import es from '@/dictionaries/es.json';

const dictionaries = { en, es };

export const useLanguageStore = create(
    persist(
        (set) => ({
            language: 'en',
            t: dictionaries.en,
            setLanguage: (lang) => set({
                language: lang,
                t: dictionaries[lang] || dictionaries.en
            }),
        }),
        {
            name: 'language-storage',
            partialize: (state) => ({ language: state.language }),
            // Rehydrate `t` after merging persisted language
            onRehydrateStorage: (state) => {
                return (state, error) => {
                    if (!error && state) {
                        state.setLanguage(state.language);
                    }
                };
            },
        }
    )
);
