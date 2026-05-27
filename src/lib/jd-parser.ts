import { JobDescriptionAnalysis } from "../types/interview";

const JD_SKILL_KEYWORDS = [
  "React", "Next.js", "TypeScript", "JavaScript", "HTML", "CSS", "Tailwind CSS",
  "Node.js", "Express", "NestJS", "Python", "Django", "Flask", "FastAPI",
  "Go", "Golang", "Rust", "Java", "Docker", "Kubernetes", "AWS", "Azure",
  "GCP", "PostgreSQL", "MySQL", "MongoDB", "Redis", "GraphQL", "REST API",
  "WebSockets", "Jest", "Cypress", "Framer Motion", "Monaco Editor",
  "Zustand", "Redux", "CI/CD", "Git", "GitHub"
];

export function parseJobDescription(text: string): JobDescriptionAnalysis {
  const normalizedText = text.toLowerCase();
  
  // 1. Detect target title
  let role = "Frontend Engineer";
  const titles = [
    "frontend developer", "frontend architect", "frontend engineer",
    "backend developer", "backend engineer", "fullstack developer", "fullstack engineer",
    "devops engineer", "software engineer", "cloud architect", "data architect"
  ];
  
  for (const title of titles) {
    if (normalizedText.includes(title)) {
      role = title.replace(/\b\w/g, c => c.toUpperCase());
      break;
    }
  }

  // 2. Detect Seniority Level
  let seniority: "Junior" | "Mid-level" | "Senior" | "Lead" = "Senior";
  if (normalizedText.includes("junior") || normalizedText.includes("entry level") || normalizedText.includes("associate")) {
    seniority = "Junior";
  } else if (normalizedText.includes("lead") || normalizedText.includes("staff") || normalizedText.includes("principal") || normalizedText.includes("director")) {
    seniority = "Lead";
  } else if (normalizedText.includes("mid") || normalizedText.includes("intermediate") || normalizedText.includes("3+ years")) {
    seniority = "Mid-level";
  }

  // 3. Extract skills and group into required / preferred
  const detectedSkills: string[] = [];
  JD_SKILL_KEYWORDS.forEach(skill => {
    const escaped = skill.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, "i");
    if (regex.test(text)) {
      detectedSkills.push(skill);
    }
  });

  // Isolate sentences mentioning "plus", "preferred", "nice to have", "desired" to separate required vs preferred
  const sentences = text.split(/[.!?\n]/).map(s => s.trim()).filter(s => s.length > 0);
  const requiredSkills: string[] = [];
  const preferredSkills: string[] = [];

  detectedSkills.forEach(skill => {
    const isPreferred = sentences.some(sentence => {
      const lowerSentence = sentence.toLowerCase();
      const mentionsSkill = lowerSentence.includes(skill.toLowerCase());
      const hasPreferredKeyword = ["plus", "preferred", "nice to have", "desired", "bonus", "optional"].some(kw => lowerSentence.includes(kw));
      return mentionsSkill && hasPreferredKeyword;
    });

    if (isPreferred) {
      preferredSkills.push(skill);
    } else {
      requiredSkills.push(skill);
    }
  });

  // Fallback default skills if extraction yields none
  if (requiredSkills.length === 0) {
    requiredSkills.push("React", "TypeScript", "CSS");
  }

  // 4. Technologies list
  const technologies = Array.from(new Set([...requiredSkills, ...preferredSkills]));

  // 5. Responsibilities
  const responsibilities: string[] = [];
  const actionKeywords = ["design", "develop", "maintain", "optimize", "lead", "architect", "collaborate", "ensure", "write"];
  
  sentences.forEach(sentence => {
    const startsWithAction = actionKeywords.some(kw => sentence.toLowerCase().startsWith(kw));
    if (startsWithAction && sentence.length > 25 && sentence.length < 150) {
      responsibilities.push(sentence);
    }
  });

  if (responsibilities.length === 0) {
    responsibilities.push(
      "Design and maintain scalable frontend architectures.",
      "Collaborate with backend teams to compile structured REST & WebSockets contracts.",
      "Optimize bundle loading parameters for client web applications."
    );
  }

  return {
    role,
    requiredSkills,
    preferredSkills,
    seniority,
    technologies,
    responsibilities: responsibilities.slice(0, 5)
  };
}
