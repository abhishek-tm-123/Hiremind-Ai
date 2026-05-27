export interface ParsedResume {
  name: string;
  role: string;
  yearsOfExperience: string;
  skills: string[];
  projects: Array<{
    title: string;
    description: string;
    tech: string[];
  }>;
  education: Array<{
    institution: string;
    degree: string;
    year: string;
  }>;
  certifications: string[];
  rawText?: string;
}

export interface JobDescriptionAnalysis {
  role: string;
  requiredSkills: string[];
  preferredSkills: string[];
  seniority: "Junior" | "Mid-level" | "Senior" | "Lead";
  technologies: string[];
  responsibilities: string[];
}

export interface MatchAnalysis {
  matchPercentage: number;
  matchingSkills: string[];
  missingSkills: string[];
  skillGaps: string[];
  experienceFit: string;
}

export interface InterviewMetadata {
  rounds: string[];
  difficulty: "Easy" | "Medium" | "Hard";
  focusAreas: string[];
  weakAreas: string[];
  expectedTechnicalDepth: string;
}

export interface InterviewSession {
  parsedResume: ParsedResume | null;
  jobDescription: JobDescriptionAnalysis | null;
  matchAnalysis: MatchAnalysis | null;
  metadata: InterviewMetadata | null;
}

// Phase 3: AI-generated question types
export interface InterviewQuestion {
  id: string;
  roundIndex: number;
  roundName: string;
  question: string;
  expectedTopics: string[];
  difficulty: "easy" | "medium" | "hard";
}

export interface EvaluationCategoryDetail {
  score: number;
  strengths: string[];
  weaknesses: string[];
  evidence: string;
}

export interface DetailedEvaluation {
  technicalKnowledge?: EvaluationCategoryDetail;
  problemSolving?: EvaluationCategoryDetail;
  communication?: EvaluationCategoryDetail;
  confidence?: EvaluationCategoryDetail;
  architectureUnderstanding?: EvaluationCategoryDetail;
  behavioralMaturity?: EvaluationCategoryDetail;
  depthOfExplanation?: EvaluationCategoryDetail;
  practicalReasoning?: EvaluationCategoryDetail;
}

export interface AnswerEvaluation {
  questionId: string;
  technicalScore: number;
  communicationScore: number;
  confidenceScore: number;
  feedback: string[];
  strengths: string[];
  improvements: string[];
  detailedCategories?: DetailedEvaluation;
}

export interface FinalReport {
  overallScore: number;
  technicalScore: number;
  communicationScore: number;
  confidenceScore: number;
  strengths: string[];
  weaknesses: string[];
  studyRecommendations: Array<{ title: string; description: string }>;
  roundBreakdown: Array<{ round: string; score: number }>;
  missedConcepts?: string[];
  communicationAnalysis?: string;
  suggestedImprovements?: string[];
  hiringRecommendation?: "Strong Hire" | "Hire" | "Borderline" | "No Hire";
}

