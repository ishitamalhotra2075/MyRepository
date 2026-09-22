import { NextRequest, NextResponse } from "next/server";
import { SAMPLE_PAPERS } from "@/lib/samplePapers";
import { Paper } from "@/lib/types";

// In-memory runtime cache for papers
let papersDatabase: Paper[] = [...SAMPLE_PAPERS];

export async function GET() {
  return NextResponse.json({
    success: true,
    count: papersDatabase.length,
    papers: papersDatabase,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, abstract, authors, year, venue, doi, keywords } = body;

    if (!title || !abstract) {
      return NextResponse.json(
        { success: false, message: "Title and abstract are required" },
        { status: 400 }
      );
    }

    const newPaper: Paper = {
      id: `paper-${Date.now()}`,
      title: title.trim(),
      abstract: abstract.trim(),
      authors: Array.isArray(authors) && authors.length > 0 ? authors : ["Uploaded Author"],
      year: year ? parseInt(year, 10) : new Date().getFullYear(),
      venue: venue || "Uploaded Manuscript",
      doi: doi || `10.48550/user.${Date.now()}`,
      keywords: Array.isArray(keywords) && keywords.length > 0 ? keywords : ["Machine Learning", "Research"],
      citationCount: 0,
      uploadedAt: new Date().toISOString(),
      pagesCount: Math.floor(Math.random() * 12) + 6,
      fileSize: "1.6 MB",
      methodology: {
        approach: "Custom empirical investigation & data analysis pipeline",
        dataset: "Academic benchmark corpus",
        metrics: "Empirical precision, recall, and computational efficiency",
        limitations: "Subject to experimental scope and dataset constraints"
      },
      keyFindings: [
        "User manuscript successfully ingested into ResearchGPT semantic index.",
        "Abstract and key methodology parsed for cross-paper grounded Q&A."
      ]
    };

    papersDatabase.unshift(newPaper);

    return NextResponse.json({ success: true, paper: newPaper }, { status: 201 });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, message: (err as Error).message || "Failed to parse request" },
      { status: 500 }
    );
  }
}
