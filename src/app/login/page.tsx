'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import Image from "next/image";
import { useAuth } from '@/lib/auth/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';

function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, loading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get("redirectTo") || "/";

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error("Please fill in all fields");
            return;
        }
        try {
            await login(email, password);
            toast.success("Logged in successfully");
            router.push(redirectTo);
            router.refresh();
        } catch (err: any) {
            toast.error(err.message || "Login failed");
        }
    };

    return (
        <div className="min-h-screen flex flex-col lg:flex-row">

            {/* LEFT — Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-between px-6 sm:px-12 lg:px-16 py-8 lg:py-12 bg-white min-h-[100vh]">

                {/* Logo */}
                <Link href="/" className="text-[22px] font-bold tracking-tight text-black mb-8 lg:mb-0">
                    Flatlogic<span className="text-[#c97a4a]">.</span>
                </Link>

                {/* Form */}
                <div className="w-full max-w-[480px] mx-auto lg:mx-0 py-8 lg:py-0">
                    <h1 className="text-[24px] lg:text-[28px] font-bold text-[#222] mb-2 text-center lg:text-left">
                        Login
                    </h1>

                    {/* Context banner when coming from checkout */}
                    {redirectTo === "/billing" && (
                        <div className="mb-6 mt-3 px-4 py-3 bg-[#FAECE7] border border-[#F5C4B3] rounded text-sm text-[#993C1D]">
                            Please log in to continue to checkout.
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="flex flex-col gap-6 mt-6">

                        <div className="flex flex-col gap-2">
                            <label className="text-[14px] font-bold text-[#333]">Email</label>
                            <input
                                type="email"
                                placeholder="admin@flatlogic.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                                className="h-[52px] border border-[#d5d5d5] px-4 text-[15px] text-[#333] placeholder:text-[#bbb] outline-none focus:border-[#c97a4a] transition disabled:opacity-50"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-[14px] font-bold text-[#333]">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="········"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={loading}
                                    className="w-full h-[52px] border border-[#d5d5d5] px-4 pr-12 text-[15px] text-[#333] placeholder:text-[#bbb] outline-none focus:border-[#c97a4a] transition disabled:opacity-50"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((p) => !p)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#999] hover:text-[#555] transition"
                                >
                                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
                            <div className="flex flex-col gap-1 order-2 sm:order-1">
                                <Link
                                    href={redirectTo !== "/" ? `/register?redirectTo=${redirectTo}` : "/register"}
                                    className="text-[14px] text-[#c97a4a] hover:underline"
                                >
                                    Create an account
                                </Link>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full sm:w-[180px] h-[52px] bg-[#c97a4a] text-white text-[14px] font-bold tracking-widest hover:opacity-90 transition order-1 sm:order-2 disabled:opacity-50"
                            >
                                {loading ? "LOGGING IN..." : "LOGIN"}
                            </button>
                        </div>

                    </form>
                </div>

                {/* Footer links */}
                <div className="flex gap-10 mt-10">
                    <Link href="/" className="text-[13px] text-[#c97a4a] hover:text-[#999] transition">
                        Terms & Conditions
                    </Link>
                    <Link href="/" className="text-[13px] text-[#c97a4a] hover:text-[#999] transition">
                        Privacy Policy
                    </Link>
                    <Link href="/" className="text-[13px] text-[#c97a4a] hover:text-[#999] transition">
                        Forgot password
                    </Link>
                </div>
            </div>

            {/* RIGHT — Image */}
            <div className="relative w-full lg:w-1/2 h-[300px] lg:h-auto">
                <Image
                    src="/images/blog/image1.png"
                    alt="Login"
                    fill
                    className="object-cover"
                    priority
                />
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-[#c97a4a] border-t-transparent rounded-full animate-spin" />
            </div>
        }>
            <LoginForm />
        </Suspense>
    );
}