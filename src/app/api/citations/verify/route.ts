import { NextRequest, NextResponse } from "next/server";
import { verifyCitationText } from "@/lib/citationValidator";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { citationText } = body;

    if (!citationText || typeof citationText !== "string" || citationText.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: "Citation text is required for verification" },
        { status: 400 }
      );
    }

    const result = await verifyCitationText(citationText);

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, message: (err as Error).message || "Verification failed" },
      { status: 500 }
    );
  }
}
