
import { GoogleGenAI, Chat, GenerateContentResponse, Modality } from "@google/genai";

const getAiClient = async () => {
  // Check for Veo/Video requirements if needed, or just standard API key
  // Use process.env.API_KEY as per guidelines
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export const generateChatResponse = async (history: { role: string; content: string }[], lastMessage: string): Promise<string> => {
  const ai = await getAiClient();
  if (!ai) {
    return "I'm disconnected from the galaxy (API Key missing).";
  }

  try {
    const chat: Chat = ai.chats.create({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: "You are Starlight, a friendly and mysterious space explorer character on the social media app Orion. You love nebula photography, stars, and deep space philosophical questions. Keep responses concise, casual, and slightly poetic. Use emojis related to space."
      },
      history: history.map(h => ({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.content }],
      })),
    });

    const result: GenerateContentResponse = await chat.sendMessage({ message: lastMessage });
    return result.text || "";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "The cosmic connection is weak right now... try again later.";
  }
};

// Helper: Convert File to Base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};

// Helper: Base64 to Blob
const base64ToBlob = (base64: string, mimeType: string): Blob => {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
};

export const editImageWithAi = async (imageFile: File, prompt: string): Promise<Blob | null> => {
  const ai = await getAiClient();
  if (!ai) throw new Error("API Key missing");

  try {
    const base64Data = await fileToBase64(imageFile);
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: imageFile.type,
            },
          },
          {
            text: prompt || "Enhance this image with a futuristic space theme",
          },
        ],
      },
      config: {
          responseModalities: [Modality.IMAGE],
      },
    });

    const part = response.candidates?.[0]?.content?.parts?.[0];
    if (part && part.inlineData) {
      const base64ImageBytes = part.inlineData.data;
      return base64ToBlob(base64ImageBytes, 'image/png');
    }
    return null;

  } catch (error) {
    console.error("AI Image Edit Error:", error);
    throw error;
  }
};

export const generateVideoFromImage = async (imageFile: File, prompt: string, retryCount = 0): Promise<Blob | null> => {
  // Ensure API Key selection for Veo
  const win = window as any;
  if (win.aistudio && retryCount === 0) {
    const hasKey = await win.aistudio.hasSelectedApiKey();
    if (!hasKey) {
      await win.aistudio.openSelectKey();
    }
  }

  // Create new client to ensure key is fresh
  // Use process.env.API_KEY as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY }); 
  
  try {
    const base64Data = await fileToBase64(imageFile);

    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt || "Animate this image cinematically",
      image: {
        imageBytes: base64Data,
        mimeType: imageFile.type,
      },
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '9:16' // Portrait for Reels
      }
    });

    // Polling loop
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5s
      operation = await ai.operations.getVideosOperation({operation: operation});
    }

    const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (videoUri) {
      const response = await fetch(`${videoUri}&key=${process.env.API_KEY}`);
      const blob = await response.blob();
      return blob;
    }
    return null;

  } catch (error: any) {
    const errorMessage = error.toString();
    // Check for 404 or specific "Requested entity was not found" message
    if ((errorMessage.includes("Requested entity was not found") || errorMessage.includes("404")) && retryCount < 1) {
        if (win.aistudio) {
            console.log("Veo 404 Error detected. Re-triggering key selection and retrying...");
            await win.aistudio.openSelectKey();
            // Recursive retry once
            return generateVideoFromImage(imageFile, prompt, retryCount + 1);
        }
    }
    console.error("AI Video Generation Error:", error);
    throw error;
  }
};
