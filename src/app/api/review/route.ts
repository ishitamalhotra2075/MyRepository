import { NextRequest, NextResponse } from "next/server";
import { SAMPLE_PAPERS } from "@/lib/samplePapers";
import { generateStructuredLiteratureReview } from "@/lib/researchEngine";
import { Paper } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topic, paperIds, papers: customPapers } = body;

    if (!topic || typeof topic !== "string" || topic.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: "Research topic is required" },
        { status: 400 }
      );
    }

    const availablePapers: Paper[] = customPapers && customPapers.length > 0
      ? customPapers
      : SAMPLE_PAPERS;

    const selectedPapers = paperIds && Array.isArray(paperIds) && paperIds.length > 0
      ? availablePapers.filter(p => paperIds.includes(p.id))
      : availablePapers;

    const review = generateStructuredLiteratureReview(topic, selectedPapers);

    return NextResponse.json({
      success: true,
      review,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, message: (err as Error).message || "Failed to generate literature review" },
      { status: 500 }
    );
  }
}
