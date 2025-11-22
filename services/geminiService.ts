import { GoogleGenAI, Type } from "@google/genai";
import { BusRoute, LogEntry, AiInsight, RouteOptimizationResponse, BudgetEntry, FinancialInsight, MaintenanceTicket } from "../types";

const apiKey = process.env.VITE_API_KEY || process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const analyzeLogistics = async (routes: BusRoute[], logs: LogEntry[], tickets: MaintenanceTicket[] = []): Promise<AiInsight[]> => {
  if (!apiKey) {
    console.warn("No API Key provided for Gemini.");
    return [
      {
        title: "API Key Missing",
        description: "Please provide a valid API key to enable AI logistics analysis.",
        type: "system",
        confidence: 0
      }
    ] as any;
  }

  try {
    const modelId = 'gemini-2.5-flash';
    const prompt = `
      You are an AI Logistics Analyst for the Tucson Unified School District (TUSD).
      Analyze the following current bus fleet status, recent event logs, and active maintenance tickets.
      Identify potential safety risks, efficiency optimizations, or maintenance needs.
      
      Current Fleet Status:
      ${JSON.stringify(routes.map(r => ({id: r.id, number: r.busNumber, status: r.status})), null, 2)}

      Active Maintenance Tickets:
      ${JSON.stringify(tickets, null, 2)}

      Recent Logs:
      ${JSON.stringify(logs.slice(0, 10), null, 2)}

      Provide 3 concise, actionable insights. If there are critical maintenance issues, prioritize those.
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              type: { type: Type.STRING, enum: ["optimization", "safety", "maintenance"] },
              confidence: { type: Type.NUMBER, description: "A number between 0 and 100" }
            },
            required: ["title", "description", "type", "confidence"]
          }
        }
      }
    });
    return response.text ? JSON.parse(response.text) : [];
  } catch (error) {
    console.error("Error analyzing logistics:", error);
    return [];
  }
};

export const generateRouteOptimizations = async (routes: BusRoute[]): Promise<RouteOptimizationResponse> => {
  if (!apiKey) return { overview: "API Key Missing", insights: [], estimatedSavings: "$0" };

  try {
    const prompt = `
      Act as a Senior Transportation Planner for TUSD. 
      Analyze the following bus routes and student occupancy data.
      Routes: ${JSON.stringify(routes, null, 2)}
      Propose optimizations to consolidate routes or avoid traffic.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overview: { type: Type.STRING },
            insights: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  routeId: { type: Type.STRING },
                  suggestion: { type: Type.STRING },
                  impact: { type: Type.STRING },
                  newPathDescription: { type: Type.STRING }
                },
                required: ["routeId", "suggestion", "impact"]
              }
            },
            estimatedSavings: { type: Type.STRING }
          },
          required: ["overview", "insights", "estimatedSavings"]
        }
      }
    });
    return response.text ? JSON.parse(response.text) : { overview: "No data", insights: [], estimatedSavings: "$0" };
  } catch (error) {
    return { overview: "Error", insights: [], estimatedSavings: "$0" };
  }
};

export const draftParentCommunication = async (topic: string, busId: string): Promise<string> => {
  if (!apiKey) return "API Key missing.";
  try {
    const prompt = `Draft a short SMS for parents about Bus ${busId}. Topic: ${topic}.`;
    const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
    return response.text || "Error generating draft.";
  } catch (e) { return "Error."; }
};

export const analyzeBudget = async (budgetEntries: BudgetEntry[]): Promise<FinancialInsight[]> => {
  if (!apiKey) return [];
  try {
    const prompt = `Analyze budget for savings: ${JSON.stringify(budgetEntries)}`;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              finding: { type: Type.STRING },
              recommendation: { type: Type.STRING },
              potentialSavings: { type: Type.NUMBER }
            }
          }
        }
      }
    });
    return response.text ? JSON.parse(response.text) : [];
  } catch (e) { return []; }
};
