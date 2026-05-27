"use client";

import { Sparkles } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="fixed left-0 right-0 top-0 z-50 flex h-[80px] w-full items-center justify-between border-b border-white/5 bg-[#020617]/70 px-6 backdrop-blur-xl md:px-12">
            {/* Logo */}
            <div className="flex cursor-pointer items-center gap-3 transition-transform hover:scale-105">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.4)]">
                    <Sparkles size={18} className="text-white" />
                </div>
                <h1 className="text-2xl font-extrabold tracking-tight text-white">
                    Hiremind<span className="text-cyan-400">AI</span>
                </h1>
            </div>

            {/* Desktop Links */}
            <div className="hidden items-center gap-10 md:flex">
                <a href="#" className="text-sm font-semibold text-slate-300 transition-colors hover:text-cyan-400">Home</a>
                <a href="#" className="text-sm font-semibold text-slate-300 transition-colors hover:text-cyan-400">About</a>
                <a href="#" className="text-sm font-semibold text-slate-300 transition-colors hover:text-cyan-400">Contact</a>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center gap-6">
                <Link href="/sign-in" className="hidden text-sm font-semibold text-slate-300 transition-colors hover:text-white sm:block">
                    Sign In
                </Link>
                <Link href="/sign-up" className="rounded-full bg-white px-6 py-2.5 text-sm font-bold text-slate-900 shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-all hover:scale-105 hover:bg-slate-200 active:scale-95">
                    Get Started
                </Link>
            </div>
        </nav>
    );
}