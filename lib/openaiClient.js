import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Call OpenAI Responses API with web search tool enabled.
 * Uses gpt-5.1 model for maximum intelligence.
 */
export async function askWithWebSearch(prompt) {
  const response = await openai.responses.create({
    model: "gpt-4.1",
    tools: [{ type: "web_search_preview" }],
    input: prompt,
  });

  // Extract text output from response
  const textOutput = response.output.find((item) => item.type === "message");
  if (textOutput && textOutput.content) {
    const textBlock = textOutput.content.find((c) => c.type === "output_text");
    return textBlock?.text || "";
  }
  return "";
}

export default openai;
