import Groq from "groq-sdk";

import {
  ParsedResume,
  JobDescriptionAnalysis,
  MatchAnalysis,
  InterviewMetadata,
  InterviewQuestion,
  AnswerEvaluation,
  FinalReport,
} from "../types/interview";

// Initialize Groq client
function getClient(): Groq | null {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    console.error("Missing GROQ_API_KEY");
    return null;
  }

  return new Groq({
    apiKey,
  });
}
// ─── Helper: safe JSON parse from LLM output ───
function extractJSON(text: string): any {
  // Try direct parse first
  try {
    return JSON.parse(text);
  } catch {
    // Extract JSON from markdown code blocks
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[1].trim());
      } catch {
        // fall through
      }
    }
    // Try finding first { to last }
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start !== -1 && end !== -1 && end > start) {
      try {
        return JSON.parse(text.slice(start, end + 1));
      } catch {
        // fall through
      }
    }
    // Try finding first [ to last ]
    const arrStart = text.indexOf("[");
    const arrEnd = text.lastIndexOf("]");
    if (arrStart !== -1 && arrEnd !== -1 && arrEnd > arrStart) {
      try {
        return JSON.parse(text.slice(arrStart, arrEnd + 1));
      } catch {
        // fall through
      }
    }
    return null;
  }
}



// ─── HELPER: ROUND PROGRESSION ───
export function getRoundForQuestionIndex(index: number, duration: string): { roundIdx: number; roundName: string } {
  let intro = 3, tech = 5, code = 2, beh = 3;
  const d = duration ? duration.toLowerCase() : "";
  if (d.includes("15")) {
    intro = 2; tech = 3; code = 1; beh = 2;
  } else if (d.includes("45")) {
    intro = 3; tech = 7; code = 2; beh = 4;
  } else if (d.includes("60")) {
    intro = 4; tech = 10; code = 3; beh = 5;
  }
  
  if (index < intro) return { roundIdx: 0, roundName: "Introduction" };
  if (index < intro + tech) return { roundIdx: 1, roundName: "Technical Deep Dive" };
  if (index < intro + tech + code) return { roundIdx: 2, roundName: "Coding & Problem Solving" };
  return { roundIdx: 3, roundName: "Behavioral" };
}

// ─── 1. GENERATE INTERVIEW QUESTIONS ───

export async function generateInterviewQuestions(
  resume: ParsedResume,
  jd: JobDescriptionAnalysis,
  match: MatchAnalysis,
  metadata: InterviewMetadata,
  difficulty: string,
  duration: string
): Promise<InterviewQuestion[]> {
  // Generate the very first question dynamically
  const firstQuestion = await generateNextQuestion(
    resume,
    jd,
    match,
    metadata,
    difficulty,
    duration,
    "Mixed",
    [],
    {}
  );
  return [firstQuestion];
}

export async function generateNextQuestion(
  resume: ParsedResume,
  jd: JobDescriptionAnalysis,
  match: MatchAnalysis,
  metadata: InterviewMetadata,
  difficulty: string,
  duration: string,
  type: string,
  questionsAskedSoFar: InterviewQuestion[],
  answersSubmittedSoFar: Record<string, string>
): Promise<InterviewQuestion> {
  const client = getClient();
  const nextIdx = questionsAskedSoFar.length;
  const { roundIdx, roundName } = getRoundForQuestionIndex(nextIdx, duration);

  if (!client) {
    const fallbacks = getFallbackQuestions(resume, jd, match, metadata);
    const fallbackQ = fallbacks[roundIdx % fallbacks.length];
    return {
      id: `q${nextIdx + 1}`,
      roundIndex: roundIdx,
      roundName,
      question: fallbackQ.question,
      expectedTopics: fallbackQ.expectedTopics,
      difficulty: "medium",
    };
  }

  // Construct history context
  let historyContext = "";
  if (questionsAskedSoFar.length > 0) {
    historyContext = questionsAskedSoFar
      .map((q, idx) => {
        const answer = answersSubmittedSoFar[q.id] || "(No answer provided)";
        return `Question ${idx + 1} [Round: ${q.roundName}]: "${q.question}"\nCandidate Answer: "${answer}"\n`;
      })
      .join("\n");
  }

  let roundSpecificPrompt = "";
  if (roundIdx === 0) {
    roundSpecificPrompt = `This is the Introduction Round. Focus on:
- Walkthrough of their resume and self introduction.
- Highlights of key projects from their resume.
- Career goals, motivation, and fit for the role.
Ask a warm-up or introductory question.`;
  } else if (roundIdx === 1) {
    roundSpecificPrompt = `This is the Project / Technical Deep Dive Round. Focus on:
- Resume skills, target job description requirements, and matching/missing skills.
- IMPORTANT: If the candidate answered a technical question recently, ask a direct CONTEXTUAL follow-up question (e.g. why they chose a technology, trade-offs, scalability, edge case handling, performance, SSR vs React, DB indexes, etc.) to probe deeper.
- Keep the discussion natural, conversational, and technical.`;
  } else if (roundIdx === 2) {
    roundSpecificPrompt = `This is the Coding & Problem Solving Round. Focus on:
- Presenting a concrete, practical programming challenge (React, APIs, database reasoning, DSA, debugging).
- Must have clear inputs, expected output/behavior, and constraints.
- Make sure the coding question fits the candidate's core stack (e.g., React/JS for frontend, node/SQL for backend) and matches difficulty: ${difficulty}.`;
  } else {
    roundSpecificPrompt = `This is the Behavioral Round. Focus on:
- Situational questions probing communication, teamwork, conflict handling, leadership, learning agility, ownership, or decision making.
- Use the STAR format context.`;
  }

  const prompt = `You are a technical interviewer conducting a live mock interview.
Candidate: ${resume.name}
Target Role: ${jd.role} (${jd.seniority})
Configured Difficulty: ${difficulty}
Configured Duration: ${duration}
Interview Type Focus: ${type}

CANDIDATE SKILLS: ${resume.skills.join(", ")}
MATCHING SKILLS: ${match.matchingSkills.join(", ")}
MISSING SKILLS: ${match.missingSkills.join(", ")}

INTERVIEW HISTORY SO FAR:
${historyContext || "None (this is the starting of the interview)"}

ROUND CONTEXT:
${roundSpecificPrompt}

Generate the NEXT single question (Question #${nextIdx + 1}) for the candidate.
The question must:
1. Sound highly professional and realistic (not like a generic quiz question).
2. Directly fit the round: "${roundName}".
3. Adjust difficulty dynamically based on "${difficulty}".
   - Junior: basic reasoning, debugging, fundamentals.
   - Mid-level: scalability, tradeoffs, performance.
   - Senior/Lead: high-level architecture decisions, system design, leadership.
4. If this is a follow-up, refer to their previous answer naturally (e.g., "You mentioned that you used Redis for caching. How did you handle cache invalidation?").

Return ONLY a valid JSON object matching this schema:
{
  "id": "q${nextIdx + 1}",
  "roundName": "${roundName}",
  "question": "Question text...",
  "expectedTopics": ["topic1", "topic2"],
  "difficulty": "easy|medium|hard"
}
`;

  try {
    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 1.0,
      messages: [
        { role: "system", content: "You are a professional technical interviewer." },
        { role: "user", content: prompt },
      ],
    });

    const text = response.choices[0]?.message?.content || "";
    const parsed = extractJSON(text);

    if (parsed && parsed.question) {
      return {
        id: parsed.id || `q${nextIdx + 1}`,
        roundIndex: roundIdx,
        roundName: parsed.roundName || roundName,
        question: parsed.question,
        expectedTopics: Array.isArray(parsed.expectedTopics) ? parsed.expectedTopics : [],
        difficulty: parsed.difficulty || "medium",
      };
    }
  } catch (error) {
    console.error("Failed to generate next question:", error);
  }

  // Fallback
  return {
    id: `q${nextIdx + 1}`,
    roundIndex: roundIdx,
    roundName,
    question: `Could you tell me more about how you handle architectural tradeoffs, specifically relating to ${match.matchingSkills[0] || "web development"}?`,
    expectedTopics: ["tradeoffs", "architecture"],
    difficulty: "medium",
  };
}




// ─── 2. EVALUATE A SINGLE ANSWER ───

export async function evaluateAnswer(
  question: string,
  answer: string,
  roundType: string,
  context: { role: string; skills: string[]; questionId: string; expectedTopics?: string[] }
): Promise<AnswerEvaluation> {
  const client = getClient();

  if (!client || !answer.trim()) {
    return getHeuristicEvaluation(question, answer, context.questionId, context.expectedTopics, context.skills);
  }

  const prompt = `You are an expert AI interview evaluator assessing a candidate for a ${context.role} role.

QUESTION (${roundType} round):
"${question}"

CANDIDATE'S ANSWER:
"${answer}"

RELEVANT SKILLS CONTEXT: ${context.skills.join(", ")}

Evaluate the candidate's answer across the following 8 dimensions:
1. technicalKnowledge: understanding of language/framework concepts
2. problemSolving: structure of logic, debugging capability
3. communication: clarity, conciseness, progression
4. confidence: assertiveness, lack of hesitation/hedging
5. architectureUnderstanding: knowledge of systems, data-flow, scaling
6. behavioralMaturity: teamwork, ownership, handling challenges
7. depthOfExplanation: provides details, trade-offs, does not stay surface-level
8. practicalReasoning: real-world applicability of decisions

For EACH of the 8 dimensions, provide:
- score (0-100)
- strengths (1-2 bullet points)
- weaknesses (1-2 bullet points)
- evidence (direct quote or reasoning from their answer explaining the score)

Also calculate the overall averages for:
- technicalScore (average of technicalKnowledge, architectureUnderstanding, practicalReasoning)
- communicationScore (average of communication, depthOfExplanation)
- confidenceScore (average of confidence, behavioralMaturity, problemSolving)

Include general lists for:
- feedback: 2-3 general observations
- strengths: 1-2 positive notes
- improvements: 1-2 points to improve

Return ONLY valid JSON matching this schema:
{
  "questionId": "${context.questionId}",
  "technicalScore": 85,
  "communicationScore": 80,
  "confidenceScore": 78,
  "feedback": ["observation1", "observation2"],
  "strengths": ["strength1"],
  "improvements": ["improvement1"],
  "detailedCategories": {
    "technicalKnowledge": { "score": 85, "strengths": ["s1"], "weaknesses": ["w1"], "evidence": "ev1" },
    "problemSolving": { "score": 80, "strengths": ["s1"], "weaknesses": ["w1"], "evidence": "ev1" },
    "communication": { "score": 82, "strengths": ["s1"], "weaknesses": ["w1"], "evidence": "ev1" },
    "confidence": { "score": 75, "strengths": ["s1"], "weaknesses": ["w1"], "evidence": "ev1" },
    "architectureUnderstanding": { "score": 80, "strengths": ["s1"], "weaknesses": ["w1"], "evidence": "ev1" },
    "behavioralMaturity": { "score": 85, "strengths": ["s1"], "weaknesses": ["w1"], "evidence": "ev1" },
    "depthOfExplanation": { "score": 78, "strengths": ["s1"], "weaknesses": ["w1"], "evidence": "ev1" },
    "practicalReasoning": { "score": 88, "strengths": ["s1"], "weaknesses": ["w1"], "evidence": "ev1" }
  }
}`;

  try {
    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content: "You are an expert technical interviewer evaluating candidates.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const text = response.choices[0]?.message?.content || "";
    const parsed = extractJSON(text);

    if (parsed && typeof parsed.technicalScore === "number") {
      return {
        questionId: context.questionId,
        technicalScore: clamp(parsed.technicalScore, 0, 100),
        communicationScore: clamp(parsed.communicationScore, 0, 100),
        confidenceScore: clamp(parsed.confidenceScore, 0, 100),
        feedback: Array.isArray(parsed.feedback) ? parsed.feedback : [],
        strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
        improvements: Array.isArray(parsed.improvements) ? parsed.improvements : [],
        detailedCategories: parsed.detailedCategories || {},
      };
    }

    return getHeuristicEvaluation(question, answer, context.questionId, context.expectedTopics, context.skills);
  } catch (error) {
    console.error("Evaluation error:", error);
    return getHeuristicEvaluation(question, answer, context.questionId, context.expectedTopics, context.skills);
  }
}

// ─── 3. GENERATE FINAL REPORT ───

export async function generateFinalReport(
  resume: ParsedResume,
  jd: JobDescriptionAnalysis,
  match: MatchAnalysis,
  questions: InterviewQuestion[],
  answers: Record<string, string>,
  evaluations: AnswerEvaluation[]
): Promise<FinalReport> {
  const client = getClient();

  if (!client || evaluations.length === 0) {
    return getFallbackReport(match, evaluations);
  }

  // Build Q&A summary
  const qaSummary = questions
    .map((q, idx) => {
      const ans = answers[q.id] || "(no answer)";
      const ev = evaluations.find((e) => e.questionId === q.id);
      return `Round ${idx + 1} (${q.roundName}):
Q: ${q.question}
A: ${ans}
${ev ? `Scores - Technical: ${ev.technicalScore}, Communication: ${ev.communicationScore}, Confidence: ${ev.confidenceScore}` : "Not evaluated"}`;
    })
    .join("\n\n");

  const prompt = `You are an expert AI interview evaluator writing a comprehensive assessment report.

CANDIDATE: ${resume.name} (${resume.role}, ${resume.yearsOfExperience})
TARGET ROLE: ${jd.role} (${jd.seniority})
RESUME-JOB MATCH: ${match.matchPercentage}%

INTERVIEW TRANSCRIPT:
${qaSummary}

Generate a comprehensive final report. Calculate overall scores.
Also determine:
1. hiringRecommendation: One of "Strong Hire", "Hire", "Borderline", "No Hire".
2. missedConcepts: A list of technical concepts, frameworks, or key details the candidate struggled with or failed to mention when expected.
3. communicationAnalysis: A paragraph summarizing their overall communication style, structure, clarity, and confidence.
4. suggestedImprovements: Specific actionable items to improve their performance.

Return ONLY valid JSON matching this schema:
{
  "overallScore": 85,
  "technicalScore": 88,
  "communicationScore": 82,
  "confidenceScore": 80,
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"],
  "studyRecommendations": [
    { "title": "Topic Name", "description": "Why and what to study" }
  ],
  "roundBreakdown": [
    { "round": "Round Name", "score": 85 }
  ],
  "missedConcepts": ["concept1", "concept2"],
  "communicationAnalysis": "Overall communication summary...",
  "suggestedImprovements": ["improvement1", "improvement2"],
  "hiringRecommendation": "Strong Hire"
}`;

  try {
    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.8,
      messages: [
        {
          role: "system",
          content: "You are an expert AI interview report evaluator.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const text = response.choices[0]?.message?.content || "";
    const parsed = extractJSON(text);

    if (parsed && typeof parsed.overallScore === "number") {
      return {
        overallScore: clamp(parsed.overallScore, 0, 100),
        technicalScore: clamp(parsed.technicalScore, 0, 100),
        communicationScore: clamp(parsed.communicationScore, 0, 100),
        confidenceScore: clamp(parsed.confidenceScore, 0, 100),
        strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
        weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses : [],
        studyRecommendations: Array.isArray(parsed.studyRecommendations)
          ? parsed.studyRecommendations
          : [],
        roundBreakdown: Array.isArray(parsed.roundBreakdown)
          ? parsed.roundBreakdown
          : [],
        missedConcepts: Array.isArray(parsed.missedConcepts) ? parsed.missedConcepts : [],
        communicationAnalysis: parsed.communicationAnalysis || "",
        suggestedImprovements: Array.isArray(parsed.suggestedImprovements) ? parsed.suggestedImprovements : [],
        hiringRecommendation: parsed.hiringRecommendation || "Borderline",
      };
    }

    return getFallbackReport(match, evaluations);
  } catch (error) {
    console.error("Report generation error:", error);
    return getFallbackReport(match, evaluations);
  }
}

// ─── FALLBACK GENERATORS (no API key) ───

function getFallbackQuestions(
  resume: ParsedResume,
  jd: JobDescriptionAnalysis,
  match: MatchAnalysis,
  metadata: InterviewMetadata
): InterviewQuestion[] {
  const skill1 = resume.skills[0] || "React";
  const skill2 = resume.skills[1] || "TypeScript";
  const jdSkill = jd.requiredSkills[0] || "JavaScript";
  const missingSkill = match.missingSkills[0] || "system design";

  return [
    {
      id: "q1",
      roundIndex: 0,
      roundName: metadata.rounds[0] || "Introduction",
      question: `Welcome! Your resume highlights experience with ${skill1} and ${skill2}. Walk me through your most impactful project and explain the architectural decisions you made.`,
      expectedTopics: ["project overview", "architecture", "trade-offs"],
      difficulty: "easy",
    },
    {
      id: "q2",
      roundIndex: 1,
      roundName: metadata.rounds[1] || "Technical",
      question: `The ${jd.role} role requires deep expertise in ${jdSkill}. Explain how you would design a scalable, real-time data pipeline using ${jdSkill}, considering edge cases like network failures and data consistency.`,
      expectedTopics: [jdSkill, "scalability", "error handling", "data consistency"],
      difficulty: "hard",
    },
    {
      id: "q3",
      roundIndex: 2,
      roundName: metadata.rounds[2] || "Coding",
      question: `Implement a custom React hook called \`useDebounce\` that takes a value and delay parameter. It should defer updating the returned value until after the specified delay. Include proper cleanup on unmount.`,
      expectedTopics: ["React hooks", "useEffect", "setTimeout", "cleanup"],
      difficulty: "medium",
    },
    {
      id: "q4",
      roundIndex: 3,
      roundName: metadata.rounds[3] || "Behavioral",
      question: `We noticed ${missingSkill} is a gap relative to the job requirements. Tell me about a time you had to rapidly learn a new technology or fill a skill gap under pressure. What was your approach and what was the outcome?`,
      expectedTopics: ["learning agility", "adaptability", "growth mindset"],
      difficulty: "medium",
    },
  ];
}

function getHeuristicEvaluation(
  question: string,
  answer: string,
  questionId: string,
  expectedTopics?: string[],
  skills?: string[]
): AnswerEvaluation {
  const cleanAnswer = answer.trim().toLowerCase();

  if (!cleanAnswer || cleanAnswer.length < 10) {
    return {
      questionId,
      technicalScore: 20,
      communicationScore: 30,
      confidenceScore: 25,
      feedback: [
        "The answer was extremely brief or empty.",
        "Ensure you provide a detailed description of your experience and methodology."
      ],
      strengths: ["Brevity."],
      improvements: ["Provide more details, examples, and technical depth."]
    };
  }

  // Calculate technical score based on length and keywords matching expected topics/skills
  let techPoints = 40;

  // Length points
  if (cleanAnswer.length > 200) techPoints += 15;
  else if (cleanAnswer.length > 100) techPoints += 10;
  else if (cleanAnswer.length > 50) techPoints += 5;

  // Keyword match points
  const topicsToTest = expectedTopics && expectedTopics.length > 0
    ? expectedTopics
    : ["architecture", "scaling", "react", "next.js", "state", "optimization", "clean", "design", "conflict", "team"];

  let matchedTopicsCount = 0;
  topicsToTest.forEach(topic => {
    if (cleanAnswer.includes(topic.toLowerCase())) {
      techPoints += 8;
      matchedTopicsCount++;
    }
  });

  const skillsToTest = skills || [];
  skillsToTest.forEach(skill => {
    if (cleanAnswer.includes(skill.toLowerCase())) {
      techPoints += 5;
    }
  });

  // Clamp techPoints
  const technicalScore = Math.min(96, Math.max(35, techPoints));

  // Communication score based on length, punctuation, structure
  let commPoints = 50;
  const sentenceCount = cleanAnswer.split(/[.!?]+/).filter(Boolean).length;
  if (sentenceCount >= 4) commPoints += 20;
  else if (sentenceCount >= 2) commPoints += 10;

  // Filler words detection (hedging/weak communication)
  const fillers = ["like", "maybe", "probably", "i think", "actually", "just", "basically", "sort of", "kind of"];
  let fillerCount = 0;
  fillers.forEach(word => {
    const matches = cleanAnswer.match(new RegExp(`\\b${word}\\b`, "g"));
    if (matches) {
      fillerCount += matches.length;
    }
  });

  commPoints -= Math.min(15, fillerCount * 3);
  const communicationScore = Math.min(95, Math.max(40, commPoints));

  // Confidence score
  let confPoints = 65;
  // Strong assertive words
  const strongWords = ["definitely", "resolved", "implemented", "scalable", "designed", "achieved", "successfully", "optimized"];
  strongWords.forEach(word => {
    if (cleanAnswer.includes(word)) {
      confPoints += 4;
    }
  });

  // Weak/hedging words
  const weakWords = ["not sure", "guess", "don't know", "try to", "maybe", "hope"];
  weakWords.forEach(word => {
    if (cleanAnswer.includes(word)) {
      confPoints -= 6;
    }
  });

  const confidenceScore = Math.min(97, Math.max(35, confPoints));

  // Dynamic feedback comments
  const feedback: string[] = [];
  const strengths: string[] = [];
  const improvements: string[] = [];

  if (matchedTopicsCount > 0) {
    feedback.push(`Addressed relevant topics: ${topicsToTest.filter(t => cleanAnswer.includes(t.toLowerCase())).slice(0, 3).join(", ")}.`);
    strengths.push("Good inclusion of key concepts related to the question.");
  } else {
    feedback.push("The response could stay closer to the specific requested topics.");
    improvements.push("Ensure you directly answer all components of the prompt.");
  }

  if (sentenceCount >= 3) {
    feedback.push("Structure is cohesive and flows naturally.");
    strengths.push("Solid structured response organization.");
  } else {
    feedback.push("Response structure is somewhat fragmented.");
    improvements.push("Elaborate further using the STAR framework (Situation, Task, Action, Result).");
  }

  if (fillerCount > 2) {
    improvements.push("Minimize usage of filler words to project authority.");
  }

  if (strengths.length === 0) strengths.push("Articulated details in a concise format.");
  if (improvements.length === 0) improvements.push("Explain potential trade-offs of chosen decisions.");

  return {
    questionId,
    technicalScore,
    communicationScore,
    confidenceScore,
    feedback: feedback.slice(0, 3),
    strengths: strengths.slice(0, 2),
    improvements: improvements.slice(0, 2)
  };
}

function getFallbackReport(
  match: MatchAnalysis,
  evaluations: AnswerEvaluation[]
): FinalReport {
  const avgTech = evaluations.length
    ? Math.round(evaluations.reduce((s, e) => s + e.technicalScore, 0) / evaluations.length)
    : 82;
  const avgComm = evaluations.length
    ? Math.round(evaluations.reduce((s, e) => s + e.communicationScore, 0) / evaluations.length)
    : 78;
  const avgConf = evaluations.length
    ? Math.round(evaluations.reduce((s, e) => s + e.confidenceScore, 0) / evaluations.length)
    : 76;
  const overall = Math.round((avgTech * 0.45 + avgComm * 0.3 + avgConf * 0.25));

  return {
    overallScore: overall,
    technicalScore: avgTech,
    communicationScore: avgComm,
    confidenceScore: avgConf,
    strengths: [
      `Strong competency in ${match.matchingSkills.slice(0, 3).join(", ")}.`,
      "Demonstrated clear communication patterns across interview rounds.",
      "Good problem-solving approach in the coding assessment.",
    ],
    weaknesses: [
      `Missing depth in ${match.missingSkills.slice(0, 2).join(" and ") || "advanced system design"}.`,
      "Could improve on quantifying impact in behavioral examples.",
    ],
    studyRecommendations: [
      { title: "Advanced System Design Patterns", description: "Study distributed architectures, event-driven systems, and microservices patterns." },
      { title: "STAR Behavioral Framework", description: "Practice structuring answers with Situation, Task, Action, Result format." },
      { title: "Performance Optimization", description: "Deepen understanding of React rendering pipeline, memoization, and bundle optimization." },
    ],
    roundBreakdown: [
      { round: "Introduction", score: Math.min(100, overall + 5) },
      { round: "Technical", score: avgTech },
      { round: "Coding", score: Math.min(100, avgTech + 3) },
      { round: "Behavioral", score: avgComm },
    ],
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
