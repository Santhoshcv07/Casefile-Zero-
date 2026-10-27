import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import {
  buildSuspectSystemPrompt,
  getDeterministicFallbackAnswer,
  ChatHistoryItem,
} from "../../lib/interrogationPrompts";

interface InterrogateRequestBody {
  suspectId?: string;
  question?: string;
  history?: ChatHistoryItem[];
  discoveredClueIds?: string[];
  topicId?: string | null;
}

export async function POST(request: Request) {
  let body: InterrogateRequestBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON request body", isFallback: true },
      { status: 400 }
    );
  }

  const { suspectId, question, history = [], discoveredClueIds = [], topicId } = body;

  if (!suspectId || !question || typeof question !== "string") {
    return NextResponse.json(
      { error: "Missing required suspectId or question", isFallback: true },
      { status: 400 }
    );
  }

  // Fallback answer computed upfront in case of missing key or API failure
  const fallbackAnswer = getDeterministicFallbackAnswer(suspectId, question, topicId);

  // Server-only API key access — never leaked or passed to client
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey || apiKey.trim() === "") {
    // Graceful fallback when API key is not configured
    return NextResponse.json({
      answer: fallbackAnswer,
      isFallback: true,
      reason: "GROQ_API_KEY is not configured in environment",
    });
  }

  try {
    const groq = new Groq({ apiKey: apiKey.trim() });
    const { systemPrompt } = buildSuspectSystemPrompt(suspectId, discoveredClueIds);

    // Format recent chat history (last 6 exchanges) for conversational continuity
    const formattedHistory: Array<{ role: "system" | "user" | "assistant"; content: string }> = [];
    const recentHistory = Array.isArray(history) ? history.slice(-6) : [];

    for (const msg of recentHistory) {
      if (msg.role === "detective" && msg.text) {
        formattedHistory.push({ role: "user", content: msg.text });
      } else if (msg.role === "suspect" && msg.text) {
        formattedHistory.push({ role: "assistant", content: msg.text });
      }
    }

    const primaryModel = process.env.GROQ_MODEL || "qwen/qwen3.8-27b";
    const modelsToTry = [
      primaryModel,
      "qwen/qwen3.8-27b",
      "openai/gpt-oss-120b",
      "llama-3.3-70b-versatile",
    ].filter((m, idx, arr) => arr.indexOf(m) === idx);

    let completion = null;
    let successfulModel = primaryModel;
    let lastModelError: unknown = null;

    for (const modelCandidate of modelsToTry) {
      try {
        completion = await groq.chat.completions.create({
          model: modelCandidate,
          messages: [
            { role: "system", content: systemPrompt },
            ...formattedHistory,
            { role: "user", content: question },
          ],
          temperature: 0.65,
          max_tokens: 300,
        });
        successfulModel = modelCandidate;
        break;
      } catch (err: unknown) {
        lastModelError = err;
        const msg = err instanceof Error ? err.message : "";
        if (
          msg.includes("model_not_found") ||
          msg.includes("does not exist") ||
          msg.includes("decommissioned")
        ) {
          continue;
        }
        throw err;
      }
    }

    if (!completion) {
      throw lastModelError || new Error("All Groq model candidates failed");
    }

    const aiAnswer = completion.choices[0]?.message?.content?.trim();

    if (!aiAnswer) {
      return NextResponse.json({
        answer: fallbackAnswer,
        isFallback: true,
        reason: "Empty response from Groq completions",
      });
    }

    return NextResponse.json({
      answer: aiAnswer,
      isFallback: false,
      model: successfulModel,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown Groq error";
    console.error("Groq Interrogation Completion Error:", errorMessage);

    // Gracefully degrade to deterministic dialogue on any Groq error (rate limits, network, auth)
    return NextResponse.json({
      answer: fallbackAnswer,
      isFallback: true,
      error: errorMessage,
    });
  }
}
