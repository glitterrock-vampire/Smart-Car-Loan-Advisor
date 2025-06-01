
import { GoogleGenAI, GenerateContentResponse, Content } from "@google/genai";
import { UserInput, GeminiApiResponse } from '../types';
import { GEMINI_MODEL_NAME, AI_SYSTEM_PROMPT_TEMPLATE } from '../constants';

const API_KEY = process.env.API_KEY;

export const getApiKeyStatus = (): boolean => {
  return !!API_KEY;
};

export const fetchLoanRecommendations = async (userInput: UserInput): Promise<GeminiApiResponse> => {
  if (!API_KEY) {
    console.error("API_KEY is not configured.");
    throw new Error("API Key for Gemini API is missing. Please configure it in your environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const userPromptSegment = `${JSON.stringify(userInput, null, 2)}\nYou must respond with only the JSON object.`;

  try {
    // systemInstructionPayload is no longer needed as a Content object here
    // const systemInstructionPayload: Content = {
    //   parts: [{ text: AI_SYSTEM_PROMPT_TEMPLATE }]
    // };

    const userContentsPayload: Content[] = [
      {
        parts: [{ text: userPromptSegment }]
        // role: "user" // role is optional here, defaults to user for subsequent messages
      }
    ];

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_NAME,
      contents: userContentsPayload,
      config: {
        systemInstruction: AI_SYSTEM_PROMPT_TEMPLATE, // Pass the template string directly
        responseMimeType: "application/json",
      },
    });

    let jsonStr = response.text.trim();

    // Remove BOM if present (Byte Order Mark)
    if (jsonStr.charCodeAt(0) === 0xFEFF) {
        jsonStr = jsonStr.substring(1);
    }
    
    // Remove markdown fences if present
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim(); 
      // Re-check for BOM if it was inside the fence
      if (jsonStr.charCodeAt(0) === 0xFEFF) {
        jsonStr = jsonStr.substring(1);
      }
    }

    // Ensure the string looks like a JSON object; helps strip extraneous text outside the main {}
    const jsonStartIndex = jsonStr.indexOf('{');
    const jsonEndIndex = jsonStr.lastIndexOf('}');

    if (jsonStartIndex === -1 || jsonEndIndex === -1 || jsonEndIndex < jsonStartIndex) {
      console.error("AI response does not appear to be a valid JSON object. Raw text for debugging:", jsonStr);
      throw new Error(`AI response does not appear to be a valid JSON object (missing '{' or '}' in correct order). Raw text (first 200 chars): ${jsonStr.substring(0,200)}...`);
    }
    
    // Extract the JSON part based on the first '{' and last '}'
    jsonStr = jsonStr.substring(jsonStartIndex, jsonEndIndex + 1);
    // Final trim after extraction
    jsonStr = jsonStr.trim();

    try {
      const parsedData = JSON.parse(jsonStr) as GeminiApiResponse;

      // Post-parse validation (check if the structure is as expected)
      if (!parsedData.recommendations || !parsedData.messages) {
        console.error("Parsed JSON is not in the expected GeminiApiResponse format:", parsedData);
        throw new Error("AI response is not in the expected format. Missing 'recommendations' or 'messages'.");
      }
      if (!Array.isArray(parsedData.recommendations)) {
        parsedData.recommendations = [];
      }
      if (!Array.isArray(parsedData.messages)) {
        if (typeof parsedData.messages === 'string') {
           parsedData.messages = [parsedData.messages as string];
        } else {
           parsedData.messages = [];
        }
      }
      return parsedData;
    } catch (parseError) {
      console.error("Failed to parse JSON response from AI:", parseError);
      console.error("String attempted for parsing:", jsonStr); 
      throw new Error(`Failed to parse AI's response. Raw text (first 200 chars of string that failed parsing): ${jsonStr.substring(0, 200)}...`);
    }

  } catch (error) {
    console.error("Error fetching recommendations from Gemini API:", error);
    if (error instanceof Error) {
      // Check if the error message indicates a known proxy or API issue type.
      // The error "ReadableStream uploading is not supported" might manifest as a generic message from the SDK.
      // If the error message is already specific (like the ones checked below), re-throw it.
      // Otherwise, provide a more generic Gemini API request failed message.
      if (error.message.startsWith("Failed to parse AI's response") || 
          error.message.startsWith("AI response does not appear to be a valid JSON object") || 
          error.message.startsWith("AI response is not in the expected format") ||
          error.message.includes("Proxying failed") || // Catching the proxy error if it bubbles up
          error.message.includes("ReadableStream uploading is not supported")) { // Catching the specific detail
        throw error;
      }
      throw new Error(`Gemini API request failed: ${error.message}`);
    }
    throw new Error("An unknown error occurred while fetching recommendations from Gemini API.");
  }
};