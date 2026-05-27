"use client";

import { SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function Page() {
    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#020617] px-4 py-12 sm:px-6 lg:px-8">

            {/* Glowing background orbs */}
            <div className="absolute left-1/4 top-1/4 h-[350px] w-[350px] rounded-full bg-indigo-600/10 blur-[100px]" />
            <div className="absolute right-1/4 bottom-1/4 h-[350px] w-[350px] rounded-full bg-cyan-500/10 blur-[100px]" />

            {/* Subtle grid pattern overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black_100%)]" />

            <div className="relative z-10 flex flex-col items-center">
                {/* Back to Home Link */}
                <Link
                    href="/"
                    className="mb-8 flex items-center gap-2 text-sm font-medium text-slate-400 transition-colors hover:text-white"
                >
                    <ArrowLeft size={16} />
                    Back to Home
                </Link>

                {/* Brand Logo */}
                <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                        <Sparkles size={18} className="text-white" />
                    </div>
                    <span className="text-2xl font-extrabold tracking-tight text-white">
                        Hiremind<span className="text-cyan-400">AI</span>
                    </span>
                </div>

                <SignUp
                    forceRedirectUrl="/dashboard"
                    appearance={{
                        baseTheme: dark,
                        variables: {
                            colorPrimary: "#22d3ee", // cyan-400
                            colorBackground: "#090d16",
                            colorForeground: "#ffffff", // replaces colorText in Clerk v5
                            colorMutedForeground: "#cbd5e1", // replaces colorTextSecondary in Clerk v5
                            colorInputBackground: "#131927",
                            colorInputText: "#ffffff",
                            colorBorder: "rgba(255, 255, 255, 0.15)", // slightly brighter border for outline visibility
                        },
                        elements: {
                            card: "border border-white/10 bg-[#090d16]/80 backdrop-blur-xl shadow-2xl rounded-2xl w-full max-w-[400px]",
                            headerTitle: "clerk-header-title text-2xl tracking-tight",
                            headerSubtitle: "clerk-header-subtitle",
                            socialButtonsBlockButton: "border border-white/10 bg-white/5 hover:bg-white/10 transition-all rounded-xl py-2.5",
                            socialButtonsBlockButtonText: "clerk-social-button-text",
                            dividerLine: "bg-white/10",
                            dividerText: "clerk-divider-text",
                            formButtonPrimary: "bg-gradient-to-r from-indigo-500 to-cyan-400 hover:from-indigo-600 hover:to-cyan-500 text-slate-950 font-extrabold transition-all shadow-[0_0_20px_rgba(34,211,238,0.25)] hover:shadow-[0_0_25px_rgba(34,211,238,0.4)] border-0 py-2.5 rounded-xl",
                            footerActionText: "clerk-footer-text",
                            footerActionLink: "text-cyan-400 hover:text-cyan-300 font-extrabold transition-colors",
                            formFieldInput: "bg-white/5 border border-white/10 text-white rounded-xl py-2.5 focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50 transition-all",
                            formFieldLabel: "clerk-label text-sm",
                            formFieldHintText: "text-slate-400",
                            formFieldInfoText: "text-slate-400",
                            formFieldInputShowPasswordButton: "text-slate-400 hover:text-slate-200 transition-colors",
                            identityPreviewText: "text-white font-semibold",
                            identityPreviewEditButton: "text-cyan-400 hover:text-cyan-300",
                        }
                    }}
                />
            </div>
        </div>
    );
}