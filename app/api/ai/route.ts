import { NextRequest, NextResponse } from "next/server";
import {
  buildStudyCoachPrompt,
  callGroqCoach,
  getHeuristicCoachResponse,
  CoachContext,
} from "@/lib/ai/groq";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      message = "What should I do today?",
      context = {},
      customApiKey,
    }: {
      message: string;
      context: CoachContext;
      customApiKey?: string;
    } = body;

    const apiKey = customApiKey || process.env.GROQ_API_KEY;

    if (apiKey && apiKey.trim() !== "") {
      try {
        const systemPrompt = buildStudyCoachPrompt(context);
        const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ];

        const model = process.env.AI_MODEL || "openai/gpt-oss-120b";
        const reply = await callGroqCoach(messages, apiKey, model);

        return NextResponse.json({
          success: true,
          reply,
          provider: "groq",
          model,
        });
      } catch (groqError: any) {
        console.warn("Groq API call failed, falling back to verified coach guidance:", groqError?.message);
        const fallbackReply = getHeuristicCoachResponse(message, context);
        return NextResponse.json({
          success: true,
          reply: fallbackReply,
          provider: "fallback_heuristic",
          warning: "Live Groq inference temporarily fallback. Provided verified study plan guidance.",
        });
      }
    }

    // No key: return intelligent verified study coach answer
    const reply = getHeuristicCoachResponse(message, context);
    return NextResponse.json({
      success: true,
      reply,
      provider: "fallback_heuristic",
      note: "Provide a GROQ_API_KEY in Settings or .env to activate live Llama 3.3!",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
