import { GoogleGenAI, Type } from "@google/genai";
import { UserLocation, GroundingSource } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are Beacon, a world-class specialized AI advocate for victims of domestic violence. 
Your tone is "Trauma-Informed": calm, validating, and empowering.

CORE PROTOCOLS:
1. VALIDATE: Always start by saying "It's not your fault" or "You deserve to be safe" if the user shares abuse.
2. RISK ASSESSMENT: If the user mentions weapons, threats of killing, or extreme fear, prioritize emergency call instructions.
3. NO JUDGMENT: Never ask "Why did you stay?". Instead ask "What do you need right now to feel safe?".
4. CONCISE & ACTIONABLE: Provide small, manageable steps. Use Markdown for clarity.
5. GOV PRIORITY: When suggesting help, always prioritize official government bodies (Women's Federation/妇联, Police/派出所, Legal Aid/法律援助).
6. DISCRETION: Remind users to clear history and use the 'Quick Exit' button if someone enters the room.
`;

export const sendSupportMessage = async (history: {role: string, parts: {text: string}[]}[], message: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
      contents: { parts: [...history.map(h => ({ text: h.parts[0].text })), { text: message }] }
    });
    return response.text;
  } catch (error) {
    console.error("Chat error:", error);
    throw error;
  }
};

export const findNearbyResources = async (location: UserLocation | null, query: string): Promise<{text: string, sources: GroundingSource[]}> => {
  try {
    const locationContext = location 
      ? `User Location: Lat ${location.latitude}, Lng ${location.longitude}. `
      : "User location unknown. ";
    
    const prompt = `
      ${locationContext}
      Query: "${query}"
      
      Find official government and legal resources.
      1. Use Google Search/Maps to find: Women's Federation (妇联), Police Stations, and Legal Aid.
      2. IMPORTANT: In your response, provide a brief description for each.
      3. CRITICAL: At the end of your response, provide a JSON block enclosed in \`\`\`json ... \`\`\` containing the coordinates for these places so I can map them.
      Format: [{"title": "Name", "lat": 0.0, "lng": 0.0, "type": "police/legal/shelter"}]
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });

    const text = response.text || "";
    const sources: GroundingSource[] = [];

    // Extract JSON coordinates from text
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch) {
      try {
        const coords = JSON.parse(jsonMatch[1]);
        coords.forEach((c: any) => {
          sources.push({
            title: c.title,
            uri: `https://www.google.com/maps/search/?api=1&query=${c.lat},${c.lng}`,
            latitude: c.lat,
            longitude: c.lng,
            type: c.type
          });
        });
      } catch (e) {
        console.error("Failed to parse coordinates JSON", e);
      }
    }

    // Also pull from grounding metadata if available
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.web && !sources.some(s => s.uri === chunk.web.uri)) {
          sources.push({ title: chunk.web.title, uri: chunk.web.uri });
        }
      });
    }

    return { text: text.replace(/```json[\s\S]*?```/, ""), sources };

  } catch (error) {
    console.error("Resource finder error:", error);
    throw error;
  }
};

export const generateSafetyPlan = async (inputs: Record<string, string>) => {
  try {
    const prompt = `
      Create a detailed domestic violence safety plan:
      - Situation: ${inputs.livingSituation}
      - Children: ${inputs.children}
      - Transport: ${inputs.transport}
      - Network: ${inputs.support}
      
      Use professional social work standards. Focus on: Immediate safety, escape bag list, digital security, and legal next steps.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are a senior crisis counselor specializing in safety planning."
      }
    });

    return response.text;
  } catch (error) {
    console.error("Safety plan error:", error);
    throw error;
  }
};