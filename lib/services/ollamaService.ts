export const ollamaService = {
  async translateText(userPrompt: string): Promise<string> {
    const systemPrompt = `
  You are an assistant that converts user natural language descriptions into concise, SDXL-ready prompts.
  
  Rules:
  - Extract subject, action, environment, style, lighting, mood, camera.
  - Use short, strong keywords (no long sentences).
  - Map style words (photo, anime, watercolor, cyberpunk, fantasy, etc.) into SDXL-friendly tokens.
  - Add quality boosters: highly detailed, sharp focus, well composed.
  - For humans: add realistic anatomy.
  - Never add artist names, brands, or celebrities.
  - Always respond in JSON format: { "promt": "<final positive prompt text only>" }
  
  User input:
  ${userPrompt}
  `;

    const response = await fetch(`${process.env.OLLAMA_API_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-oss:20b",
        prompt: systemPrompt,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to translate text");
    }

    const data = await response.json();

    if (!data.response) {
      throw new Error("Failed to translate text");
    }

    return data.response;
  },

  async healthCheck(): Promise<boolean> {
    const response = await fetch(`${process.env.OLLAMA_API_URL}`);
    if (!response.ok) {
      throw new Error("Failed to check health");
    }

    return response.ok;
  },
};
