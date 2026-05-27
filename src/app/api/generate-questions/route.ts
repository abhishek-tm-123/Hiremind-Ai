import { NextRequest, NextResponse } from "next/server";
import { generateInterviewQuestions } from "../../../lib/ai-service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { parsedResume, parsedJobDescription, matchAnalysis, interviewMetadata, difficulty, duration } = body;

    if (!parsedResume || !parsedJobDescription || !matchAnalysis || !interviewMetadata) {
      return NextResponse.json(
        { error: "Missing required interview context data." },
        { status: 400 }
      );
    }

    const questions = await generateInterviewQuestions(
      parsedResume,
      parsedJobDescription,
      matchAnalysis,
      interviewMetadata,
      difficulty || "Senior",
      duration || "30 mins"
    );

    return NextResponse.json({ questions });
  } catch (error: any) {
    console.error("Generate questions API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate interview questions." },
      { status: 500 }
    );
  }
}
