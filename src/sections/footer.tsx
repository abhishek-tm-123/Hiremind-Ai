"use client";

import { Sparkles, Mail } from "lucide-react";

// Custom, high-fidelity SVG brand icons matching Lucide's 2px stroke, round cap/join aesthetic.
const Github = ({ size = 20, className }: { size?: number; className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
        <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
);

const Linkedin = ({ size = 20, className }: { size?: number; className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect width="4" height="12" x="2" y="9" />
        <circle cx="4" cy="4" r="2" />
    </svg>
);

const Twitter = ({ size = 20, className }: { size?: number; className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
);

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-white/5 bg-[#020617] text-slate-400">
            <div className="mx-auto max-w-7xl px-6 py-12 md:px-12 lg:py-16">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
                    
                    {/* Brand Section */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                                <Sparkles size={18} className="text-white" />
                            </div>
                            <span className="text-2xl font-extrabold tracking-tight text-white">
                                Hiremind<span className="text-cyan-400">AI</span>
                            </span>
                        </div>
                        <p className="text-sm leading-6 max-w-sm">
                            Supercharge your interview prep with AI-powered simulations, 
                            real-time analytics, and personalized feedback. Land your dream job, faster.
                        </p>
                        
                        {/* Social Links */}
                        <div className="flex items-center gap-4">
                            <a
                                href="#"
                                aria-label="GitHub"
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/5 bg-white/5 text-slate-400 transition-all hover:border-cyan-400/30 hover:bg-cyan-400/10 hover:text-cyan-400"
                            >
                                <Github size={18} />
                            </a>
                            <a
                                href="#"
                                aria-label="LinkedIn"
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/5 bg-white/5 text-slate-400 transition-all hover:border-cyan-400/30 hover:bg-cyan-400/10 hover:text-cyan-400"
                            >
                                <Linkedin size={18} />
                            </a>
                            <a
                                href="#"
                                aria-label="Twitter"
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/5 bg-white/5 text-slate-400 transition-all hover:border-cyan-400/30 hover:bg-cyan-400/10 hover:text-cyan-400"
                            >
                                <Twitter size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Platform Links */}
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Platform</h3>
                        <ul className="mt-4 space-y-3 text-sm">
                            <li>
                                <a href="#" className="hover:text-cyan-400 transition-colors">Mock Interviews</a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-cyan-400 transition-colors">AI Feedback</a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-cyan-400 transition-colors">Dashboard</a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-cyan-400 transition-colors">Pricing</a>
                            </li>
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Company</h3>
                        <ul className="mt-4 space-y-3 text-sm">
                            <li>
                                <a href="#" className="hover:text-cyan-400 transition-colors">About Us</a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-cyan-400 transition-colors">Careers</a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-cyan-400 transition-colors">Contact</a>
                            </li>
                            <li>
                                <a href="mailto:support@hiremind.ai" className="flex items-center gap-2 hover:text-cyan-400 transition-colors">
                                    <Mail size={14} />
                                    Support
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Legal</h3>
                        <ul className="mt-4 space-y-3 text-sm">
                            <li>
                                <a href="#" className="hover:text-cyan-400 transition-colors">Privacy Policy</a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-cyan-400 transition-colors">Terms of Service</a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-cyan-400 transition-colors">Cookie Settings</a>
                            </li>
                        </ul>
                    </div>

                </div>

                {/* Bottom Section */}
                <div className="mt-12 border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-slate-500">
                        &copy; {currentYear} HiremindAI. All rights reserved.
                    </p>
                    <p className="text-xs text-slate-500">
                        Designed &amp; Developed with precision.
                    </p>
                </div>
            </div>
        </footer>
    );
}