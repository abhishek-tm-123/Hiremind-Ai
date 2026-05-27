"use client"

import React, { useState, useEffect, useRef } from "react";
import { UserButton, useUser, SignOutButton } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles, BrainCircuit, ArrowLeft, ArrowRight, Upload,
  FileText, Check, Settings, Compass, ClipboardList,
  Briefcase, CheckCircle2, AlertCircle, RefreshCw, Layers
} from "lucide-react";

import ResumeUpload from "@/components/upload/ResumeUpload";
import AnalysisDashboard from "@/components/analysis/AnalysisDashboard";
import { useInterviewStore } from "@/store/interview-store";

export default function InterviewSetup() {
  const { user } = useUser();
  const router = useRouter();

  // Step tracker (1 to 4)
  const [currentStep, setCurrentStep] = useState(1);

  // Zustand Store variables
  const {
    isAnalyzing,
    setIsAnalyzing,
    analysisStep,
    setAnalysisStep,
    errorMessage,
    setErrorMessage,
    difficulty,
    setDifficulty,
    duration,
    setDuration,
    type,
    setType,
    mode,
    setMode,
    resumeFile,
    rawJobDescription,
    setRawJobDescription,
    setParsedResume,
    setParsedJobDescription,
    setMatchAnalysis,
    setInterviewMetadata
  } = useInterviewStore();

  const [uploadProgress, setUploadProgress] = useState(0);

  // Core parser API matching trigger
  const runSuitabilityAnalysis = async () => {
    if (!resumeFile) {
      setErrorMessage("Please upload a resume file in step 1.");
      return;
    }

    setIsAnalyzing(true);
    setErrorMessage(null);
    setUploadProgress(5);
    setAnalysisStep("Uploading resume...");

    const steps = [
      { progress: 20, label: "Uploading resume..." },
      { progress: 45, label: "Extracting skills & credentials..." },
      { progress: 65, label: "Understanding job requirements..." },
      { progress: 85, label: "Calculating role compatibility..." },
      { progress: 98, label: "Preparing personalized interview..." }
    ];

    let currentStepIdx = 0;
    const progressInterval = setInterval(() => {
      if (currentStepIdx < steps.length) {
        setUploadProgress(steps[currentStepIdx].progress);
        setAnalysisStep(steps[currentStepIdx].label);
        currentStepIdx++;
      }
    }, 700);

    try {
      const formData = new FormData();
      formData.append("file", resumeFile);
      formData.append("jobDescription", rawJobDescription);
      formData.append("difficulty", difficulty);
      formData.append("duration", duration);

      const response = await fetch("/api/parse-resume", {
        method: "POST",
        body: formData
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.error || "Failed to process resume matching.");
      }

      const result = await response.json();

      setUploadProgress(100);
      setAnalysisStep("Analysis complete!");

      setParsedResume(result.parsedResume);
      setParsedJobDescription(result.parsedJobDescription);
      setMatchAnalysis(result.matchAnalysis);
      setInterviewMetadata(result.interviewMetadata);

      setTimeout(() => {
        setIsAnalyzing(false);
        setCurrentStep(4);
      }, 500);

    } catch (err: any) {
      clearInterval(progressInterval);
      console.error(err);
      setErrorMessage(err.message || "An unexpected error occurred during processing.");
      setIsAnalyzing(false);
    }
  };

  const handleNextStep = () => {
    if (currentStep === 3) {
      runSuitabilityAnalysis();
    } else if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleStartInterview = async () => {
    const { parsedResume, parsedJobDescription, matchAnalysis, interviewMetadata, resumeFile, rawJobDescription, difficulty, duration } = useInterviewStore.getState();

    if (!parsedResume || !parsedJobDescription || !matchAnalysis || !interviewMetadata) {
      console.error("Missing required data to start interview");
      router.push("/interview");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisStep("Generating AI interview questions...");

    try {
      // 1. Generate Questions
      const response = await fetch("/api/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parsedResume,
          parsedJobDescription,
          matchAnalysis,
          interviewMetadata,
          difficulty,
          duration,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate interview questions");
      }

      const data = await response.json();
      console.log("Generated questions:", data);
      useInterviewStore.getState().setGeneratedQuestions(data.questions);

      // 2. Initialize Session in DB
      setAnalysisStep("Initializing database session...");
      const createDbResponse = await fetch("/api/interviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: parsedJobDescription.role,
          resumeName: resumeFile ? resumeFile.name : "Resume",
          matchPercentage: matchAnalysis.matchPercentage,
          difficulty: difficulty,
          resumeText: parsedResume.skills.join(", "),
          jobDescriptionText: rawJobDescription,
          matchAnalysis: matchAnalysis,
          metadata: interviewMetadata,
          questions: data.questions,
          answers: {},
          evaluations: [],
        }),
      });

      if (!createDbResponse.ok) {
        const dbErrorData = await createDbResponse.json();
        console.error("Database session creation failed:", dbErrorData);
        throw new Error(dbErrorData.error || "Failed to initialize interview session in database.");
      }

      const sessionData = await createDbResponse.json();
      if (sessionData && sessionData.id) {
        useInterviewStore.getState().setActiveSessionId(sessionData.id);
        console.log("Successfully created interview session:", sessionData.id);
      } else {
        throw new Error("Invalid response from interview session creation.");
      }

      // Proceed to interview
      router.push("/interview");

    } catch (err: any) {
      console.error("Interview initialization error:", err);
      setErrorMessage(err.message || "An unexpected error occurred while preparing your interview.");
      setIsAnalyzing(false);
      // Stay on setup page so user can see the error
    } finally {
      setAnalysisStep("");
    }
  };

  if (!user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#020617] text-white">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="h-10 w-10 animate-spin text-cyan-400" />
          <p className="text-slate-400 font-medium">Synchronizing configurations...</p>
        </div>
      </div>
    );
  }


  return (
    <div className="relative min-h-screen w-full overflow-y-auto  bg-[#020617] text-white font-sans selection:bg-cyan-500/30 selection:text-cyan-200">

      {/* Background Orbs */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-[-10%] right-[-15%] h-[60vw] w-[60vw] rounded-full bg-indigo-500/5 blur-[150px]" />
        <div className="absolute bottom-[-15%] left-[-10%] h-[50vw] w-[50vw] rounded-full bg-cyan-500/5 blur-[150px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff01_1px,transparent_1px),linear-gradient(to_bottom,#ffffff01_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      {/* HEADER */}
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
              <Link href="/interview/setup" className="text-sm font-semibold text-cyan-400">Start Interview</Link>
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

      {/* CORE WORKFLOW AREA */}
      <main className="relative z-10 mx-auto max-w-4xl px-6 py-10">

        {/* Navigation Step Indicators */}
        <div className="mb-10 flex items-center justify-between">
          {[
            { step: 1, label: "Resume Upload", icon: Upload },
            { step: 2, label: "Job Target", icon: Briefcase },
            { step: 3, label: "Settings", icon: Settings },
            { step: 4, label: "AI Summary", icon: ClipboardList }
          ].map((item, index) => (
            <React.Fragment key={item.step}>
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl border text-xs font-bold transition-all duration-300 ${currentStep === item.step
                    ? "bg-gradient-to-r from-indigo-500 to-cyan-400 border-transparent text-[#020617] scale-110 shadow-[0_0_15px_rgba(34,211,238,0.25)]"
                    : currentStep > item.step
                      ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
                      : "bg-[#090d16] border-white/10 text-slate-500"
                    }`}
                >
                  {currentStep > item.step ? <Check className="h-4 w-4" /> : <item.icon className="h-4.5 w-4.5" />}
                </div>
                <span className={`hidden text-[10px] font-bold uppercase tracking-wider md:block ${currentStep === item.step ? "text-cyan-400" : "text-slate-500"
                  }`}>
                  {item.label}
                </span>
              </div>

              {index < 3 && (
                <div className="h-[2px] flex-1 mx-2 bg-white/5 border border-white/5">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-500"
                    style={{ width: currentStep > item.step ? "100%" : "0%" }}
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* STEP INTERFACE CARDS */}
        <div className="min-h-[440px] rounded-2xl border border-white/10 bg-[#090d16]/75 p-8 backdrop-blur-xl shadow-2xl flex flex-col justify-between">

          {isAnalyzing ? (
            <div className="min-h-[300px] flex flex-col items-center justify-center gap-6 my-auto">
              <RefreshCw className="h-10 w-10 animate-spin text-cyan-400" />

              <div className="w-full max-w-sm space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-400 font-mono">
                  <span className="animate-pulse">{analysisStep}</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 border border-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-300 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <AnimatePresence mode="wait">

              {/* STEP 1: Resume Upload */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <ResumeUpload />
                </motion.div>
              )}

              {/* STEP 2: Job Target */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col gap-6"
                >
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-indigo-400" /> Job Target & Role Focus
                    </h3>
                    <p className="text-xs text-slate-400">
                      Paste the target job description to match skills, expectations, and architecture requirements.
                    </p>
                  </div>

                  <div className="flex flex-col gap-4">
                    <textarea
                      value={rawJobDescription}
                      onChange={(e) => setRawJobDescription(e.target.value)}
                      placeholder="We're looking for a Senior Frontend Architect with experience in Next.js App Router optimization, Tailwind styling configurations, Framer Motion transitions, and Monaco code editor integrations..."
                      className="w-full min-h-[160px] rounded-xl border border-white/10 bg-white/2 p-4 text-xs font-semibold text-slate-200 placeholder-slate-600 focus:border-indigo-400/50 focus:ring-1 focus:ring-indigo-400/50 outline-none transition-all resize-none font-mono"
                    />
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Settings */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col gap-6"
                >
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <Settings className="h-5 w-5 text-indigo-400" /> Customize Interview Settings
                    </h3>
                    <p className="text-xs text-slate-400">
                      Adjust difficulty parameters, durations, and conversational parameters.
                    </p>
                  </div>

                  {errorMessage && (
                    <div className="flex items-start gap-2.5 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-xs font-semibold text-red-400">
                      <AlertCircle className="h-4.5 w-4.5 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Difficulty parameter */}
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Difficulty Target</span>
                      <div className="grid grid-cols-4 gap-2">
                        {["Junior", "Mid-level", "Senior", "Lead"].map((item) => (
                          <button
                            key={item}
                            type="button"
                            onClick={() => setDifficulty(item)}
                            className={`rounded-xl py-2.5 text-xs font-bold border transition-all cursor-pointer select-none ${difficulty === item
                              ? "bg-cyan-500/10 border-cyan-400 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.15)]"
                              : "bg-[#090d16] border-white/10 text-slate-400 hover:border-white/20"
                              }`}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Duration Parameter */}
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Interview Duration</span>
                      <div className="grid grid-cols-4 gap-2">
                        {["15 mins", "30 mins", "45 mins", "60 mins"].map((item) => (
                          <button
                            key={item}
                            type="button"
                            onClick={() => setDuration(item)}
                            className={`rounded-xl py-2.5 text-xs font-bold border transition-all cursor-pointer select-none ${duration === item
                              ? "bg-indigo-500/10 border-indigo-400 text-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.15)]"
                              : "bg-[#090d16] border-white/10 text-slate-400 hover:border-white/20"
                              }`}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Type Parameter */}
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Evaluation Focus</span>
                      <div className="grid grid-cols-3 gap-2">
                        {["Technical", "Behavioral", "Mixed"].map((item) => (
                          <button
                            key={item}
                            type="button"
                            onClick={() => setType(item)}
                            className={`rounded-xl py-2.5 text-xs font-bold border transition-all cursor-pointer select-none ${type === item
                              ? "bg-pink-500/10 border-pink-400 text-pink-400 shadow-[0_0_10px_rgba(236,72,153,0.15)]"
                              : "bg-[#090d16] border-white/10 text-slate-400 hover:border-white/20"
                              }`}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Mode Parameter */}
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Conversational Mode</span>
                      <div className="grid grid-cols-2 gap-2">
                        {["Voice + Text", "Text Only"].map((item) => (
                          <button
                            key={item}
                            type="button"
                            onClick={() => setMode(item)}
                            className={`rounded-xl py-2.5 text-xs font-bold border transition-all cursor-pointer select-none ${mode === item
                              ? "bg-emerald-500/10 border-emerald-400 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.15)]"
                              : "bg-[#090d16] border-white/10 text-slate-400 hover:border-white/20"
                              }`}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>
                </motion.div>
              )}

              {/* STEP 4: AI Summary Dashboard */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <AnalysisDashboard />
                </motion.div>
              )}

            </AnimatePresence>
          )}

          {/* BACK & NEXT CONTROLS */}
          <div className="mt-8 border-t border-white/5 pt-6 flex items-center justify-between">
            <button
              onClick={handlePrevStep}
              disabled={currentStep === 1 || isAnalyzing}
              className="flex items-center gap-1.5 border border-white/10 hover:border-white/20 bg-white/2 hover:bg-white/5 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white transition-all cursor-pointer disabled:opacity-30 disabled:pointer-events-none select-none"
            >
              <ArrowLeft className="h-4 w-4" /> Previous
            </button>

            {currentStep < 4 ? (
              <button
                onClick={handleNextStep}
                disabled={
                  (currentStep === 1 && !resumeFile) ||
                  (currentStep === 2 && !rawJobDescription.trim()) ||
                  isAnalyzing
                }
                className="flex items-center gap-1.5 bg-white text-[#020617] hover:bg-slate-200 px-6 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer disabled:opacity-40 disabled:pointer-events-none select-none shadow-[0_0_15px_rgba(255,255,255,0.05)]"
              >
                {currentStep === 3 ? (
                  <>Generate AI Assessment <Sparkles className="h-4 w-4" /></>
                ) : (
                  <>Next Step <ArrowRight className="h-4 w-4" /></>
                )}
              </button>
            ) : (
              <button
                onClick={handleStartInterview}
                className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-500 to-cyan-400 hover:from-indigo-600 hover:to-cyan-500 px-7 py-3 rounded-xl text-xs font-extrabold text-[#020617] shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/25 transition-all cursor-pointer select-none"
              >
                Start AI Interview <Sparkles className="h-4.5 w-4.5" />
              </button>
            )}
          </div>
        </div>

      </main>

    </div>
  );
}
