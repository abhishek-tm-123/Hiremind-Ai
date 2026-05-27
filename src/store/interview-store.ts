import { create } from "zustand";
import { ParsedResume, JobDescriptionAnalysis, MatchAnalysis, InterviewMetadata, InterviewQuestion, AnswerEvaluation, FinalReport } from "../types/interview";

interface InterviewState {
  // Parsing status
  isAnalyzing: boolean;
  analysisStep: string;
  errorMessage: string | null;

  // Selected configs
  difficulty: string;
  duration: string;
  type: string;
  mode: string;

  // File
  resumeFile: File | null;

  // Parsed outputs
  parsedResume: ParsedResume | null;
  rawJobDescription: string;
  parsedJobDescription: JobDescriptionAnalysis | null;
  matchAnalysis: MatchAnalysis | null;
  interviewMetadata: InterviewMetadata | null;

  // Phase 3: AI-generated interview data
  generatedQuestions: InterviewQuestion[];
  isGeneratingQuestions: boolean;
  answers: Record<string, string>;
  evaluations: AnswerEvaluation[];
  isEvaluating: boolean;
  finalReport: FinalReport | null;
  isGeneratingReport: boolean;
  activeSessionId: string | null;

  // Setter Actions
  setIsAnalyzing: (loading: boolean) => void;
  setAnalysisStep: (step: string) => void;
  setErrorMessage: (error: string | null) => void;

  setDifficulty: (diff: string) => void;
  setDuration: (dur: string) => void;
  setType: (t: string) => void;
  setMode: (m: string) => void;
  
  setResumeFile: (file: File | null) => void;

  setParsedResume: (resume: ParsedResume | null) => void;
  setRawJobDescription: (jd: string) => void;
  setParsedJobDescription: (jdAnalysis: JobDescriptionAnalysis | null) => void;
  setMatchAnalysis: (match: MatchAnalysis | null) => void;
  setInterviewMetadata: (meta: InterviewMetadata | null) => void;

  // Phase 3 setters
  setGeneratedQuestions: (questions: InterviewQuestion[]) => void;
  addQuestion: (question: InterviewQuestion) => void;
  setIsGeneratingQuestions: (loading: boolean) => void;
  addAnswer: (questionId: string, answer: string) => void;
  addEvaluation: (evaluation: AnswerEvaluation) => void;
  setIsEvaluating: (loading: boolean) => void;
  setFinalReport: (report: FinalReport | null) => void;
  setIsGeneratingReport: (loading: boolean) => void;
  setActiveSessionId: (id: string | null) => void;

  resetStore: () => void;
}

export const useInterviewStore = create<InterviewState>((set) => ({
  isAnalyzing: false,
  analysisStep: "",
  errorMessage: null,

  difficulty: "Senior",
  duration: "30 mins",
  type: "Mixed",
  mode: "Voice + Text",
  resumeFile: null,

  parsedResume: null,
  rawJobDescription: "",
  parsedJobDescription: null,
  matchAnalysis: null,
  interviewMetadata: null,

  // Phase 3 defaults
  generatedQuestions: [],
  isGeneratingQuestions: false,
  answers: {},
  evaluations: [],
  isEvaluating: false,
  finalReport: null,
  isGeneratingReport: false,
  activeSessionId: null,

  setIsAnalyzing: (loading) => set({ isAnalyzing: loading }),
  setAnalysisStep: (step) => set({ analysisStep: step }),
  setErrorMessage: (error) => set({ errorMessage: error }),

  setDifficulty: (diff) => set({ difficulty: diff }),
  setDuration: (dur) => set({ duration: dur }),
  setType: (t) => set({ type: t }),
  setMode: (m) => set({ mode: m }),
  
  setResumeFile: (file) => set({ resumeFile: file }),

  setParsedResume: (resume) => set({ parsedResume: resume }),
  setRawJobDescription: (jd) => set({ rawJobDescription: jd }),
  setParsedJobDescription: (jdAnalysis) => set({ parsedJobDescription: jdAnalysis }),
  setMatchAnalysis: (match) => set({ matchAnalysis: match }),
  setInterviewMetadata: (meta) => set({ interviewMetadata: meta }),

  // Phase 3 setters
  setGeneratedQuestions: (questions) => set({ generatedQuestions: questions }),
  addQuestion: (question) => set((state) => ({ generatedQuestions: [...state.generatedQuestions, question] })),
  setIsGeneratingQuestions: (loading) => set({ isGeneratingQuestions: loading }),
  addAnswer: (questionId, answer) => set((state) => ({
    answers: { ...state.answers, [questionId]: answer }
  })),
  addEvaluation: (evaluation) => set((state) => ({
    evaluations: [...state.evaluations, evaluation]
  })),
  setIsEvaluating: (loading) => set({ isEvaluating: loading }),
  setFinalReport: (report) => set({ finalReport: report }),
  setIsGeneratingReport: (loading) => set({ isGeneratingReport: loading }),
  setActiveSessionId: (id) => set({ activeSessionId: id }),

  resetStore: () => set({
    isAnalyzing: false,
    analysisStep: "",
    errorMessage: null,
    resumeFile: null,
    parsedResume: null,
    rawJobDescription: "",
    parsedJobDescription: null,
    matchAnalysis: null,
    interviewMetadata: null,
    generatedQuestions: [],
    isGeneratingQuestions: false,
    answers: {},
    evaluations: [],
    isEvaluating: false,
    finalReport: null,
    isGeneratingReport: false,
    activeSessionId: null,
  }),
}));
