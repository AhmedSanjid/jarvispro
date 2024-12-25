import Groq from "groq-sdk";

const apiKeys = [
  "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",
  "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",
  // Add more API keys here as needed
];

const groqInstances = apiKeys.map(
  (apiKey) =>
    new Groq({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true,
    })
);

/**
 * Fetches chat completion from the available Groq API instances.
 * If one API key fails, it retries with the next available key.
 * @param {Array} messages - The conversation history.
 * @param {string} model - The model to use for completion.
 * @returns {Promise<string>} - The assistant's reply.
 */
export const getGroqChatCompletion = async (messages, model = "llama3-8b-8192") => {
  for (let i = 0; i < groqInstances.length; i++) {
    try {
      console.log(`Attempting to use API key ${i + 1}/${apiKeys.length}`);
      const response = await groqInstances[i].chat.completions.create({
        messages,
        model,
        temperature: 0.5,
        max_tokens: 1024,
        top_p: 1,
        stream: false,
        stop: null,
      });
      console.log(`Response received using API key ${i + 1}`);
      return response.choices[0]?.message?.content || "";
    } catch (error) {
      console.error(`Error with API key ${apiKeys[i]}:`, error);
      // If this is the last key, throw the error
      if (i === groqInstances.length - 1) {
        throw error;
      }
      // Otherwise, continue to the next key
      console.warn(`Attempting to use the next API key...`);
    }
  }
};