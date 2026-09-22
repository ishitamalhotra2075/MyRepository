import { NextRequest, NextResponse } from "next/server";
import { searchOnlineScholarPapers } from "@/lib/scholarSearch";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";

    const results = await searchOnlineScholarPapers(query);

    return NextResponse.json({
      success: true,
      query,
      count: results.length,
      results,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, message: (err as Error).message || "Failed to search scholar papers" },
      { status: 500 }
    );
  }
}
