import { NextRequest, NextResponse } from "next/server";
import { SAMPLE_PAPERS } from "@/lib/samplePapers";
import { generateChatResponse } from "@/lib/researchEngine";
import { Paper } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, paperIds, papers: customPapers } = body;

    if (!query || typeof query !== "string" || query.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: "Chat query cannot be empty" },
        { status: 400 }
      );
    }

    const availablePapers: Paper[] = customPapers && customPapers.length > 0
      ? customPapers
      : SAMPLE_PAPERS;

    const selectedPapers = paperIds && Array.isArray(paperIds) && paperIds.length > 0
      ? availablePapers.filter(p => paperIds.includes(p.id))
      : availablePapers.slice(0, 2);

    const message = generateChatResponse(query, selectedPapers);

    return NextResponse.json({
      success: true,
      message,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, message: (err as Error).message || "Internal server error" },
      { status: 500 }
    );
  }
}
