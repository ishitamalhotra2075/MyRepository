import { NextRequest, NextResponse } from "next/server";
import { auditAcademicText, generateAutocompleteSuggestion, paraphraseAcademic } from "@/lib/paperpalAuditor";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, text, mode, context } = body;

    if (!text && !context) {
      return NextResponse.json(
        { success: false, message: "Text or context is required" },
        { status: 400 }
      );
    }

    if (action === "audit") {
      const audit = auditAcademicText(text || "");
      return NextResponse.json({ success: true, audit });
    }

    if (action === "autocomplete") {
      const suggestion = generateAutocompleteSuggestion(context || text || "");
      return NextResponse.json({ success: true, suggestion });
    }

    if (action === "paraphrase") {
      const paraphrased = paraphraseAcademic(text || "", mode || "academic");
      return NextResponse.json({ success: true, paraphrased });
    }

    return NextResponse.json(
      { success: false, message: "Invalid action. Supported: audit, autocomplete, paraphrase" },
      { status: 400 }
    );
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, message: (err as Error).message || "Writing service error" },
      { status: 500 }
    );
  }
}
