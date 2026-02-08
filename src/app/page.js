"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguageStore } from '@/presentation/store/useLanguageStore';

export default function Home() {
  const router = useRouter();
  const { t } = useLanguageStore();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.replace('/dashboard');
    } else {
      router.replace('/login');
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--background)]">
      <div className="animate-pulse text-[var(--primary)] font-bold tracking-widest uppercase text-sm">
        {t.common.redirecting}
      </div>
    </div>
  );
}
