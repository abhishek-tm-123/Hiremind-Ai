import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "../../../lib/db";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      id,
      role,
      resumeName,
      matchPercentage,
      difficulty,
      resumeText,
      jobDescriptionText,
      matchAnalysis,
      metadata,
      questions,
      answers,
      evaluations,
      finalReport,
    } = body;

    if (id) {
      // For updates, we only update fields that are provided in the body
      const updateData: any = {};

      if (role !== undefined) updateData.role = role;
      if (resumeName !== undefined) updateData.resumeName = resumeName;
      if (matchPercentage !== undefined) updateData.matchPercentage = matchPercentage;
      if (difficulty !== undefined) updateData.difficulty = difficulty;
      if (resumeText !== undefined) updateData.resumeText = resumeText;
      if (jobDescriptionText !== undefined) updateData.jobDescriptionText = jobDescriptionText;
      if (matchAnalysis !== undefined) updateData.matchAnalysis = JSON.stringify(matchAnalysis);
      if (metadata !== undefined) updateData.metadata = JSON.stringify(metadata);
      if (questions !== undefined) updateData.questions = JSON.stringify(questions);
      if (answers !== undefined) updateData.answers = JSON.stringify(answers);
      if (evaluations !== undefined) updateData.evaluations = JSON.stringify(evaluations);
      if (finalReport !== undefined) updateData.finalReport = finalReport ? JSON.stringify(finalReport) : null;

      const existingSession = await prisma.interviewSession.findFirst({
        where: { id, userId },
      });

      if (!existingSession) {
        return NextResponse.json({ error: "Interview session not found" }, { status: 404 });
      }

      const updated = await prisma.interviewSession.update({
        where: { id },
        data: updateData,
      });
      return NextResponse.json(updated);
    } else {
      // For creation, we provide full data with defaults
      const createData = {
        userId,
        role: role || "Software Engineer",
        resumeName: resumeName || "Resume",
        matchPercentage: typeof matchPercentage === "number" ? matchPercentage : 0,
        difficulty: difficulty || "Senior",
        resumeText: resumeText || null,
        jobDescriptionText: jobDescriptionText || null,
        matchAnalysis: JSON.stringify(matchAnalysis || {}),
        metadata: JSON.stringify(metadata || {}),
        questions: JSON.stringify(questions || []),
        answers: JSON.stringify(answers || {}),
        evaluations: JSON.stringify(evaluations || []),
        finalReport: finalReport ? JSON.stringify(finalReport) : null,
      };

      const created = await prisma.interviewSession.create({
        data: createData,
      });


      return NextResponse.json(created);
    }
  } catch (error: any) {
    console.error("POST /api/interviews error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sessions = await prisma.interviewSession.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    const parsedSessions = sessions.map((s: any) => ({
      ...s,
      matchAnalysis: JSON.parse(s.matchAnalysis),
      metadata: JSON.parse(s.metadata),
      questions: JSON.parse(s.questions),
      answers: JSON.parse(s.answers),
      evaluations: JSON.parse(s.evaluations),
      finalReport: s.finalReport ? JSON.parse(s.finalReport) : null,
    }));

    return NextResponse.json(parsedSessions);
  } catch (error: any) {
    console.error("GET /api/interviews error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
