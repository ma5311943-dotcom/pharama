import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { messages } = await req.json();

    const apiKey = process.env.GROK_API_KEY || process.env.NEXT_PUBLIC_GROK_API_KEY;
    const apiUrl = process.env.GROK_API_URL || process.env.NEXT_PUBLIC_GROK_API_URL || 'https://api.groq.com/openai/v1/chat/completions';

    if (!apiKey) {
      return NextResponse.json({ error: "Missing API Key" }, { status: 401 });
    }

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: messages,
        temperature: 0.7,
        max_tokens: 512,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch from Groq API");
    }

    const data = await response.json();
    return NextResponse.json({ text: data?.choices?.[0]?.message?.content?.trim() });

  } catch (error) {
    console.error("AI API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
