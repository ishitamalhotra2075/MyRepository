import { NextRequest, NextResponse } from "next/server";
import { SAMPLE_PAPERS } from "@/lib/samplePapers";
import { generateComparisonMatrix } from "@/lib/researchEngine";
import { Paper } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { paperIds, papers: customPapers } = body;

    const availablePapers: Paper[] = customPapers && customPapers.length > 0
      ? customPapers
      : SAMPLE_PAPERS;

    const selectedPapers = paperIds && Array.isArray(paperIds) && paperIds.length > 0
      ? availablePapers.filter(p => paperIds.includes(p.id))
      : availablePapers.slice(0, 3);

    if (selectedPapers.length === 0) {
      return NextResponse.json(
        { success: false, message: "No papers selected for comparison" },
        { status: 400 }
      );
    }

    const matrix = generateComparisonMatrix(selectedPapers);

    return NextResponse.json({
      success: true,
      matrix,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, message: (err as Error).message || "Failed to generate comparison matrix" },
      { status: 500 }
    );
  }
}
