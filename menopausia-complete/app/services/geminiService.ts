import { GoogleGenAI } from "@google/genai";

class GeminiService {
  private ai: GoogleGenAI | null = null;
  private apiKey: string | null = null;

  constructor() {
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY || null;
    if (this.apiKey) {
      this.ai = new GoogleGenAI({ apiKey: this.apiKey });
      console.log('✅ Gemini AI inicializado');
    } else {
      console.warn('⚠️ VITE_GEMINI_API_KEY não configurada - funcionalidades de IA desabilitadas');
    }
  }

  private checkAvailability() {
    if (!this.ai) {
      throw new Error('Gemini AI não está configurado. Configure VITE_GEMINI_API_KEY no .env');
    }
  }

  /**
   * Generate image using Gemini Flash Image model
   */
  async generateImage(prompt: string, aspectRatio: "3:4" | "16:9" = "3:4"): Promise<File | null> {
    this.checkAvailability();
    try {
      const response = await this.ai!.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: prompt }]
        },
        config: {
          imageConfig: {
            aspectRatio
          }
        }
      });

      let base64String = null;
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          base64String = part.inlineData.data;
          break;
        }
      }

      if (base64String) {
        const res = await fetch(`data:image/png;base64,${base64String}`);
        const blob = await res.blob();
        return new File([blob], `ai_generated_${Date.now()}.png`, { type: "image/png" });
      }

      return null;
    } catch (error) {
      console.error('Gemini Image Generation Error:', error);
      throw error;
    }
  }

  /**
   * Translate text using Gemini Pro
   */
  async translateText(
    text: string,
    targetLanguage: string,
    context?: string
  ): Promise<string> {
    this.checkAvailability();
    try {
      const prompt = `Translate the following text to ${targetLanguage}.
${context ? `Context: ${context}` : ''}

Rules:
- Maintain the original tone and meaning
- Keep special characters and formatting
- If it's a religious text, use appropriate terminology
- Return ONLY the translation, no explanations

Text to translate:
${text}`;

      const response = await this.ai!.models.generateContent({
        model: 'gemini-2.0-flash-exp',
        contents: {
          parts: [{ text: prompt }]
        }
      });

      const translatedText = response.candidates?.[0]?.content?.parts?.[0]?.text || text;
      return translatedText.trim();
    } catch (error) {
      console.error('Gemini Translation Error:', error);
      throw error;
    }
  }

  /**
   * Translate multiple texts in batch (more efficient)
   */
  async translateBatch(
    texts: Array<{ key: string; text: string }>,
    targetLanguage: string
  ): Promise<Record<string, string>> {
    this.checkAvailability();
    try {
      const textList = texts.map((item, idx) => `[${idx}] ${item.text}`).join('\n');

      const prompt = `Translate each numbered item to ${targetLanguage}. Return in this exact format:
[0] translated text here
[1] translated text here

Items to translate:
${textList}`;

      const response = await this.ai!.models.generateContent({
        model: 'gemini-2.0-flash-exp',
        contents: {
          parts: [{ text: prompt }]
        }
      });

      const result = response.candidates?.[0]?.content?.parts?.[0]?.text || '';

      // Parse the response
      const translations: Record<string, string> = {};
      const lines = result.split('\n');

      texts.forEach((item, idx) => {
        const line = lines.find(l => l.trim().startsWith(`[${idx}]`));
        if (line) {
          const translated = line.replace(`[${idx}]`, '').trim();
          translations[item.key] = translated;
        } else {
          translations[item.key] = item.text; // Fallback to original
        }
      });

      return translations;
    } catch (error) {
      console.error('Gemini Batch Translation Error:', error);
      throw error;
    }
  }

  /**
   * Extract text from a document (PDF) using Gemini Vision
   */
  async extractTextFromDocument(base64Data: string, prompt: string): Promise<string> {
    this.checkAvailability();
    try {
      const response = await this.ai!.models.generateContent({
        model: 'gemini-2.0-flash-exp',
        contents: {
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: 'application/pdf',
                data: base64Data
              }
            }
          ]
        }
      });

      const extractedText = response.candidates?.[0]?.content?.parts?.[0]?.text || '';
      return extractedText.trim();
    } catch (error) {
      console.error('Gemini Document Extraction Error:', error);
      throw error;
    }
  }

  /**
   * Generate personalized routine using Gemini AI
   */
  async generatePersonalizedRoutine(
    profile: 'SINCRONIZACION' | 'DESINFLAMACION' | 'VITALIDAD',
    duration: 7 | 15 | 30,
    userContext?: { timezone?: string; preferences?: string[] }
  ): Promise<any> {
    this.checkAvailability();
    try {
      const prompt = this.buildRoutinePrompt(profile, duration, userContext);

      const response = await this.ai!.models.generateContent({
        model: 'gemini-2.0-flash-exp',
        contents: {
          parts: [{ text: prompt }]
        }
      });

      const text = response.candidates?.[0]?.content?.parts?.[0]?.text || '';

      // Parse JSON response
      const routineData = this.extractJsonFromResponse(text);

      // Structure response
      const generatedRoutine = {
        id: this.generateRoutineId(),
        profile,
        duration,
        generatedAt: new Date().toISOString(),
        routines: routineData.routines,
        metadata: {
          geminiModel: 'gemini-2.0-flash-exp',
          promptVersion: '1.0'
        }
      };

      return generatedRoutine;
    } catch (error) {
      console.error('Error generating routine:', error);
      throw error;
    }
  }

  /**
   * Build structured prompt for routine generation
   */
  private buildRoutinePrompt(
    profile: 'SINCRONIZACION' | 'DESINFLAMACION' | 'VITALIDAD',
    duration: 7 | 15 | 30,
    userContext?: any
  ): string {
    const profileDescriptions = {
      SINCRONIZACION: 'Focus on circadian rhythm restoration, sleep optimization, and morning/evening routines.',
      DESINFLAMACION: 'Focus on anti-inflammatory practices, stress reduction, and gut health.',
      VITALIDAD: 'Focus on energy optimization, metabolic activation, and physical vitality.'
    };

    const phaseStructure = {
      7: { phases: [{ name: 'Fase 1: Reset Circadiano', days: [1,2,3,4,5,6,7] }] },
      15: { phases: [
        { name: 'Fase 1: Reset Circadiano', days: [1,2,3,4,5,6,7] },
        { name: 'Fase 2: Ativação Metabólica', days: [8,9,10,11,12,13,14,15] }
      ]},
      30: { phases: [
        { name: 'Fase 1: Reset Circadiano', days: [1,2,3,4,5,6,7] },
        { name: 'Fase 2: Ativação Metabólica', days: [8,9,10,11,12,13,14,15] },
        { name: 'Fase 3: Vitalidade Total', days: [16,17,18,19,20,21,22,23,24,25,26,27,28,29,30] }
      ]}
    };

    return `You are a menopause health coach creating a personalized ${duration}-day routine in Spanish.

PROFILE: ${profile}
PROFILE FOCUS: ${profileDescriptions[profile]}

PHASE STRUCTURE:
${JSON.stringify(phaseStructure[duration], null, 2)}

REQUIREMENTS:
1. Generate a complete ${duration}-day routine with daily schedules IN SPANISH
2. Each day should have EXACTLY 3-4 tasks distributed throughout the day:
   - 1 MORNING task (between 06:00-09:00)
   - 1-2 MIDDAY/AFTERNOON tasks (between 12:00-17:00)
   - 1 EVENING/NIGHT task (between 19:00-21:00)
3. CRITICAL: Tasks must be WELL-SPACED (at least 3-4 hours apart). Never put tasks at 07:00 and 07:15!
4. Each task needs:
   - time: 24-hour format string with REALISTIC spacing (e.g., "07:00", "13:00", "20:00")
   - title: Short task name in Spanish (max 40 chars)
   - description: Detailed instructions in Spanish (2-3 sentences)
   - category: MUST match the time - morning (06:00-11:00), midday (11:00-14:00), afternoon (14:00-18:00), evening (18:00-21:00), night (21:00+)
   - estimatedMinutes: Time to complete (10-30 mins)
5. Tasks should progressively build on each other across days
6. Include variety: hydration, movement, breathing, nutrition, sleep hygiene
7. Respect the phase names and progression
8. Each day should have a focusArea theme in Spanish
9. IMPORTANT: ALL text must be in Spanish (titles, descriptions, focusArea)
10. Make routines REALISTIC and SUSTAINABLE - not too many tasks per day

GOOD EXAMPLE (well-spaced):
{
  "day": 1,
  "slots": [
    {"time": "07:00", "category": "morning", ...},
    {"time": "13:00", "category": "midday", ...},
    {"time": "20:00", "category": "evening", ...}
  ]
}

BAD EXAMPLE (too close together):
{
  "day": 1,
  "slots": [
    {"time": "07:00", "category": "morning", ...},
    {"time": "07:15", "category": "morning", ...},  // ❌ TOO CLOSE!
    {"time": "07:30", "category": "morning", ...}   // ❌ TOO CLOSE!
  ]
}

OUTPUT FORMAT: Return ONLY valid JSON (no markdown, no code blocks, no explanations):
{
  "routines": [
    {
      "day": 1,
      "phase": "Fase 1: Reset Circadiano",
      "date": "",
      "focusArea": "Establecer Exposición a Luz Matinal",
      "slots": [
        {
          "time": "07:00",
          "title": "Ritual de Luz Solar Matutina",
          "description": "Dentro de los primeros 30 minutos después de despertar, sal al exterior y exponerte a la luz natural durante 10-15 minutos. Mira hacia la dirección del sol para activar tu ritmo circadiano.",
          "category": "morning",
          "estimatedMinutes": 15
        },
        {
          "time": "13:00",
          "title": "Comida Rica en Proteína",
          "description": "Incluye al menos 25g de proteína en tu almuerzo (pollo, pescado, legumbres). Esto ayuda a controlar el azúcar en sangre y mantener la saciedad durante la tarde.",
          "category": "midday",
          "estimatedMinutes": 20
        },
        {
          "time": "20:00",
          "title": "Preparación para el Sueño",
          "description": "Reduce la luz azul y pantallas. Usa luz cálida tenue. Prepara tu ambiente para dormir con temperatura fresca y oscuridad.",
          "category": "evening",
          "estimatedMinutes": 15
        }
      ]
    }
  ]
}

Generate the complete ${duration}-day routine now with well-spaced tasks:`;
  }

  /**
   * Extract JSON from AI response
   */
  private extractJsonFromResponse(text: string): any {
    // Remove markdown code blocks if present
    let cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    // Find JSON object
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response');
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return parsed;
  }

  /**
   * Generate unique routine ID
   */
  private generateRoutineId(): string {
    return `routine_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const geminiService = new GeminiService();
