'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showRepeat, setShowRepeat] = useState(false);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [repeat, setRepeat] = useState('');

    const { register, loading } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (
            !email ||
            !password ||
            !firstName ||
            !lastName ||
            !phone
        ) {
            toast.error('Please fill in all fields');
            return;
        }

        if (password !== repeat) {
            toast.error('Passwords do not match');
            return;
        }

        try {
            await register({
                email,
                password,
                first_name: firstName,
                last_name: lastName,
                phone,
            });

            toast.success('Account created! Welcome.')
            router.push('/')
            router.refresh();
        } catch (err: any) {
            toast.error(err.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex flex-col lg:flex-row">
            {/* LEFT — Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-between px-6 sm:px-12 lg:px-16 py-8 lg:py-12 bg-white min-h-[100vh]">
                {/* Logo */}
                <Link
                    href="/"
                    className="text-[22px] font-bold tracking-tight text-black mb-8 lg:mb-0"
                >
                    Flatlogic<span className="text-[#c97a4a]">.</span>
                </Link>

                {/* Form */}
                <div className="w-full max-w-[480px] mx-auto lg:mx-0 py-8 lg:py-0">
                    <h1 className="text-[20px] lg:text-[22px] font-bold text-[#222] mb-6 lg:mb-10 text-center lg:text-left">
                        Sign Up
                    </h1>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-[14px] font-bold text-[#333]">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="First Name"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    disabled={loading}
                                    className="h-[52px] border border-[#d5d5d5] px-4 text-[15px] text-[#333] placeholder:text-[#bbb] outline-none focus:border-[#c97a4a] transition disabled:opacity-50"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-[14px] font-bold text-[#333]">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="Last Name"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    disabled={loading}
                                    className="h-[52px] border border-[#d5d5d5] px-4 text-[15px] text-[#333] placeholder:text-[#bbb] outline-none focus:border-[#c97a4a] transition disabled:opacity-50"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-[14px] font-bold text-[#333]">
                                Email
                            </label>
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                                className="h-[52px] border border-[#d5d5d5] px-4 text-[15px] text-[#333] placeholder:text-[#bbb] outline-none focus:border-[#c97a4a] transition disabled:opacity-50"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-[14px] font-bold text-[#333]">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                placeholder="Phone Number"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                disabled={loading}
                                className="h-[52px] border border-[#d5d5d5] px-4 text-[15px] text-[#333] placeholder:text-[#bbb] outline-none focus:border-[#c97a4a] transition disabled:opacity-50"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-[14px] font-bold text-[#333]">
                                Password
                            </label>

                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={loading}
                                    className="w-full h-[52px] border border-[#d5d5d5] px-4 pr-12 text-[15px] text-[#333] placeholder:text-[#bbb] outline-none focus:border-[#c97a4a] transition disabled:opacity-50"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword((prev) => !prev)
                                    }
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#999] hover:text-[#555] transition"
                                >
                                    {showPassword ? (
                                        <Eye size={18} />
                                    ) : (
                                        <EyeOff size={18} />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-[14px] font-bold text-[#333]">
                                Repeat Password
                            </label>

                            <div className="relative">
                                <input
                                    type={showRepeat ? 'text' : 'password'}
                                    placeholder="Repeat Password"
                                    value={repeat}
                                    onChange={(e) => setRepeat(e.target.value)}
                                    disabled={loading}
                                    className="w-full h-[52px] border border-[#d5d5d5] px-4 pr-12 text-[15px] text-[#333] placeholder:text-[#bbb] outline-none focus:border-[#c97a4a] transition disabled:opacity-50"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowRepeat((prev) => !prev)
                                    }
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#999] hover:text-[#555] transition"
                                >
                                    {showRepeat ? (
                                        <Eye size={18} />
                                    ) : (
                                        <EyeOff size={18} />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
                            <Link
                                href="/login"
                                className="text-[14px] text-[#c97a4a] hover:underline order-2 sm:order-1"
                            >
                                Log In to your account
                            </Link>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full sm:w-[180px] h-[52px] bg-[#c97a4a] text-white text-[14px] font-bold tracking-widest hover:opacity-90 transition order-1 sm:order-2 disabled:opacity-50"
                            >
                                {loading ? 'SIGNING UP...' : 'SIGN UP'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="flex gap-10">
                    <Link
                        href="/"
                        className="text-[13px] text-[#c97a4a] hover:text-[#999] transition"
                    >
                        Terms & Conditions
                    </Link>

                    <Link
                        href="/"
                        className="text-[13px] text-[#c97a4a] hover:text-[#999] transition"
                    >
                        Privacy Policy
                    </Link>

                    <Link
                        href="/"
                        className="text-[13px] text-[#c97a4a] hover:text-[#999] transition"
                    >
                        Help
                    </Link>
                </div>
            </div>

            {/* RIGHT — Image */}
            <div className="relative w-full lg:w-1/2 h-[300px] lg:h-auto">
                <Image
                    src="/images/blog/image4.png"
                    alt="Register"
                    fill
                    className="object-cover"
                    priority
                />
            </div>
        </div>
    );
}