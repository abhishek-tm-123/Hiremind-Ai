"use client"

import React, { useEffect, useState, Suspense } from "react";
import { UserButton, useUser, SignOutButton } from "@clerk/nextjs";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Sparkles, Award, Clock, ArrowRight, BrainCircuit,
  BarChart3, MessageSquare, Compass, ShieldCheck,
  ArrowLeft, CheckCircle2, AlertTriangle, Lightbulb,
  BookOpen, Code, FileCode2, RefreshCw, Share2, ChevronRight
} from "lucide-react";
import { useInterviewStore } from "@/store/interview-store";
import { FinalReport, MatchAnalysis, ParsedResume, AnswerEvaluation } from "@/types/interview";

function AssessmentResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const storeState = useInterviewStore();
  const { activeSessionId } = storeState;

  const [dbData, setDbData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Determine session ID: URL param takes priority, then store
  const sessionId = searchParams.get("id") || activeSessionId;

  // If the store has no finalReport but we have a session ID, load from DB
  useEffect(() => {
    if (!storeState.finalReport && sessionId) {
      setIsLoading(true);
      fetch(`/api/interviews/${sessionId}`)
        .then((res) => res.json())
        .then((data) => {
          if (!data.error) setDbData(data);
        })
        .catch(console.error)
        .finally(() => setIsLoading(false));

      console.log("Final Report:", finalReport);
    }
  }, [sessionId, storeState.finalReport]);

  // Merge: prefer live Zustand store data, fall back to DB data
  const finalReport = (storeState.finalReport || dbData?.finalReport || null) as FinalReport | null;
  const matchAnalysis = (storeState.matchAnalysis || dbData?.matchAnalysis || null) as MatchAnalysis | null;
  const parsedResume = (storeState.parsedResume || null) as ParsedResume | null;
  const evaluations = (storeState.evaluations?.length ? storeState.evaluations : dbData?.evaluations || []) as AnswerEvaluation[];

  const candidateName = parsedResume?.name || dbData?.resumeName || "Candidate";
  const overallMatchScore = finalReport?.overallScore || matchAnalysis?.matchPercentage || 86;
  const technicalScore = finalReport?.technicalScore || 89;
  const communicationScore = finalReport?.communicationScore || 84;
  const confidenceScore = finalReport?.confidenceScore || 82;
  const matchingSkillsList = matchAnalysis?.matchingSkills || ["React", "Next.js", "TypeScript"];
  const missingSkillsList = matchAnalysis?.missingSkills || ["Advanced distributed scaling"];
  const skillGapsList = matchAnalysis?.skillGaps || ["Lacks direct evidence of systems scaling."];
  const experienceFitText = matchAnalysis?.experienceFit || "Partial alignment with role level.";

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#020617] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-400 border-t-transparent" />
          <p className="text-slate-400 font-medium">Loading assessment results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#020617] text-white font-sans selection:bg-cyan-500/30 selection:text-cyan-200">

      {/* Background Gradients */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-[-10%] right-[-10%] h-[60vw] w-[60vw] rounded-full bg-indigo-500/5 blur-[150px]" />
        <div className="absolute bottom-[-10%] left-[-10%] h-[50vw] w-[50vw] rounded-full bg-cyan-500/5 blur-[150px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      {/* TOP HEADER NAVBAR */}
      <header className="relative z-10 border-b border-white/5 bg-[#020617]/50 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="flex items-center gap-2 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 shadow-[0_0_15px_rgba(99,102,241,0.25)] transition-all group-hover:scale-105">
                <BrainCircuit className="h-5 w-5 text-[#020617]" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                Hiremind<span className="text-cyan-400">AI</span>
              </span>
            </Link>

            <nav className="hidden items-center gap-6 sm:flex">
              <Link href="/dashboard" className="text-sm font-semibold text-slate-400 hover:text-white transition-colors">Dashboard</Link>
              <Link href="/interview/setup" className="text-sm font-semibold text-slate-400 hover:text-white transition-colors">Start Interview</Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden flex-col items-end text-xs md:flex">
              <span className="font-semibold text-slate-300">Candidate: {candidateName}</span>
              <span className="text-slate-400">Session ID: HM-2026-X8</span>
            </div>

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

      {/* CORE CONTENT */}
      <main className="relative z-10 mx-auto max-w-7xl px-6 py-10 flex flex-col gap-10">

        {/* Title Header */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-cyan-400 text-sm font-semibold uppercase tracking-wider">
              <Sparkles size={16} className="animate-pulse" />
              <span>Assessment Completed</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">
              AI Evaluation Report
            </h2>
            <p className="text-slate-400 text-sm">
              Session completed on May 19, 2026 • Duration: 30 minutes.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-1.5 border border-white/10 hover:border-white/20 bg-white/2 hover:bg-white/5 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white transition-all cursor-pointer select-none"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Dashboard
            </button>
            <button className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-500 to-cyan-400 hover:from-indigo-600 hover:to-cyan-500 px-6 py-3 rounded-xl text-xs font-extrabold text-[#020617] shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/25 transition-all cursor-pointer select-none">
              <Share2 className="h-4 w-4" /> Share Performance
            </button>
          </div>
        </div>

        {/* OVERALL SCORES CAROUSEL GRID */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">

          {/* Main Overall Dial */}
          <div className="md:col-span-2 rounded-2xl border border-white/10 bg-[#090d16]/75 p-6 backdrop-blur-xl flex flex-col items-center justify-center text-center gap-5 shadow-2xl">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Overall Assessment Score</span>

            <div className="relative flex h-40 w-40 items-center justify-center">
              <svg className="absolute transform -rotate-90" width="160" height="160">
                <circle cx="80" cy="80" r="70" fill="transparent" stroke="rgba(255,255,255,0.03)" strokeWidth="8" />
                <circle cx="80" cy="80" r="70" fill="transparent" stroke="url(#cyanGlow)" strokeWidth="8"
                  strokeDasharray={2 * Math.PI * 70}
                  strokeDashoffset={2 * Math.PI * 70 * (1 - overallMatchScore / 100)}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
                <defs>
                  <linearGradient id="cyanGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#22d3ee" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="flex flex-col items-center">
                <span className="text-5xl font-black text-white tracking-tighter">{overallMatchScore}<span className="text-xl text-cyan-400">%</span></span>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold font-mono">
                  {overallMatchScore >= 80 ? "Strong Fit" : overallMatchScore >= 60 ? "Good Fit" : "Needs Review"}
                </span>
              </div>
            </div>

            <div className="w-full grid grid-cols-2 gap-3 mt-2">
              <div className="rounded-xl border border-white/5 bg-white/2 p-3 text-center">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block">Resume Match</span>
                <span className="text-lg font-extrabold text-cyan-400 font-mono">{overallMatchScore}%</span>
              </div>
              <div className="rounded-xl border border-white/5 bg-white/2 p-3 text-center">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block">Estimated Rank</span>
                <span className="text-lg font-extrabold text-indigo-400 font-mono">
                  Top {Math.max(1, 100 - overallMatchScore)}%
                </span>
              </div>
            </div>
          </div>

          {/* Dials for Specific Core Areas */}
          <div className="md:col-span-3 rounded-2xl border border-white/10 bg-[#090d16]/75 p-6 backdrop-blur-xl shadow-2xl flex flex-col justify-between gap-6">
            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <BarChart3 className="h-4.5 w-4.5 text-indigo-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Performance Breakdown</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {[
                { label: "Technical capability", score: technicalScore, desc: "Accurate engineering details", color: "from-indigo-500 to-indigo-600", stroke: "#6366f1" },
                { label: "Delivery & Tone", score: communicationScore, desc: "Consistent cadence rate", color: "from-cyan-400 to-cyan-500", stroke: "#22d3ee" },
                { label: "Speaking Confidence", score: confidenceScore, desc: "Minimal conversational pauses", color: "from-pink-500 to-pink-600", stroke: "#ec4899" }
              ].map((dial) => (
                <div key={dial.label} className="flex flex-col items-center gap-3 text-center">
                  <div className="relative flex h-20 w-20 items-center justify-center">
                    <svg className="absolute transform -rotate-90" width="80" height="80">
                      <circle cx="40" cy="40" r="34" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="5" />
                      <circle cx="40" cy="40" r="34" fill="transparent" stroke={dial.stroke} strokeWidth="5"
                        strokeDasharray={2 * Math.PI * 34}
                        strokeDashoffset={2 * Math.PI * 34 * (1 - dial.score / 100)}
                        strokeLinecap="round"
                        className="transition-all duration-1000"
                      />
                    </svg>
                    <span className="text-sm font-extrabold text-white font-mono">{dial.score}%</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wide">{dial.label}</span>
                    <span className="text-[9px] text-slate-500 block leading-normal">{dial.desc}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Performance Timeline progression indicator */}
            <div className="rounded-xl border border-white/5 bg-white/2 p-4 flex flex-col gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Assessment Timeline progression</span>
              <div className="flex items-center justify-between text-xs text-slate-500 flex-wrap gap-2">
                {finalReport?.roundBreakdown && finalReport.roundBreakdown.length > 0 ? (
                  finalReport.roundBreakdown.map((rb, idx) => (
                    <React.Fragment key={rb.round}>
                      {idx > 0 && <ChevronRight className="h-3.5 w-3.5" />}
                      <span className={rb.round.toLowerCase().includes("coding") ? "text-cyan-400 font-bold" : ""}>
                        {rb.round}: {rb.score}%
                      </span>
                    </React.Fragment>
                  ))
                ) : (
                  <>
                    <span>Intro: 75%</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                    <span>Technical: 84%</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                    <span className="text-cyan-400 font-bold">Coding: 92%</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                    <span>Behavior: 83%</span>
                  </>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* FEEDBACK SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Strengths & Weaknesses */}
          <div className="rounded-2xl border border-white/10 bg-[#090d16]/75 p-6 backdrop-blur-xl shadow-xl flex flex-col gap-6">
            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <Compass className="h-4.5 w-4.5 text-cyan-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Detailed AI Core Assessment</h3>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl border border-emerald-500/10 bg-emerald-500/5 p-4 space-y-2">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="h-4.5 w-4.5" /> Key Strengths
                </h4>
                <ul className="list-disc list-inside space-y-1 text-xs text-slate-300 leading-relaxed font-semibold">
                  {finalReport?.strengths && finalReport.strengths.length > 0 ? (
                    finalReport.strengths.map((str, i) => <li key={i}>{str}</li>)
                  ) : (
                    <>
                      <li>Demonstrated solid competence in {matchingSkillsList.slice(0, 3).join(", ")}.</li>
                      <li>Good target seniority alignment: {experienceFitText}</li>
                      <li>Exceptional custom hook timeout encapsulation demonstrated in Coding Round.</li>
                    </>
                  )}
                </ul>
              </div>

              <div className="rounded-xl border border-amber-500/10 bg-amber-500/5 p-4 space-y-2">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="h-4.5 w-4.5" /> Gaps & Weaknesses
                </h4>
                <ul className="list-disc list-inside space-y-1 text-xs text-slate-300 leading-relaxed font-semibold">
                  {finalReport?.weaknesses && finalReport.weaknesses.length > 0 ? (
                    finalReport.weaknesses.map((weak, i) => <li key={i}>{weak}</li>)
                  ) : (
                    <>
                      <li>{skillGapsList[0] || "No severe tech gaps detected."}</li>
                      <li>Missing background in {missingSkillsList.slice(0, 2).join(", ") || "advanced system scaling"}.</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* Actionable Suggestions & Study Guides */}
          <div className="rounded-2xl border border-white/10 bg-[#090d16]/75 p-6 backdrop-blur-xl shadow-xl flex flex-col gap-6">
            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <BookOpen className="h-4.5 w-4.5 text-indigo-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Study recommendations</h3>
            </div>

            <div className="space-y-4">
              {finalReport?.studyRecommendations && finalReport.studyRecommendations.length > 0 ? (
                finalReport.studyRecommendations.map((item, idx) => (
                  <div key={item.title} className="rounded-xl border border-white/5 bg-white/2 p-4 flex gap-4 transition-all hover:bg-white/4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 border border-indigo-500/20 font-bold text-xs text-indigo-400">
                      0{idx + 1}
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-extrabold text-white">{item.title}</h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">{item.description}</p>
                    </div>
                  </div>
                ))
              ) : (
                [
                  { title: "Macro/Microtask Queue priorities", desc: "Review order of promises versus setTimeout queuing inside the Chrome V8 Engine." },
                  { title: "React memoization stable hooks", desc: "Study memoized reference comparisons to prevent child re-renders." },
                  { title: "STAR behavioral metrics", desc: "Incorporate statistics when answering situational conflict assessments." }
                ].map((item, idx) => (
                  <div key={item.title} className="rounded-xl border border-white/5 bg-white/2 p-4 flex gap-4 transition-all hover:bg-white/4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 border border-indigo-500/20 font-bold text-xs text-indigo-400">
                      0{idx + 1}
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-extrabold text-white">{item.title}</h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">{item.desc}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* CODING ANALYSIS DETAIL */}
        <div className="rounded-2xl border border-white/10 bg-[#090d16]/75 p-6 backdrop-blur-xl shadow-xl flex flex-col gap-6">
          <div className="flex items-center gap-2 border-b border-white/5 pb-3">
            <Code className="h-4.5 w-4.5 text-cyan-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Coding assessment feedback</h3>
          </div>

          {(() => {
            const codingEval = evaluations?.find(e => e.questionId === "q3");
            const codeQuality = codingEval?.technicalScore || 92;
            const optimization = codingEval?.confidenceScore || 80;
            const readability = codingEval?.communicationScore || 95;
            const problemSolving = Math.round((codeQuality + optimization) / 2);

            const feedbackText = codingEval && codingEval.feedback && codingEval.feedback.length > 0
              ? codingEval.feedback.join(" ")
              : "Your implementation of the custom hook cleanly handles references, timeouts, and typescript constraints. Timeout clears on component unmount are correctly integrated to avoid potential memory leak side-effects.";

            return (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Metric Bars */}
                <div className="md:col-span-1 space-y-4">
                  {[
                    { label: "Code Quality", val: codeQuality },
                    { label: "Optimization", val: optimization },
                    { label: "Readability", val: readability },
                    { label: "Problem Solving", val: problemSolving }
                  ].map((item) => (
                    <div key={item.label} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-slate-400">{item.label}</span>
                        <span className="text-white font-bold">{item.val}%</span>
                      </div>
                      <div className="h-2 w-full bg-white/5 border border-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full" style={{ width: `${item.val}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* In-depth Code review */}
                <div className="md:col-span-2 rounded-xl border border-white/5 bg-white/2 p-5 flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                    <FileCode2 className="h-5.5 w-5.5 text-cyan-400" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xs font-extrabold text-white">Custom Hook useDebounce Implementation review</h4>
                    <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                      {feedbackText}
                    </p>
                  </div>
                </div>

              </div>
            );
          })()}
        </div>

        {/* Footer info message */}
        <div className="text-center text-xs text-slate-500 font-semibold uppercase tracking-wider py-4">
          “AI generated this feedback based on your resume, job description, and interview responses.”
        </div>

      </main>

    </div>
  );
}

export default function AssessmentResults() {
  return (
    <Suspense fallback={
      <div className="flex h-screen w-full items-center justify-center bg-[#020617] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-400 border-t-transparent" />
          <p className="text-slate-400 font-medium font-sans">Loading assessment results...</p>
        </div>
      </div>
    }>
      <AssessmentResultsContent />
    </Suspense>
  );
}

