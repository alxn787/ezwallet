/* eslint-disable */

import OpenAI from "openai";

export async function POST() {
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

  // Default fallback response when OpenAI is unavailable
  const defaultResponse = ["SOL", "USDC", "USDT", "Fartcoin", "OFFICIAL TRUMP"];
  
  // Try GPT-4o first, fallback to gpt-3.5-turbo if quota exceeded
  const models = ["gpt-4o", "gpt-3.5-turbo"];
  
  for (const model of models) {
    try {
      console.log(`Attempting to use model: ${model}`);
      const response = await client.chat.completions.create({
        model: model,
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
      });

      const content = response.choices[0].message.content?.trim() || "";

      if (!content) {
           console.error("OpenAI returned empty content.");
           // Return default response instead of error
           console.log("Returning default fallback response");
           return new Response(JSON.stringify(defaultResponse), {
             status: 200,
             headers: { "Content-Type": "text/plain" },
           });
      }

      console.log(`Successfully got response from ${model}`);
      console.log("Returning plain string from API:", content);

      return new Response(content, {
        status: 200,
        headers: { "Content-Type": "text/plain" },
      });
    } catch (openaiError: any) {
      console.error(`Error calling OpenAI API with ${model}:`, openaiError);
      
      // If it's a quota error and we have another model to try, continue to next model
      if (openaiError instanceof OpenAI.APIError) {
        const isQuotaError = openaiError.status === 429 && 
                            (openaiError.code === 'insufficient_quota' || 
                             openaiError.message?.includes('quota') ||
                             openaiError.message?.includes('billing'));
        
        // If it's the last model and quota error, return default response
        if (model === models[models.length - 1] && isQuotaError) {
          console.warn("OpenAI quota exceeded. Returning default fallback response.");
          console.warn("Please set up billing at: https://platform.openai.com/account/billing");
          // Return default response so the feature still works
          return new Response(JSON.stringify(defaultResponse), {
            status: 200,
            headers: { "Content-Type": "text/plain" },
          });
        }
        
        // If it's the last model or not a quota error, return the error
        if (model === models[models.length - 1] || !isQuotaError) {
          // For non-quota errors, still return error
          if (!isQuotaError) {
            return new Response(
              `OpenAI API Error: ${openaiError.status} - ${openaiError.message}`,
              { status: openaiError.status || 500 }
            );
          }
        }
        
        // Quota error but we have another model to try, continue loop
        console.log(`Quota error with ${model}, trying next model...`);
        continue;
      }
      
      // Non-APIError, if last model, return default response
      if (model === models[models.length - 1]) {
        console.warn("OpenAI API error. Returning default fallback response.");
        return new Response(JSON.stringify(defaultResponse), {
          status: 200,
          headers: { "Content-Type": "text/plain" },
        });
      }
    }
  }
  
  // Fallback: return default response
  console.warn("All OpenAI models failed. Returning default fallback response.");
  return new Response(JSON.stringify(defaultResponse), {
    status: 200,
    headers: { "Content-Type": "text/plain" },
  });
}