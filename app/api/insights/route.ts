import { NextRequest } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  const { message } = await req.json(); // Still parse the incoming request body
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  // --- Adjusted Prompt for String Output ---
  // Instructing the LLM to return ONLY the JSON array as a plain string
  const prompt = `You are someone who tracks tokens on solana.
  Generate a valid JSON array containing the symbols of 5 potentially interesting or well-known tokens on the Solana network.
  include fartcoin and trump always

  Return ONLY the JSON array string. Do NOT include any surrounding text, markdown formatting (like '''json), or newlines before/after the JSON string.

  Example output format (return this EXACT structure as a plain string):
  ["SOL", "WIF", "BONK"]
  `;
  // --- End Adjusted Prompt ---

  try {
    const response = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that provides information about Solana tokens.",
        },
        {
          role: "user",
          content: prompt, // Use the adjusted prompt
        },
      ],
      // Removed response_format as we are asking for a plain string output
    });

    // Get the content as a string
    const content = response.choices[0].message.content?.trim() || "";

    if (!content) {
         console.error("OpenAI returned empty content.");
          // Even though we return string, use a consistent error structure if possible
         return new Response("Error: OpenAI returned empty content.", { status: 500 });
    }

    console.log("Returning plain string from API:", content);

    // **Modification: Return content as a plain string**
    // We can return it with Content-Type text/plain,
    // or omit headers for default which might be text/plain or application/json
    // depending on framework, but client expects text.
    // Explicitly setting text/plain is clearer.
    return new Response(content, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });

  } catch (openaiError) {
    console.error("Error calling OpenAI API:", openaiError);
     // Return a plain string error message
    if (openaiError instanceof OpenAI.APIError) {
        return new Response(`OpenAI API Error: ${openaiError.status} - ${openaiError.message}`, { status: openaiError.status || 500 });
    }
    return new Response("An error occurred while processing your request.", { status: 500 });
  }
}