import '@testing-library/jest-dom';
import en from '@/dictionaries/en.json';

// Global mock for useLanguageStore
jest.mock('@/presentation/store/useLanguageStore', () => ({
    useLanguageStore: () => ({
        t: en,
        language: 'en',
        setLanguage: jest.fn(),
    }),
}));
