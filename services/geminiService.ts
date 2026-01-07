import { GoogleGenAI } from "@google/genai";
import { DailyReport, TrendItem, Source } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const fetchDailyTrends = async (): Promise<DailyReport> => {
  const today = new Date().toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' });

  // Prompt engineering to get structured data despite the grounding limitation.
  // We ask for a JSON block specifically.
  const prompt = `
    你是一位專業的全球科技趨勢分析師。今天是 ${today}。
    請利用 Google Search 搜尋今日最新的全球科技新聞，並生成一份趨勢報告。
    
    重點關注領域：
    1. 人工智慧 (Artificial Intelligence) - 最優先，尋找模型發布、政策法規、重大應用。
    2. 材料科學 (Material Science) - 次要，尋找超導體、電池技術、奈米材料等突破。
    3. 其他重大科技或經濟脈動 - 僅限極具影響力的大事。

    請嚴格按照以下 JSON 格式回傳內容（不要包含 Markdown 標記以外的文字）：
    \`\`\`json
    {
      "date": "${today}",
      "summary": "一段約 50-100 字的今日全球趨勢總結，語氣專業且具前瞻性。",
      "trends": [
        {
          "id": "unique_id_1",
          "category": "AI" | "Material Science" | "Global Economy" | "Tech",
          "title": "新聞標題 (繁體中文)",
          "summary": "詳細摘要 (約 100 字)",
          "impact": "對未來的具體影響評估",
          "keywords": ["關鍵字1", "關鍵字2", "關鍵字3"]
        }
      ]
    }
    \`\`\`
    確保至少有 4-6 則重要趨勢。若當日無材料科學重大新聞，則專注於 AI 與其他科技。
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', // Using Pro for better reasoning and search capabilities
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        // We do NOT set responseMimeType to JSON when using tools as per guidelines,
        // instead we parse the text output manually.
      },
    });

    const text = response.text || '';
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    // Helper to extract sources from grounding metadata
    const extractSources = (): Source[] => {
        const sources: Source[] = [];
        groundingChunks.forEach((chunk: any) => {
            if (chunk.web?.uri && chunk.web?.title) {
                sources.push({
                    title: chunk.web.title,
                    url: chunk.web.uri
                });
            }
        });
        // Deduplicate
        return sources.filter((v, i, a) => a.findIndex(v2 => (v2.url === v.url)) === i).slice(0, 5);
    };

    const globalSources = extractSources();

    // Parse the JSON from the markdown code block
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```([\s\S]*?)```/);
    let parsedData: DailyReport;

    if (jsonMatch && jsonMatch[1]) {
      parsedData = JSON.parse(jsonMatch[1]);
    } else {
      // Fallback if model doesn't return code block (rare with explicit instruction)
      // Try parsing the raw text if it looks like JSON
      try {
          parsedData = JSON.parse(text);
      } catch (e) {
          throw new Error("Failed to parse Gemini response format.");
      }
    }

    // Attach global sources to the first item or distribute them (simplified here)
    // Since grounding gives global sources for the prompt, we attach them loosely or let the user know sources are general.
    // For specific attribution, Gemini's response.text usually has footnotes [1], but parsing that into the JSON object is complex.
    // We will attach the gathered sources to the report object for display.
    
    // Inject sources into the report structure for the UI to use
    // We'll attach specific sources if we can map them, otherwise we pass global sources
    // Modifying trends to include a property for sources if not present
    parsedData.trends = parsedData.trends.map(t => ({
        ...t,
        sources: globalSources // Assign global sources to items as "Related References"
    }));

    return parsedData;

  } catch (error) {
    console.error("Error fetching trends:", error);
    throw error;
  }
};
