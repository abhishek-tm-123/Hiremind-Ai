import { NextRequest, NextResponse } from "next/server";
import { evaluateAnswer } from "../../../lib/ai-service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { question, answer, roundType, context } = body;

    if (!question || !answer) {
      return NextResponse.json(
        { error: "Question and answer are required." },
        { status: 400 }
      );
    }

    const evaluation = await evaluateAnswer(
      question,
      answer,
      roundType || "technical",
      {
        role: context?.role || "Software Engineer",
        skills: context?.skills || [],
        questionId: context?.questionId || "q1",
      }
    );

    console.log("Evaluation:", evaluation);

    return NextResponse.json({ evaluation });
  } catch (error: any) {
    console.error("Evaluate answer API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to evaluate answer." },
      { status: 500 }
    );
  }
}
