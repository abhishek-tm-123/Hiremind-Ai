import { ParsedResume, JobDescriptionAnalysis, MatchAnalysis, InterviewMetadata } from "../types/interview";

export function calculateMatch(resume: ParsedResume, jd: JobDescriptionAnalysis): MatchAnalysis {
  const resumeSkillsLower = new Set(resume.skills.map(s => s.toLowerCase()));
  const jdRequiredLower = jd.requiredSkills.map(s => s.toLowerCase());
  const jdPreferredLower = jd.preferredSkills.map(s => s.toLowerCase());

  // 1. Calculate matching skills
  const matchingSkills: string[] = [];
  const missingSkills: string[] = [];

  // Match against required skills
  jd.requiredSkills.forEach(skill => {
    if (resumeSkillsLower.has(skill.toLowerCase())) {
      matchingSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  });

  // Match against preferred skills
  jd.preferredSkills.forEach(skill => {
    if (resumeSkillsLower.has(skill.toLowerCase())) {
      matchingSkills.push(skill);
    }
  });

  // Calculate required skill score (out of 50)
  let requiredScore = 50;
  if (jdRequiredLower.length > 0) {
    const matchedRequiredCount = jd.requiredSkills.filter(s => resumeSkillsLower.has(s.toLowerCase())).length;
    requiredScore = Math.round((matchedRequiredCount / jdRequiredLower.length) * 50);
  }

  // Calculate preferred skill score (out of 20)
  let preferredScore = 20;
  if (jdPreferredLower.length > 0) {
    const matchedPreferredCount = jd.preferredSkills.filter(s => resumeSkillsLower.has(s.toLowerCase())).length;
    preferredScore = Math.round((matchedPreferredCount / jdPreferredLower.length) * 20);
  }

  // 2. Experience Level Fit Score (out of 30)
  let experienceScore = 15;
  let experienceFit = "Partial alignment with role level.";

  const resumeExp = resume.yearsOfExperience.toLowerCase();
  const jdSeniority = jd.seniority.toLowerCase();

  if (resumeExp.includes("lead") && (jdSeniority.includes("lead") || jdSeniority.includes("senior"))) {
    experienceScore = 30;
    experienceFit = "Strong alignment. Candidate profile exceeds seniority level requirements.";
  } else if (resumeExp.includes("senior") && jdSeniority.includes("senior")) {
    experienceScore = 30;
    experienceFit = "Perfect seniority alignment. Experience fits the requested scope.";
  } else if (resumeExp.includes("mid") && jdSeniority.includes("mid")) {
    experienceScore = 30;
    experienceFit = "Perfect seniority alignment. Candidate matches the required years of experience.";
  } else if (resumeExp.includes("junior") && jdSeniority.includes("junior")) {
    experienceScore = 30;
    experienceFit = "Perfect seniority alignment for entry-level tasks.";
  } else if (resumeExp.includes("junior") && (jdSeniority.includes("senior") || jdSeniority.includes("lead"))) {
    experienceScore = 10;
    experienceFit = "Gap detected. Candidate years of experience is below seniority level requirements.";
  } else {
    experienceScore = 20;
    experienceFit = "Candidate has adequate general domain experience to fill the role.";
  }

  // 3. Compile final score
  const matchPercentage = Math.min(100, requiredScore + preferredScore + experienceScore);

  // 4. Detailed skill gaps description
  const skillGaps: string[] = [];
  if (missingSkills.length > 0) {
    missingSkills.slice(0, 3).forEach(skill => {
      skillGaps.push(`Lacks direct evidence of ${skill} in projects/skills overview.`);
    });
  } else {
    skillGaps.push("No severe tech gaps detected relative to core job requirements.");
  }

  return {
    matchPercentage,
    matchingSkills,
    missingSkills,
    skillGaps,
    experienceFit
  };
}

export function generateInterviewMetadata(
  resume: ParsedResume,
  jd: JobDescriptionAnalysis,
  match: MatchAnalysis,
  difficultySetting: string,
  durationSetting: string
): InterviewMetadata {
  
  // Choose difficulty base
  let difficulty: "Easy" | "Medium" | "Hard" = "Medium";
  if (difficultySetting === "Junior") difficulty = "Easy";
  else if (difficultySetting === "Mid-level") difficulty = "Medium";
  else if (difficultySetting === "Senior" || difficultySetting === "Lead") difficulty = "Hard";

  // Customize Focus Areas
  const focusAreas = match.matchingSkills.slice(0, 4);
  if (focusAreas.length === 0) {
    focusAreas.push("Software engineering practices", "Core language constraints");
  }

  // Customize Weak Areas
  const weakAreas = match.missingSkills.slice(0, 3);
  if (weakAreas.length === 0) {
    weakAreas.push("Advanced architectural decoupling");
  }

  // Setup technical depth guidelines
  let expectedTechnicalDepth = "Intermediate theory, standard hook workflows, and style structures.";
  if (difficulty === "Hard") {
    expectedTechnicalDepth = "Advanced optimization algorithms, bundle sizing reductions, hydration constraints, and distributed state design.";
  } else if (difficulty === "Easy") {
    expectedTechnicalDepth = "Basic syntactical structures, loops, UI components binding, and CSS layouts.";
  }

  // Outline interview rounds based on seniority target
  const rounds: string[] = [];
  if (difficulty === "Hard") {
    rounds.push(
      "Architectural Intro",
      "Advanced System Optimization",
      "Live Coding: useDebounce Implementation",
      "SaaS Scaling & Leadership"
    );
  } else if (difficulty === "Easy") {
    rounds.push(
      "Personal Intro",
      "Core JavaScript Concepts",
      "Live Coding: Simple Debounce",
      "Team Collaboration"
    );
  } else {
    rounds.push(
      "Professional Intro",
      "Technical Problem Solving",
      "Live Coding: hook useDebounce",
      "Behavioral Scenarios"
    );
  }

  return {
    rounds,
    difficulty,
    focusAreas,
    weakAreas,
    expectedTechnicalDepth
  };
}
