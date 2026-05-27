import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "../../../../lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const session = await prisma.interviewSession.findFirst({
      where: { id, userId },
    });

    if (!session) {
      return NextResponse.json({ error: "Interview session not found" }, { status: 404 });
    }

    const parsedSession = {
      ...session,
      matchAnalysis: JSON.parse(session.matchAnalysis),
      metadata: JSON.parse(session.metadata),
      questions: JSON.parse(session.questions),
      answers: JSON.parse(session.answers),
      evaluations: JSON.parse(session.evaluations),
      finalReport: session.finalReport ? JSON.parse(session.finalReport) : null,
    };

    return NextResponse.json(parsedSession);
  } catch (error: any) {
    console.error("GET /api/interviews/[id] error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
