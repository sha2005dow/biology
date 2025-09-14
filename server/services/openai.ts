import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key" 
});

export interface PublicationSummary {
  summary: string;
  keyFindings: string[];
  implications: string[];
  methodology: string;
  significance: number; // 1-10 scale
}

export interface ResearchInsight {
  type: "correlation" | "trend" | "recommendation";
  title: string;
  description: string;
  confidence: number; // 0-100
  relatedTopics: string[];
  actionableRecommendations: string[];
}

export async function summarizePublication(title: string, abstract: string, fullText?: string): Promise<PublicationSummary> {
  try {
    const content = fullText || `Title: ${title}\n\nAbstract: ${abstract}`;
    
    const prompt = `Analyze this NASA space biology research publication and provide a comprehensive summary. Focus on the biological implications of space conditions and relevance to future space exploration missions.

Publication content:
${content}

Please provide a JSON response with the following structure:
{
  "summary": "Brief 2-3 sentence summary of the main findings",
  "keyFindings": ["List of 3-5 key discoveries or results"],
  "implications": ["List of 2-4 implications for space exploration or biology"],
  "methodology": "Brief description of experimental approach",
  "significance": "Rate significance from 1-10 for space biology field"
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are an expert in space biology and NASA research. Analyze scientific publications with focus on their relevance to human space exploration and biological adaptations to space environments."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      summary: result.summary || "Summary not available",
      keyFindings: result.keyFindings || [],
      implications: result.implications || [],
      methodology: result.methodology || "Methodology not specified",
      significance: Math.max(1, Math.min(10, parseInt(result.significance) || 5)),
    };
  } catch (error) {
    console.error("Error summarizing publication:", error);
    throw new Error(`Failed to generate AI summary: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function generateResearchInsights(publications: any[]): Promise<ResearchInsight[]> {
  try {
    if (publications.length === 0) {
      return [];
    }

    const publicationData = publications.slice(0, 10).map(pub => ({
      title: pub.title,
      experimentTypes: pub.experimentTypes,
      organisms: pub.organisms,
      spaceConditions: pub.spaceConditions,
      mission: pub.mission,
      aiSummary: pub.aiSummary
    }));

    const prompt = `Analyze these NASA space biology publications and identify cross-experiment insights, trends, and correlations that could inform future space exploration missions.

Publications data:
${JSON.stringify(publicationData, null, 2)}

Generate insights focusing on:
1. Correlations between different experimental conditions and biological outcomes
2. Trends in research over time and emerging areas
3. Recommendations for future experiments or mission planning

Provide a JSON response with an array of insights:
{
  "insights": [
    {
      "type": "correlation|trend|recommendation",
      "title": "Insight title",
      "description": "Detailed description of the insight",
      "confidence": "Confidence level 0-100",
      "relatedTopics": ["Array of related research topics"],
      "actionableRecommendations": ["Array of specific recommendations"]
    }
  ]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are an expert in space biology research analysis. Generate actionable insights from NASA research publications that can guide future space exploration missions."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.4,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return (result.insights || []).map((insight: any) => ({
      type: insight.type || "recommendation",
      title: insight.title || "Research Insight",
      description: insight.description || "",
      confidence: Math.max(0, Math.min(100, parseInt(insight.confidence) || 70)),
      relatedTopics: insight.relatedTopics || [],
      actionableRecommendations: insight.actionableRecommendations || [],
    }));
  } catch (error) {
    console.error("Error generating research insights:", error);
    throw new Error(`Failed to generate research insights: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function analyzeSearchQuery(query: string): Promise<{
  suggestedFilters: {
    experimentTypes: string[];
    organisms: string[];
    spaceConditions: string[];
  };
  enhancedQuery: string;
}> {
  try {
    const prompt = `Analyze this search query for NASA space biology research and suggest relevant filters and an enhanced search query.

User query: "${query}"

Provide suggestions for:
- Experiment types (e.g., "Cell Biology", "Plant Growth", "Protein Crystallization", "Microbiology")
- Organisms (e.g., "C. elegans", "Arabidopsis", "E. coli", "Mouse tissue")
- Space conditions (e.g., "Microgravity", "Radiation Exposure", "Temperature Variation")

Respond with JSON:
{
  "suggestedFilters": {
    "experimentTypes": ["array of relevant experiment types"],
    "organisms": ["array of relevant organisms"],
    "spaceConditions": ["array of relevant space conditions"]
  },
  "enhancedQuery": "expanded and refined search query"
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are an expert in space biology research. Help users find relevant NASA publications by analyzing their search queries."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      suggestedFilters: {
        experimentTypes: result.suggestedFilters?.experimentTypes || [],
        organisms: result.suggestedFilters?.organisms || [],
        spaceConditions: result.suggestedFilters?.spaceConditions || [],
      },
      enhancedQuery: result.enhancedQuery || query,
    };
  } catch (error) {
    console.error("Error analyzing search query:", error);
    return {
      suggestedFilters: {
        experimentTypes: [],
        organisms: [],
        spaceConditions: [],
      },
      enhancedQuery: query,
    };
  }
}
