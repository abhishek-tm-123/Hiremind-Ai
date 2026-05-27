import { NextRequest, NextResponse } from "next/server";
import { generateFinalReport } from "../../../lib/ai-service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { parsedResume, parsedJobDescription, matchAnalysis, questions, answers, evaluations } = body;

    if (!parsedResume || !parsedJobDescription || !matchAnalysis) {
      return NextResponse.json(
        { error: "Missing required interview context data." },
        { status: 400 }
      );
    }

    const report = await generateFinalReport(
      parsedResume,
      parsedJobDescription,
      matchAnalysis,
      questions || [],
      answers || {},
      evaluations || []
    );

    return NextResponse.json({ report });
  } catch (error: any) {
    console.error("Generate report API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate final report." },
      { status: 500 }
    );
  }
}
