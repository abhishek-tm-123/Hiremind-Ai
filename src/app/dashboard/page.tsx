"use client"

import React, { useEffect, useState } from "react";
import { UserButton, useUser, SignOutButton } from "@clerk/nextjs";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Sparkles, Award, Clock, ArrowRight, BrainCircuit,
  BarChart3, MessageSquare, Compass, ShieldCheck,
  Plus, History, TrendingUp, Calendar, ArrowLeft
} from "lucide-react";

interface DbSession {
  id: string;
  role: string;
  resumeName: string;
  matchPercentage: number;
  difficulty: string;
  createdAt: string;
  matchAnalysis: any;
  metadata: any;
  questions: any[];
  answers: Record<string, string>;
  evaluations: any[];
  finalReport: any | null;
}

export default function Dashboard() {
  const { user } = useUser();
  const [sessions, setSessions] = useState<DbSession[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);

  useEffect(() => {
    fetch("/api/interviews")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setSessions(data);
      })
      .catch(console.error)
      .finally(() => setIsLoadingSessions(false));
  }, []);

  // Compute real metrics from sessions
  const totalInterviews = sessions.length;
  const avgScore = totalInterviews > 0
    ? Math.round(sessions.reduce((sum, s) => sum + (s.finalReport?.overallScore || s.matchPercentage || 0), 0) / totalInterviews)
    : 0;
  const avgTechnical = totalInterviews > 0
    ? Math.round(sessions.reduce((sum, s) => sum + (s.finalReport?.technicalScore || 0), 0) / totalInterviews)
    : 0;
  const avgCommunication = totalInterviews > 0
    ? Math.round(sessions.reduce((sum, s) => sum + (s.finalReport?.communicationScore || 0), 0) / totalInterviews)
    : 0;

  // Build recent activities from real sessions
  const recentActivities = sessions.slice(0, 3).map((s, i) => ({
    id: i + 1,
    type: "complete" as const,
    text: `Completed ${s.role} mock interview`,
    time: new Date(s.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    detail: s.finalReport
      ? `Scored ${s.finalReport.overallScore}% overall`
      : `Match: ${s.matchPercentage}%`
  }));

  if (!user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#020617] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-400 border-t-transparent" />
          <p className="text-slate-400 font-medium">Loading credentials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#020617] text-white font-sans selection:bg-cyan-500/30 selection:text-cyan-200">

      {/* Background Gradients */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-15%] h-[60vw] w-[60vw] rounded-full bg-indigo-500/5 blur-[150px] animate-pulse" style={{ animationDuration: '10s' }} />
        <div className="absolute bottom-[-15%] right-[-10%] h-[50vw] w-[50vw] rounded-full bg-cyan-500/5 blur-[150px] animate-pulse" style={{ animationDuration: '15s' }} />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      {/* TOP HEADER NAVBAR */}
      <header className="relative z-10 border-b border-white/5 bg-[#020617]/50 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 shadow-[0_0_15px_rgba(99,102,241,0.25)] transition-all group-hover:scale-105">
                <BrainCircuit className="h-5 w-5 text-[#020617]" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                Hiremind<span className="text-cyan-400">AI</span>
              </span>
            </Link>

            <nav className="hidden items-center gap-6 sm:flex">
              <Link href="/dashboard" className="text-sm font-semibold text-cyan-400">Dashboard</Link>
              <Link href="/interview/setup" className="text-sm font-semibold text-slate-400 hover:text-white transition-colors">Start Interview</Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="rounded-full border border-white/10 p-0.5 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
              <UserButton />
            </div>

            <SignOutButton>
              <button className="flex items-center justify-center rounded-lg border border-white/5 bg-white/5 p-2 text-slate-400 hover:bg-white/10 hover:text-white transition-all cursor-pointer">
                <ArrowLeft className="h-4 w-4" />
              </button>
            </SignOutButton>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="relative z-10 mx-auto max-w-7xl px-6 py-10 flex flex-col gap-10">

        {/* Welcome Section */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-cyan-400 text-sm font-semibold uppercase tracking-wider"
            >
              <Sparkles size={16} />
              <span>Workspace Dashboard</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="text-3xl font-extrabold tracking-tight text-white md:text-4xl"
            >
              Welcome back, {user.firstName || "Abhishek"}
            </motion.h2>
            <p className="text-slate-400 text-sm">
              Your interview analytics, past scores, and custom job description matching system.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Link
              href="/interview/setup"
              className="group flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-400 hover:from-indigo-600 hover:to-cyan-500 px-6 py-3.5 text-sm font-extrabold text-[#020617] shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/25 transition-all select-none cursor-pointer"
            >
              <Plus className="h-4.5 w-4.5" /> Start New Interview
            </Link>
          </motion.div>
        </div>

        {/* METRICS ROW */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Interviews Completed", val: totalInterviews > 0 ? String(totalInterviews) : "0", desc: totalInterviews > 0 ? `Latest: ${sessions[0]?.role || "N/A"}` : "Start your first interview", icon: ShieldCheck, color: "text-cyan-400", border: "border-cyan-500/20" },
            { label: "Average Score", val: totalInterviews > 0 ? `${avgScore}%` : "—", desc: totalInterviews > 0 ? `Across ${totalInterviews} sessions` : "No data yet", icon: Award, color: "text-indigo-400", border: "border-indigo-500/20" },
            { label: "Technical Competence", val: avgTechnical > 0 ? `${avgTechnical}%` : "—", desc: avgTechnical > 0 ? "Avg technical score" : "Complete an interview", icon: TrendingUp, color: "text-emerald-400", border: "border-emerald-500/20" },
            { label: "Delivery & Tone", val: avgCommunication > 0 ? `${avgCommunication}%` : "—", desc: avgCommunication > 0 ? "Avg communication score" : "Complete an interview", icon: MessageSquare, color: "text-pink-400", border: "border-pink-500/20" }
          ].map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`rounded-2xl border border-white/10 bg-[#090d16]/70 p-6 backdrop-blur-xl hover:bg-[#0f172a]/70 transition-all group`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{item.label}</span>
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10 group-hover:scale-105 transition-transform`}>
                  <item.icon className={`h-4.5 w-4.5 ${item.color}`} />
                </div>
              </div>
              <div className="text-3xl font-black text-white tracking-tight">{item.val}</div>
              <span className="text-xs text-slate-500 mt-1 block">{item.desc}</span>
            </motion.div>
          ))}
        </div>

        {/* BOTTOM SECTION: HISTORY & ACTIVITIES */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* Previous Interview History */}
          <div className="rounded-2xl border border-white/10 bg-[#090d16]/75 p-6 backdrop-blur-xl shadow-xl lg:col-span-2 flex flex-col gap-5">



            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <History className="h-4.5 w-4.5 text-indigo-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">Previous Interview History</h3>
            </div>

            <div className="flex flex-col gap-4 overflow-y-auto h-[400px] scrollbar-thin scrollbar-thumb-white/40 scrollbar-track-transparent">
              {isLoadingSessions ? (
                <div className="flex items-center justify-center py-12 ">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-400 border-t-transparent" />
                </div>
              ) : sessions.length === 0 ? (
                <div className="text-center py-12 space-y-3 ">
                  <Compass className="h-10 w-10 text-slate-600 mx-auto" />
                  <p className="text-sm text-slate-400 font-semibold">No interviews yet</p>
                  <p className="text-xs text-slate-500">Start your first AI-powered mock interview to see results here.</p>
                  <Link
                    href="/interview/setup"
                    className="inline-flex items-center gap-1.5 mt-2 rounded-lg bg-gradient-to-r from-indigo-500 to-cyan-400 px-5 py-2.5 text-xs font-bold text-[#020617] transition-all hover:shadow-cyan-500/20 hover:shadow-lg"
                  >
                    <Plus className="h-3.5 w-3.5" /> Start Interview
                  </Link>
                </div>
              ) : (
                sessions.map((session) => {
                  const score = session.finalReport?.overallScore || session.matchPercentage || 0;
                  const dateStr = new Date(session.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
                  const roundCount = session.questions?.length || 0;

                  return (
                    <div
                      key={session.id}
                      className="rounded-xl border border-white/5 bg-white/2 hover:bg-white/5 p-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between transition-all "
                    >
                      <div className="flex items-start gap-3.5">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                          <Compass className="h-5.5 w-5.5 text-indigo-400" />
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-extrabold text-white">{session.role}</h4>
                            <span className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] font-bold text-slate-300 uppercase tracking-wide border border-white/10">
                              {session.difficulty}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {roundCount} rounds</span>
                            <span className="h-1 w-1 rounded-full bg-slate-500" />
                            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {dateStr}</span>
                            <span className="h-1 w-1 rounded-full bg-slate-500" />
                            <span className="text-slate-400 font-semibold">{session.resumeName}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-5 justify-between border-t border-white/5 pt-3 md:border-0 md:pt-0">
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Match</span>
                            <div className="text-xs font-bold text-cyan-400 font-mono">{session.matchPercentage}%</div>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Score</span>
                            <div className="text-sm font-extrabold text-white font-mono">{score}%</div>
                          </div>
                        </div>

                        <Link
                          href={`/interview/results?id=${session.id}`}
                          className="flex items-center justify-center rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 p-2 text-slate-300 hover:text-white transition-all cursor-pointer"
                        >
                          <ArrowRight className="h-4.5 w-4.5" />
                        </Link>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

          </div>

          {/* Recent Activity Panel */}
          <div className="rounded-2xl border border-white/10 bg-[#090d16]/75 p-6 backdrop-blur-xl shadow-xl flex flex-col gap-5">
            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <BarChart3 className="h-4.5 w-4.5 text-cyan-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">Recent Activity Log</h3>
            </div>

            <div className="flex flex-col gap-4">
              {recentActivities.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-6">No recent activity yet.</p>
              ) : (
                recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="rounded-xl border border-white/5 bg-white/2 p-3.5 flex flex-col gap-1 transition-colors"
                  >
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                      <span>Assessment Finished</span>
                      <span>{activity.time}</span>
                    </div>
                    <h4 className="text-xs font-extrabold text-white">{activity.text}</h4>
                    <p className="text-[11px] text-slate-400 leading-normal">{activity.detail}</p>
                  </div>
                ))
              )}
            </div>

            {/* Quick Tips */}
            <div className="mt-auto rounded-xl border border-cyan-500/10 bg-cyan-500/5 p-4 flex flex-col gap-1.5">
              <h5 className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-400">Pro Tip</h5>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Complete more mock interviews to track your progress over time. Your scores and metrics will update automatically as you practice.
              </p>
            </div>
          </div>

        </div>

      </main>

    </div>
  );
}