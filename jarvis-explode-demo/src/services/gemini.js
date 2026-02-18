import { GoogleGenerativeAI } from '@google/generative-ai';

// ✅ Direct Gemini SDK integration for the demo
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

let genAI = null;
if (API_KEY) {
  genAI = new GoogleGenerativeAI(API_KEY);
}

export const generateResponse = async (prompt) => {
  if (!genAI) {
    return 'Analysis Error: Gemini API Key missing in .env';
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini Error:', error);
    return `Analysis Error: ${error.message}`;
  }
};

// Vision API call (direct SDK)
export const callGeminiVision = async (prompt, images) => {
  if (!genAI) {
    throw new Error('Gemini API Key missing');
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent([
      prompt,
      ...images.map(img => ({
        inlineData: {
          data: img.data,
          mimeType: img.mime_type
        }
      }))
    ]);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini Vision Error:', error);
    throw error;
  }
};
