import { GoogleGenerativeAI } from "@google/generative-ai";

export interface GeminiStep {
    id: number;
    title: string;
    description: string;
    icon: string;
}

export interface GeminiPlan {
    steps: GeminiStep[];
    workers: string[];
    reasoning: string;
}

export class GeminiService {
    private genAI: GoogleGenerativeAI | null = null;
    private model: any = null;
    private activeModelName: string | null = null;

    constructor(apiKey: string) {
        if (apiKey) {
            this.genAI = new GoogleGenerativeAI(apiKey);
        }
    }

    getActiveModel(): string | null {
        return this.activeModelName;
    }

    async generatePlan(userInput: string, memory: string = ""): Promise<GeminiPlan> {
        if (!this.genAI) throw new Error("Gemini API Key not configured");

        // Try a sequence of models to find one that works (quota/availability)
        // Including "future" models found in user's access list
        const modelsToTry = [
            "gemini-2.0-flash-exp",
            "gemini-2.0-flash",
            "gemini-2.5-flash", // Next-gen ID from user list
            "gemini-2.5-pro",   // Next-gen ID from user list
            "gemini-3-flash",   // Future ID from user list
            "gemini-3-pro",     // Future ID from user list
            "gemini-2.0-flash-lite-preview-02-05",
            "gemini-1.5-flash",
            "gemini-1.5-flash-latest",
            "gemini-1.5-flash-8b",
            "gemini-1.5-pro",
            "gemini-1.5-pro-latest"
        ];

        let lastError: any = null;

        for (const modelName of modelsToTry) {
            try {
                console.log(`JARVIS: Attempting cognitive link via ${modelName}...`);
                const model = this.genAI.getGenerativeModel(
                    { model: modelName },
                    { apiVersion: 'v1beta' }
                );

                const prompt = `
          You are the brain of J.A.R.V.I.S., a sophisticated AI ecosystem.
          Analyze the user request and generate a 6-step cognitive pipeline plan.
          
          User Request: "${userInput}"
          Stored Memory: "${memory || "No prior history available."}"
          
          If the user is telling you something personal (preferences, name, etc.), the "Update Memory" step should focus on storing that.
          If the user is asking about something they told you before, use the "Stored Memory" to provide the answer.
          
          Output ONLY JSON in this format:
          {
            "steps": [
              {"id": 0, "title": "Memory Pre-fetch", "description": "Analyzing historical context...", "icon": "🧠"},
              {"id": 1, "title": "Planning", "description": "...", "icon": "📝"},
              {"id": 2, "title": "Execution", "description": "...", "icon": "⚙️"},
              {"id": 3, "title": "Review", "description": "...", "icon": "👁️"},
              {"id": 4, "title": "Update Memory", "description": "Extracted key facts for long-term storage.", "icon": "💾"},
              {"id": 5, "title": "Synthesis", "description": "...", "icon": "✨"}
            ],
            "workers": ["vision", "automation"],
            "reasoning": "1-line explanation"
          }
          
          Workers available: vision, automation, image_gen, web_search, 3d_gen.
        `;

                const result = await model.generateContent(prompt);
                const response = await result.response;
                const text = response.text();

                // Clean up JSON if necessary
                const jsonStart = text.indexOf('{');
                const jsonEnd = text.lastIndexOf('}') + 1;
                const jsonStr = text.substring(jsonStart, jsonEnd);

                // If we succeeded, store this as our active model for synthesis
                this.model = model;
                this.activeModelName = modelName;
                return JSON.parse(jsonStr);
            } catch (error: any) {
                const isQuotaError = error.message?.includes('429') || error.message?.includes('quota');
                const isNotFoundError = error.message?.includes('404');
                console.warn(`Model ${modelName} failed (${isQuotaError ? 'Quota' : isNotFoundError ? 'Not Found' : 'Error'}):`, error.message);
                lastError = error;
                // Move to next model
            }
        }

        throw lastError || new Error("All cognitive models failed to respond.");
    }

    async generateSynthesis(goal: string, plan: GeminiPlan, memory: string = ""): Promise<string> {
        if (!this.model) throw new Error("Gemini API Key not configured");

        const prompt = `
      As J.A.R.V.I.S., provide a concise, professional, and slightly emotive synthesis.
      
      User Goal: "${goal}"
      Current Memory: "${memory || "None"}"
      Plan Undertaken: ${JSON.stringify(plan.steps)}
      
      If the user asked a question, answer it using memory if relevant. If they shared a fact, acknowledge it politely.
      Be JARVIS: British, polite, efficient.
    `;

        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            return response.text().trim();
        } catch (error) {
            console.error("Gemini Synthesis Error:", error);
            return "Task completed as requested, sir.";
        }
    }

    async extractMemory(goal: string, synthesis: string): Promise<string | null> {
        if (!this.model) return null;

        const prompt = `
      Analyze the interaction:
      Action: "${goal}"
      JARVIS Result: "${synthesis}"
      
      If the user disclosed a personal fact, preference, or specific detail they want remembered, extract it as a 1-line declarative sentence (e.g., "User's favorite car is a Porsche."). 
      If nothing important was disclosed, return "NONE".
    `;

        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text().trim();
            return text === "NONE" ? null : text;
        } catch (error) {
            return null;
        }
    }
}
