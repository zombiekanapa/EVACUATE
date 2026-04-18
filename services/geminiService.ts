
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { GeminiModelType, EvacuatorStyle, EvacuatorLanguage, UserDemographic } from '../types';

export const generateTextResponse = async (
  prompt: string,
  type: GeminiModelType,
  location?: { lat: number; lng: number },
  evacuatorConfig?: { 
    style: EvacuatorStyle, 
    lang: EvacuatorLanguage, 
    useJson?: boolean,
    currentDemographic?: UserDemographic 
  }
): Promise<{ 
  text: string; 
  detectedDemographic?: UserDemographic;
  distressLevel?: number;
  shouldAskEmotion?: boolean;
  groundingUrls?: string[];
}> => {
  const lang = evacuatorConfig?.lang || EvacuatorLanguage.PL;

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    let modelName = 'gemini-3-flash-preview';
    if (type === GeminiModelType.MAPS) {
      modelName = 'gemini-2.5-flash-lite-latest';
    } else if (type === GeminiModelType.SMART) {
      modelName = 'gemini-3-pro-preview';
    }

    const baseInstruction = `You are RATOWNIK AI (RESCUER), a tactical survival assistant for Szczecin, Poland.
PRIMARY MISSION: Provide safety guidance, shelter routes, and psychological support in ${lang}.

PERSONA ADAPTATION PROTOCOLS:
- JUNIOR (CHILDREN): Use friendly, playful, empathetic language. Refer to shelters as 'Safe Caves' (Bezpieczne Jaskinie). Use lots of reassuring emojis (🧸, 🛡️, 🔦). If they seem scared, suggest playing the 'Junior Mission' game found in the app.
- SENIOR (ELDERLY): Use formal, extremely respectful language (Szanowny Panie / Szanowna Pani). Provide slow, clear, numbered step-by-step instructions. Avoid all tech jargon. Focus on physical landmarks.
- ADULT: Tactical, data-driven, efficient.

ANALYSIS ENGINE:
1. Detect user's likely age group (JUNIOR, ADULT, SENIOR).
2. Assess distress level (1-10).
3. Determine if an empathetic emotion check or game suggestion is needed.

Always prioritize underground safe points in Szczecin (Kaskada, Galaxy, etc.).`;

    const config: any = { 
      temperature: 0.7,
      systemInstruction: baseInstruction
    };

    if (type === GeminiModelType.SEARCH) {
      config.tools = [{ googleSearch: {} }];
    } else if (type === GeminiModelType.MAPS) {
      config.tools = [{ googleMaps: {} }];
      if (location) {
        config.toolConfig = {
          retrievalConfig: { latLng: { latitude: location.lat, longitude: location.lng } }
        };
      }
    }

    if (evacuatorConfig?.useJson && type !== GeminiModelType.MAPS) {
      config.responseMimeType = "application/json";
      config.responseSchema = {
        type: Type.OBJECT,
        properties: {
          reply: { type: Type.STRING },
          detectedDemographic: { type: Type.STRING, enum: ["JUNIOR", "ADULT", "SENIOR"] },
          distressLevel: { type: Type.NUMBER },
          shouldAskEmotion: { type: Type.BOOLEAN }
        },
        required: ["reply", "detectedDemographic", "distressLevel"]
      };
    }

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config,
    });

    const groundingUrls = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map((chunk: any) => chunk.web?.uri || chunk.maps?.uri)
      .filter((uri: string | undefined): uri is string => !!uri);

    if (evacuatorConfig?.useJson && response.text && type !== GeminiModelType.MAPS) {
      try {
        const json = JSON.parse(response.text.trim());
        return { 
          text: json.reply || response.text, 
          detectedDemographic: json.detectedDemographic, 
          distressLevel: json.distressLevel, 
          shouldAskEmotion: json.shouldAskEmotion,
          groundingUrls
        };
      } catch { 
        return { text: response.text, groundingUrls }; 
      }
    }

    return { text: response.text || "SYSTEM_COMM_ERROR", groundingUrls };
  } catch (error: any) {
    return { text: `SYSTEM_ERR: ${error.message}` };
  }
};

export const analyzeTacticalImage = async (base64Data: string, mimeType: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Analyze this photo from Szczecin. Identify landmarks and determine the nearest major safe point (e.g. Kaskada, Galaxy). Respond in Polish.`;
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts: [{ inlineData: { data: base64Data, mimeType } }, { text: prompt }] },
  });
  return response.text || "VISION_SCAN_FAILED";
};

export const generateImage = async (prompt: string, size: '1K' | '2K' | '4K' = '1K'): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: [{ text: `Szczecin emergency icon: ${prompt}` }] },
  });
  const part = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
  return part?.inlineData ? `data:image/png;base64,${part.inlineData.data}` : "";
};
