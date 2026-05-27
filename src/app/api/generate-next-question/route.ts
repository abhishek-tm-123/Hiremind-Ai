import { NextRequest, NextResponse } from "next/server";
import { generateNextQuestion } from "../../../lib/ai-service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      parsedResume,
      parsedJobDescription,
      matchAnalysis,
      interviewMetadata,
      difficulty,
      duration,
      type,
      questions,
      answers,
    } = body;

    if (!parsedResume || !parsedJobDescription || !matchAnalysis || !interviewMetadata) {
      return NextResponse.json(
        { error: "Missing required interview context data." },
        { status: 400 }
      );
    }

    const nextQuestion = await generateNextQuestion(
      parsedResume,
      parsedJobDescription,
      matchAnalysis,
      interviewMetadata,
      difficulty || "Senior",
      duration || "30 mins",
      type || "Mixed",
      questions || [],
      answers || {}
    );

    return NextResponse.json({ question: nextQuestion });
  } catch (error: any) {
    console.error("Generate next question API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate next question." },
      { status: 500 }
    );
  }
}
