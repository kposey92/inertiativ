import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import type { Task } from "@/app/lib/types";

const SuggestionsSchema = z.object({
  suggestions: z
    .array(
      z.object({
        name: z.string(),
        tag: z.enum(["work", "personal", "urgent", "goal"]),
        time: z.string(),
      }),
    )
    .min(1)
    .max(3),
});

const SYSTEM_PROMPT = `You are the AI assistant inside InertiaTIV, a digital planner app.
The user is planning a specific day and may already have tasks scheduled for it. Given that day's
task list and a request, suggest 1-3 new tasks to add to that day's plan.
Each suggestion needs:
- name: a short, actionable task title
- tag: one of "work", "personal", "urgent", or "goal"
- time: a short time-of-day label like "9:00 AM", "Morning", "Afternoon", or "Evening" — never
  relative-day words like "Today" or "Tomorrow", since the task is already pinned to a specific date
Keep suggestions concise, relevant to the request, and complementary to that day's existing tasks.`;

export async function POST(request: Request) {
  let prompt: string;
  let tasks: Task[];
  let date: string | undefined;

  try {
    const body = await request.json();
    prompt = body?.prompt;
    tasks = Array.isArray(body?.tasks) ? body.tasks : [];
    date = typeof body?.date === "string" ? body.date : undefined;
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!prompt || typeof prompt !== "string") {
    return Response.json({ error: "Missing prompt." }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "AI assistant is not configured." }, { status: 500 });
  }

  const client = new Anthropic({ apiKey });

  const taskSummary = tasks
    .map((t) => `- [${t.done ? "x" : " "}] ${t.name} (${t.tag}, ${t.time})`)
    .join("\n");

  const dateLine = date ? `Planning for: ${date}\n` : "";

  try {
    const response = await client.messages.parse({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `${dateLine}Tasks already scheduled for this day:\n${taskSummary || "(none)"}\n\nRequest: ${prompt}`,
        },
      ],
      output_config: {
        format: zodOutputFormat(SuggestionsSchema),
      },
    });

    if (!response.parsed_output) {
      return Response.json({ error: "Could not generate suggestions. Try again." }, { status: 502 });
    }

    return Response.json(response.parsed_output);
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) {
      return Response.json({ error: "Rate limited — try again in a moment." }, { status: 429 });
    }
    if (error instanceof Anthropic.AuthenticationError) {
      return Response.json({ error: "AI assistant is not configured." }, { status: 500 });
    }
    if (error instanceof Anthropic.APIError) {
      return Response.json({ error: "AI assistant is unavailable right now." }, { status: 502 });
    }
    throw error;
  }
}
