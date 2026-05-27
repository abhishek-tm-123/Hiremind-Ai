"use client";

import React, { useState } from "react";
import { 
  CheckCircle2, AlertCircle, Sparkles, BrainCircuit, 
  Briefcase, BookOpen, Layers, Target, ChevronRight, FileText
} from "lucide-react";
import { useInterviewStore } from "../../store/interview-store";

export default function AnalysisDashboard() {
  const { 
    parsedResume, 
    parsedJobDescription, 
    matchAnalysis, 
    interviewMetadata,
    difficulty,
    duration
  } = useInterviewStore();
  const [showRawText, setShowRawText] = useState(false);

  if (!parsedResume || !parsedJobDescription || !matchAnalysis || !interviewMetadata) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-slate-400">
        <AlertCircle className="h-10 w-10 text-slate-500 mb-2 animate-bounce" />
        <p className="font-semibold text-sm">No analysis reports available.</p>
      </div>
    );
  }

  // Choose styling class based on score
  const score = matchAnalysis.matchPercentage;
  let scoreColorClass = "text-cyan-400 border-cyan-500/20 bg-cyan-500/5";
  let scoreProgressColor = "stroke-cyan-400";
  if (score >= 80) {
    scoreColorClass = "text-emerald-400 border-emerald-500/20 bg-emerald-500/5";
    scoreProgressColor = "stroke-emerald-400";
  } else if (score < 60) {
    scoreColorClass = "text-amber-400 border-amber-500/20 bg-amber-500/5";
    scoreProgressColor = "stroke-amber-400";
  }

  // Calculate SVG stroke-dashoffset for radial progress gauge
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col gap-8">
      {/* HEADER SUMMARY SECTION */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-white/5">
        <div className="space-y-1.5">
          <span className="rounded-md bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
            AI Profiling Complete
          </span>
          <h3 className="text-2xl font-black text-white leading-tight">
            Assessment Suitability Analysis
          </h3>
          <p className="text-xs text-slate-400 font-medium">
            Candidate: <span className="text-slate-200 font-bold">{parsedResume.name}</span> • Target: <span className="text-slate-200 font-bold">{parsedJobDescription.role}</span>
          </p>
        </div>

        {/* Custom Radial Score Dial */}
        <div className={`flex items-center gap-4 rounded-xl border p-4 shadow-xl ${scoreColorClass}`}>
          <div className="relative h-18 w-18 shrink-0">
            <svg className="h-full w-full -rotate-90">
              <circle 
                cx="36" 
                cy="36" 
                r={radius} 
                className="stroke-white/5 fill-transparent" 
                strokeWidth="6"
              />
              <circle 
                cx="36" 
                cy="36" 
                r={radius} 
                className={`${scoreProgressColor} fill-transparent transition-all duration-1000`} 
                strokeWidth="6"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center font-mono font-black text-base text-white">
              {score}%
            </div>
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Match Competency
            </span>
            <span className="text-sm font-black text-white">
              {score >= 80 ? "Excellent Fit" : score >= 60 ? "Moderate Fit" : "Gaps Detected"}
            </span>
            <span className="text-[10px] text-slate-400 font-medium block">
              {matchAnalysis.experienceFit}
            </span>
          </div>
        </div>
      </div>

      {/* CORE INFO CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: RESUME METADATA SUMMARY */}
        <div className="md:col-span-1 flex flex-col gap-6">
          
          {/* Profile overview card */}
          <div className="rounded-xl border border-white/5 bg-white/2 p-5 flex flex-col gap-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Briefcase className="h-4 w-4 text-cyan-400" /> Parsed Credentials
            </h4>
            
            <div className="space-y-3.5">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Extracted Title</span>
                <span className="text-sm font-extrabold text-white block">{parsedResume.role}</span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Years of Experience</span>
                <span className="text-sm font-extrabold text-white block">{parsedResume.yearsOfExperience}</span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Education</span>
                {parsedResume.education.map((edu, idx) => (
                  <div key={idx} className="text-xs text-slate-300 font-semibold leading-relaxed">
                    {edu.degree} <span className="text-slate-500">at</span> {edu.institution.split(",")[0]} ({edu.year})
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Suggested Preparation topics */}
          <div className="rounded-xl border border-white/5 bg-white/2 p-5 flex flex-col gap-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <BookOpen className="h-4 w-4 text-indigo-400" /> Focus Topics Recommendation
            </h4>
            <div className="flex flex-col gap-2">
              {interviewMetadata.focusAreas.map((topic, i) => (
                <div key={i} className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                  <ChevronRight className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                  <span>{topic}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: FIT METRICS AND MATCH DETAILS */}
        <div className="md:col-span-2 flex flex-col gap-6">
          
          {/* Skills match checks */}
          <div className="rounded-xl border border-white/5 bg-white/2 p-5 flex flex-col gap-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-pink-400" /> Core Skill Overlaps & Gaps
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Overlapping skills */}
              <div className="space-y-2.5">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                  ✓ Matching Skills ({matchAnalysis.matchingSkills.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {matchAnalysis.matchingSkills.map(skill => (
                    <span key={skill} className="rounded bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-300 px-2 py-0.5">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing skills */}
              <div className="space-y-2.5">
                <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block">
                  ✗ Missing Core Requirements ({matchAnalysis.missingSkills.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {matchAnalysis.missingSkills.map(skill => (
                    <span key={skill} className="rounded bg-rose-500/10 border border-rose-500/20 text-[10px] font-bold text-rose-300 px-2 py-0.5">
                      {skill}
                    </span>
                  ))}
                  {matchAnalysis.missingSkills.length === 0 && (
                    <span className="text-xs font-semibold text-slate-500">None detected! Matches all core requirements.</span>
                  )}
                </div>
              </div>
            </div>

            {/* Gap insights list */}
            {matchAnalysis.skillGaps.length > 0 && (
              <div className="border-t border-white/5 pt-3.5 flex flex-col gap-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Detection Insights</span>
                {matchAnalysis.skillGaps.map((gap, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs font-semibold text-amber-400">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                    <span>{gap}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* AI Insights & Interview outlines */}
          <div className="rounded-xl border border-white/5 bg-white/2 p-5 flex flex-col gap-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-cyan-400" /> Personalized AI Insights
            </h4>

            <div className="space-y-3.5 text-xs font-medium leading-relaxed text-slate-300">
              <p>
                “Based on the uploaded credentials, candidate shows strong execution capability in <span className="text-cyan-400 font-bold">{parsedResume.skills.slice(0, 3).join(", ")}</span> structures.
                {matchAnalysis.missingSkills.length > 0 ? (
                  <span> The interview prep has compiled focus areas targeted towards resolving missing gaps in <span className="text-rose-400 font-bold">{matchAnalysis.missingSkills.slice(0, 2).join(" & ")}</span>.</span>
                ) : (
                  <span> The candidate has comprehensive coverage of all target technologies.</span>
                )}”
              </p>
              
              <div className="rounded-lg border border-cyan-500/10 bg-cyan-500/5 p-3.5 flex gap-3">
                <Target className="h-5 w-5 shrink-0 text-cyan-400 mt-0.5" />
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Expected Tech Depth</span>
                  <p className="text-xs text-white leading-relaxed font-semibold">
                    {interviewMetadata.expectedTechnicalDepth}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Scheduled Rounds Display */}
          <div className="rounded-xl border border-white/5 bg-white/2 p-5 flex flex-col gap-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <BrainCircuit className="h-4 w-4 text-emerald-400" /> Customized Assessment Outline
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              {interviewMetadata.rounds.map((round, idx) => (
                <div key={idx} className="rounded-xl bg-[#020617] border border-white/5 p-3.5 flex flex-col gap-1.5 shadow-md">
                  <span className="text-[11px] font-mono font-bold text-cyan-400">Round 0{idx + 1}</span>
                  <span className="text-xs font-extrabold text-white leading-snug line-clamp-2">
                    {round}
                  </span>
                  <span className="text-[9px] text-slate-500 font-semibold uppercase tracking-wider mt-auto">
                    {idx === 2 ? "Live Sandbox" : "Conversational"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Raw Text Viewer Accordion */}
          {parsedResume.rawText && (
            <div className="rounded-xl border border-white/5 bg-white/2 p-5 flex flex-col gap-3">
              <button
                onClick={() => setShowRawText(!showRawText)}
                className="flex items-center justify-between w-full text-left text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white transition-colors cursor-pointer select-none"
              >
                <span className="flex items-center gap-1.5">
                  <FileText className="h-4 w-4 text-cyan-400" /> Raw Resume Extracted Text
                </span>
                <span className="text-[10px] text-cyan-400 hover:underline">
                  {showRawText ? "Hide Text" : "Show Text"}
                </span>
              </button>

              {showRawText && (
                <pre className="mt-2 max-h-[220px] overflow-y-auto rounded-lg bg-[#020617] p-4 text-[10px] font-mono leading-relaxed text-slate-300 border border-white/5 whitespace-pre-wrap">
                  {parsedResume.rawText}
                </pre>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
