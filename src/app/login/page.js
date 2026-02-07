"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/presentation/components/ui/Button';
import { Input } from '@/presentation/components/ui/Input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/presentation/components/ui/Card';
import { ModeToggle } from '@/presentation/components/ui/ModeToggle';
import { cn } from '@/lib/utils';
import { MoveRightIcon } from 'lucide-react';

const schema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Invalid credentials');
            }

            const result = await response.json();
            localStorage.setItem('token', result.token); // Simple token storage
            router.push('/dashboard');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-pattern-grid min-h-screen flex items-center justify-center p-4 bg-[var(--background)] transition-colors duration-500">
            <div className="absolute top-4 right-4">
                <ModeToggle />
            </div>
            <Card className="w-full max-w-md shadow-2xl bg-[var(--card)] border-[var(--border)] animate-slide-up">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold text-center bg-clip-text bg-gradient-to-r">
                        Welcome Back
                    </CardTitle>
                    <CardDescription className="text-center opacity-70">
                        Enter your credentials to access your mission control.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-stone-950 dark:text-stone-100" htmlFor="email">Email</label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Ex: commander@base.com"
                                {...register('email')}
                                className={cn(errors.email && "border-red-500 focus-visible:ring-red-500")}
                            />
                            {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-stone-950 dark:text-stone-100" htmlFor="password">Password</label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Secret code"
                                {...register('password')}
                                className={cn(errors.password && "border-red-500 focus-visible:ring-red-500")}
                            />
                            {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
                        </div>

                        {error && (
                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className={cn(
                                "group relative inline-flex h-12 w-full items-center justify-center overflow-hidden rounded-md bg-neutral-950 dark:bg-[var(--border)] px-6 font-medium text-neutral-200 transition-all hover:bg-[var(--secondary)] hover:text-neutral-950 dark:hover:bg-[var(--background)] dark:hover:text-[var(--foreground)] disabled:opacity-50",
                                isLoading && "cursor-not-allowed opacity-70"
                            )}>
                            <span className="mr-2">{isLoading ? 'Authenticating...' : 'Login'}</span>
                            <div className="w-0 translate-x-[100%] pl-0 opacity-0 transition-all duration-200 group-hover:w-5 group-hover:translate-x-0 group-hover:pl-1 group-hover:opacity-100">
                                <MoveRightIcon className="h-5 w-5" />
                            </div>
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="justify-center">
                    <p className="text-xs text-slate-900 dark:text-slate-200 opacity-50">
                        Secure System v1.0
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
