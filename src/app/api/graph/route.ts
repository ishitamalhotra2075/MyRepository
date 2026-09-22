import { NextRequest, NextResponse } from "next/server";
import { SAMPLE_PAPERS } from "@/lib/samplePapers";
import { buildResearchKnowledgeGraph } from "@/lib/researchEngine";
import { Paper } from "@/lib/types";

export async function GET(request: NextRequest) {
  try {
    const graph = buildResearchKnowledgeGraph(SAMPLE_PAPERS);
    return NextResponse.json({
      success: true,
      graph,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, message: (err as Error).message || "Failed to generate graph" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const papers: Paper[] = body.papers && Array.isArray(body.papers) && body.papers.length > 0
      ? body.papers
      : SAMPLE_PAPERS;

    const graph = buildResearchKnowledgeGraph(papers);
    return NextResponse.json({
      success: true,
      graph,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, message: (err as Error).message || "Failed to generate graph" },
      { status: 500 }
    );
  }
}
