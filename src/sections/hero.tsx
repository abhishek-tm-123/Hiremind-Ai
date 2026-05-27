"use client";

import { motion } from "framer-motion";
import { Mic, CheckCircle, AlertTriangle, Activity, Sparkles, Play } from "lucide-react";
import Link from "next/link";
const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (custom: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: custom * 0.1, duration: 0.8, ease: "easeOut" as const },
    }),
};

const float = {
    animate: (custom: number) => ({
        y: [0, -15, 0],
        transition: {
            duration: 5 + custom,
            repeat: Infinity,
            ease: "easeInOut" as const,
            delay: custom * 0.5,
        },
    }),
};

export default function Hero() {
    return (
        <section className="relative min-h-screen w-full overflow-hidden bg-[#020617] font-sans selection:bg-cyan-500/30 flex items-center">
            {/* Background Elements */}
            <div className="absolute -left-[20%] top-[-10%] h-[800px] w-[800px] rounded-full bg-blue-600/10 blur-[150px] pointer-events-none" />
            <div className="absolute -right-[20%] bottom-[-10%] h-[800px] w-[800px] rounded-full bg-cyan-600/10 blur-[150px] pointer-events-none" />
            <div className="absolute left-1/2 top-1/2 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />

            <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:flex lg:items-center lg:px-8 lg:py-40">

                {/* LEFT COLUMN */}
                <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0 z-10">
                    <motion.div custom={1} initial="hidden" animate="visible" variants={fadeUp} className="flex items-center gap-2">
                        <div className="flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-sm font-medium text-cyan-300 backdrop-blur-sm">
                            <Sparkles size={14} className="text-cyan-400" />
                            <span>AI-Powered Mock Interview Platform</span>
                        </div>
                    </motion.div>

                    <motion.h1
                        custom={2} initial="hidden" animate="visible" variants={fadeUp}
                        className="mt-8 text-5xl font-extrabold tracking-tight text-white sm:text-7xl"
                    >
                        Master Your Interviews with <br />
                        <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent pb-2 block">
                            AI-Powered Practice
                        </span>
                    </motion.h1>

                    <motion.p
                        custom={3} initial="hidden" animate="visible" variants={fadeUp}
                        className="mt-6 text-lg leading-8 text-slate-400 max-w-lg"
                    >
                        Users can practice mock interviews, receive instant AI feedback, and improve communication and technical skills. Get hired faster with tailored feedback.
                    </motion.p>

                    <motion.div
                        custom={4} initial="hidden" animate="visible" variants={fadeUp}
                        className="mt-10 flex flex-wrap items-center gap-6"
                    >
                        <Link
                            href="/interview"
                            className="group relative flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-bold text-slate-900 transition-all hover:bg-slate-200 hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.2)]"
                        >
                            Start Interview
                            <Play
                                size={16}
                                className="transition-transform group-hover:translate-x-1"
                                fill="currentColor"
                            />
                        </Link>

                        <button className="text-sm font-semibold leading-6 text-white transition-colors hover:text-cyan-300">
                            Learn More <span aria-hidden="true" className="ml-1">→</span>
                        </button>
                    </motion.div>

                    <motion.div
                        custom={5} initial="hidden" animate="visible" variants={fadeUp}
                        className="mt-16 flex items-center gap-x-10 border-t border-white/10 pt-10 sm:gap-x-14"
                    >
                        <div>
                            <div className="text-3xl font-bold tracking-tight text-white">10K+</div>
                            <div className="mt-1 text-sm font-medium text-slate-400">Mock Interviews</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold tracking-tight text-white">95%</div>
                            <div className="mt-1 text-sm font-medium text-slate-400">Positive Feedback</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold tracking-tight text-white">24/7</div>
                            <div className="mt-1 text-sm font-medium text-slate-400">AI Availability</div>
                        </div>
                    </motion.div>
                </div>

                {/* RIGHT COLUMN - Floating AI Interface */}
                <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mt-0 lg:mr-0 lg:max-w-none lg:flex-none xl:ml-32 z-10 hidden md:block">
                    <div className="relative w-[340px] sm:w-[500px] h-[600px]">

                        {/* Main Glow Behind Cards */}
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full bg-cyan-500/20 blur-[100px]" />

                        {/* Pulsing Live Indicator */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 1, duration: 0.5 }}
                            className="absolute left-1/2 top-0 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-[#0B1221]/80 px-4 py-2 shadow-2xl backdrop-blur-xl"
                        >
                            <motion.div
                                animate={{ opacity: [1, 0.4, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                className="h-2 w-2 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)]"
                            />
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                                AI Analyzing Response...
                            </span>
                        </motion.div>

                        {/* 1. AI Question Bubble */}
                        <motion.div
                            custom={1} variants={float} animate="animate"
                            className="absolute left-0 top-16 z-10 w-[280px] sm:w-[320px] rounded-2xl border border-white/10 bg-[#0F172A]/90 p-5 shadow-2xl backdrop-blur-xl xl:-left-12"
                        >
                            <div className="mb-4 flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 shadow-lg">
                                    <Sparkles size={18} className="text-white" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-white">InterviewIQ Agent</h4>
                                    <p className="text-xs text-slate-400">Asking Question</p>
                                </div>
                            </div>
                            <div className="rounded-xl bg-white/5 p-4 border border-white/5">
                                <p className="text-sm leading-relaxed text-slate-200">
                                    "Explain the difference between SSR and CSR in React."
                                </p>
                            </div>
                        </motion.div>

                        {/* 2. Microphone / Listening */}
                        <motion.div
                            custom={2} variants={float} animate="animate"
                            className="absolute right-0 top-56 z-20 flex items-center gap-4 rounded-2xl border border-blue-500/30 bg-[#0F172A]/90 px-6 py-4 shadow-2xl backdrop-blur-xl xl:-right-12"
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/20">
                                <Mic size={20} className="text-blue-400" />
                            </div>
                            <div>
                                <span className="block text-sm font-bold text-white">Listening...</span>
                                <div className="mt-1 flex items-center gap-1 h-3">
                                    <motion.div animate={{ height: ["30%", "100%", "30%"] }} transition={{ duration: 0.8, repeat: Infinity }} className="w-1.5 rounded-full bg-blue-400" />
                                    <motion.div animate={{ height: ["60%", "100%", "60%"] }} transition={{ duration: 0.8, repeat: Infinity, delay: 0.15 }} className="w-1.5 rounded-full bg-blue-400" />
                                    <motion.div animate={{ height: ["40%", "80%", "40%"] }} transition={{ duration: 0.8, repeat: Infinity, delay: 0.3 }} className="w-1.5 rounded-full bg-blue-400" />
                                    <motion.div animate={{ height: ["80%", "100%", "80%"] }} transition={{ duration: 0.8, repeat: Infinity, delay: 0.45 }} className="w-1.5 rounded-full bg-blue-400" />
                                    <motion.div animate={{ height: ["50%", "90%", "50%"] }} transition={{ duration: 0.8, repeat: Infinity, delay: 0.6 }} className="w-1.5 rounded-full bg-blue-400" />
                                </div>
                            </div>
                        </motion.div>

                        {/* 3. Confidence Score */}
                        <motion.div
                            custom={0} variants={float} animate="animate"
                            className="absolute bottom-40 left-4 z-10 flex w-[180px] flex-col items-center justify-center rounded-3xl border border-cyan-500/20 bg-[#0F172A]/90 p-6 shadow-2xl backdrop-blur-xl xl:-left-8"
                        >
                            <Activity size={24} className="mb-3 text-cyan-400" />
                            <div className="text-5xl font-black tracking-tighter text-white">
                                92<span className="text-2xl text-cyan-400">%</span>
                            </div>
                            <span className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-400">Confidence</span>
                        </motion.div>

                        {/* 4. AI Feedback Card */}
                        <motion.div
                            custom={1.5} variants={float} animate="animate"
                            className="absolute bottom-10 right-4 z-20 w-[280px] sm:w-[320px] rounded-2xl border border-white/10 bg-[#0F172A]/90 p-5 shadow-2xl backdrop-blur-xl xl:-right-8"
                        >
                            <div className="mb-4 flex items-center justify-between">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Live AI Feedback</h4>
                                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10">
                                    <Sparkles size={10} className="text-slate-300" />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3 rounded-lg bg-green-500/10 p-3 border border-green-500/20">
                                    <CheckCircle size={16} className="mt-0.5 shrink-0 text-green-400" />
                                    <p className="text-sm font-medium text-green-100">Strong technical explanation.</p>
                                </div>
                                <div className="flex items-start gap-3 rounded-lg bg-amber-500/10 p-3 border border-amber-500/20">
                                    <AlertTriangle size={16} className="mt-0.5 shrink-0 text-amber-400" />
                                    <p className="text-sm font-medium text-amber-100">Add more real-world examples.</p>
                                </div>
                            </div>
                        </motion.div>

                    </div>
                </div>

            </div>
        </section>
    );
}