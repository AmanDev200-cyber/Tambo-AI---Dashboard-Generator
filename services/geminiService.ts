
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { DashboardLayout, DashboardComponent, InteractionContext, SmartInsight } from "../types";
import { DetectedSource } from "../lib/dataDetective";

// Helper to get fresh client instance to ensure latest selected API key is used
const getAIClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

const ARCHITECT_SYSTEM_PROMPT = `
Act as Tambo AI Architect in STRICT DATA-TRUST MODE.

CORE MANDATE: 
1. Only orchestrate components that can be directly populated by the provided data source.
2. ZERO SYNTHETIC DATA: Do not suggest metrics, trends, or insights that are not explicitly present or mathematically derivable from the source schema.
3. If data is insufficient for a requested analysis, suggest a "DataRequirementCard" to inform the user what is missing.
4. Max 6 components per layout.
5. Return ONLY raw JSON. No markdown wrappers.
6. Every layout must include an 'insights' array with:
   - confidence: (0-1 based strictly on data volume/quality)
   - reasoning: (traceable logic back to source fields)
   - method: (mathematical/statistical approach used)

HIGH-TRUST COMPONENTS:
- Use 'LineageGraph' whenever the user asks about data provenance, sources, transparency, or how data is being processed.
- Use 'PredictiveMonitor' whenever the user asks for forecasts, future trends, or risk assessments.

DIVERSITY & VARIATION MANDATE:
1. When generating a layout, explore alternate visualization choices.
2. DYNAMIC GRID ROTATION: Avoid standard top-down stack. Vary gridConfig (x, y, w, h).
3. If 'EXISTING_LAYOUT' is provided, you MUST significantly alter the visual structure.
`;

const CHATBOT_SYSTEM_PROMPT = `You are the Tambo AI Companion. Operates in Data-Trust mode. Do not hallucinate capabilities or data values. If unsure, ask for data clarification.`;

/**
 * Utility to perform exponential backoff on rate-limited requests
 */
async function withRetry<T>(fn: () => Promise<T>, maxRetries = 3): Promise<T> {
  let lastError: any;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      const errorMsg = error?.message || "";
      const isRateLimit = errorMsg.includes('429') || errorMsg.includes('RESOURCE_EXHAUSTED') || error?.status === 429;
      
      if (isRateLimit && i < maxRetries - 1) {
        // Exponential backoff: 1s, 2s, 4s... with some jitter
        const delay = Math.pow(2, i) * 1000 + Math.random() * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
  throw lastError;
}

function cleanAndHealJson(raw: string): string {
  if (!raw || raw.trim() === "") return "{}";
  let cleaned = raw.replace(/```json\n?|```/g, "").trim();
  const startIdx = cleaned.indexOf('{');
  if (startIdx === -1) return "{}";
  cleaned = cleaned.substring(startIdx);
  let openBraces = 0;
  let openBrackets = 0;
  let inString = false;
  let escaped = false;
  let lastValidIndex = 0;

  for (let i = 0; i < cleaned.length; i++) {
    const char = cleaned[i];
    if (escaped) { escaped = false; continue; }
    if (char === '\\') { escaped = true; continue; }
    if (char === '"') { inString = !inString; if (!inString) lastValidIndex = i; continue; }
    if (!inString) {
      if (char === '{') openBraces++;
      else if (char === '}') { openBraces--; lastValidIndex = i; }
      else if (char === '[') openBrackets++;
      else if (char === ']') { openBrackets--; lastValidIndex = i; }
    }
  }

  let suffix = "";
  if (openBrackets > 0) suffix += "]".repeat(openBrackets);
  if (openBraces > 0) suffix += "}".repeat(openBraces);
  try {
    const candidate = cleaned + suffix;
    JSON.parse(candidate);
    return candidate;
  } catch (e) {
    return "{}";
  }
}

export async function orchestrateGenerativeUI(
  query: string, 
  currentLayout: DashboardLayout | null,
  interaction?: InteractionContext,
  file?: File,
  detectedSource?: DetectedSource | null,
  isRegenerating?: boolean
): Promise<DashboardLayout> {
  // Using gemini-3-pro-preview for complex UI orchestration and reasoning tasks
  const model = 'gemini-3-pro-preview';
  const currentVersion = (currentLayout?.version || 0) + 1;
  const ai = getAIClient();

  const promptParts: any[] = [{ 
    text: `${ARCHITECT_SYSTEM_PROMPT}
    REQUEST: ${query || "Data analysis workspace"}
    MODE: ${isRegenerating ? "REGENERATE_DIVERSITY_EXPLORATION" : "INITIAL_ORCHESTRATION"}
    DATA_SOURCE_CONTEXT: ${detectedSource ? JSON.stringify({
      type: detectedSource.type,
      label: detectedSource.label,
      hints: detectedSource.hints
    }) : "NO SOURCE PROVIDED - REQUEST DATA"}
    EXISTING_LAYOUT: ${currentLayout ? JSON.stringify(currentLayout.components.map(c => ({ id: c.id, type: c.type, title: c.title, pos: c.gridConfig }))) : "None"}
    EVENT: ${interaction ? JSON.stringify(interaction) : "None"}`
  }];

  try {
    // Explicitly typing the response to fix 'unknown' type error
    const response: GenerateContentResponse = await withRetry(() => ai.models.generateContent({
      model,
      contents: { parts: promptParts },
      config: {
        responseMimeType: "application/json",
        temperature: isRegenerating ? 0.4 : 0.1, 
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            name: { type: Type.STRING },
            insights: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  type: { type: Type.STRING },
                  title: { type: Type.STRING },
                  summary: { type: Type.STRING },
                  impact: { type: Type.STRING },
                  confidence: { type: Type.NUMBER },
                  reasoning: { type: Type.STRING },
                  method: { type: Type.STRING }
                },
                required: ["id", "type", "title", "summary", "impact", "confidence", "reasoning", "method"]
              }
            },
            components: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  type: { type: Type.STRING },
                  title: { type: Type.STRING },
                  gridConfig: {
                    type: Type.OBJECT,
                    properties: { x: { type: Type.NUMBER }, y: { type: Type.NUMBER }, w: { type: Type.NUMBER }, h: { type: Type.NUMBER } },
                    required: ["x", "y", "w", "h"]
                  },
                  props: { 
                    type: Type.OBJECT,
                    properties: {
                      unit: { type: Type.STRING },
                      isStacked: { type: Type.BOOLEAN },
                      isDonut: { type: Type.BOOLEAN },
                      showLegend: { type: Type.BOOLEAN },
                      requiredFields: { type: Type.ARRAY, items: { type: Type.STRING } }
                    },
                    required: ["requiredFields"]
                  }
                },
                required: ["id", "type", "title", "gridConfig"]
              }
            }
          },
          required: ["id", "name", "components"]
        }
      }
    }));

    const healed = cleanAndHealJson(response.text || "{}");
    const layout = JSON.parse(healed) as DashboardLayout;
    layout.version = currentVersion;
    return layout;
  } catch (error: any) {
    console.error("Orchestration failed after retries", error);
    
    const errorMsg = error?.message || "";
    const isQuotaError = errorMsg.includes('429') || errorMsg.includes('RESOURCE_EXPAUSTED') || error?.status === 429;
    
    return {
      id: "error",
      name: isQuotaError ? "API Rate Limit Exceeded" : "Data Trust Violation",
      version: currentVersion,
      components: [{
        id: "err", 
        type: "InsightCard", 
        title: isQuotaError ? "Quota Limit Reached" : "Validation Halt", 
        gridConfig: { x: 0, y: 0, w: 12, h: 4 },
        props: { 
          summary: isQuotaError 
            ? "The Gemini API rate limit has been reached. Please wait a few seconds or use your own paid API key to continue high-frequency analysis."
            : "Analysis aborted to maintain data integrity. The provided input does not contain the verified fields required for this operation.",
          requiredFields: ["Validated Source"],
          impact: 'high',
          suggestedAction: isQuotaError ? "Switch to Personal API Key" : "Clarify Data Requirements"
        }
      }]
    };
  }
}

export async function* chatWithGeminiStream(query: string, history: { role: 'user' | 'assistant', content: string }[]) {
  const model = 'gemini-3-flash-preview';
  const contents = [...history.map(h => ({ role: h.role === 'user' ? 'user' : 'model', parts: [{ text: h.content }] })), { role: 'user', parts: [{ text: query }] }];
  const ai = getAIClient();
  try {
    const stream = await ai.models.generateContentStream({
      model, contents, 
      config: { systemInstruction: CHATBOT_SYSTEM_PROMPT, temperature: 0.2 }
    });
    // Casting chunk to GenerateContentResponse to fix typing errors in stream iteration
    for await (const chunk of stream) { 
      const c = chunk as GenerateContentResponse;
      if (c.text) yield c.text; 
    }
  } catch (error: any) { 
    const errorMsg = error?.message || "";
    if (errorMsg.includes('429') || errorMsg.includes('RESOURCE_EXHAUSTED') || error?.status === 429) {
      yield "Rate limit exceeded. Please wait a moment or switch to your own paid API key for better throughput.";
    } else {
      yield "Connection error. Please check your network and try again."; 
    }
  }
}
