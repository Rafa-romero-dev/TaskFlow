"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/presentation/components/ui/Button';
import { Input } from '@/presentation/components/ui/Input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/presentation/components/ui/Card';

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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
            <Card className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
                        Welcome Back
                    </CardTitle>
                    <CardDescription className="text-center text-slate-300">
                        Enter your credentials to access your mission control.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-200" htmlFor="email">Email</label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Ex: commander@base.com"
                                {...register('email')}
                                className="bg-slate-950/50 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-indigo-500"
                            />
                            {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-200" htmlFor="password">Password</label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Secret code"
                                {...register('password')}
                                className="bg-slate-950/50 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-indigo-500"
                            />
                            {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}
                        </div>

                        {error && (
                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3 shadow-lg shadow-indigo-500/20"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Authenticating...' : 'Start Mission'}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="justify-center">
                    <p className="text-xs text-slate-500">
                        Secure System v1.0
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
