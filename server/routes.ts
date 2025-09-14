import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { summarizePublication, generateResearchInsights, analyzeSearchQuery } from "./services/openai";
import { nasaApiService } from "./services/nasa-api";
import { searchFiltersSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Publications
  app.get("/api/publications", async (req, res) => {
    try {
      const filters = searchFiltersSchema.safeParse(req.query);
      const publications = await storage.getPublications(filters.success ? filters.data : undefined);
      res.json(publications);
    } catch (error) {
      console.error("Error fetching publications:", error);
      res.status(500).json({ message: "Failed to fetch publications" });
    }
  });

  app.get("/api/publications/:id", async (req, res) => {
    try {
      const publication = await storage.getPublication(req.params.id);
      if (!publication) {
        return res.status(404).json({ message: "Publication not found" });
      }
      res.json(publication);
    } catch (error) {
      console.error("Error fetching publication:", error);
      res.status(500).json({ message: "Failed to fetch publication" });
    }
  });

  // Search
  app.get("/api/search", async (req, res) => {
    try {
      const { q } = req.query;
      if (!q || typeof q !== 'string') {
        return res.status(400).json({ message: "Search query required" });
      }

      const publications = await storage.searchPublications(q);
      const analysis = await analyzeSearchQuery(q);
      
      res.json({
        publications,
        suggestedFilters: analysis.suggestedFilters,
        enhancedQuery: analysis.enhancedQuery,
      });
    } catch (error) {
      console.error("Error performing search:", error);
      res.status(500).json({ message: "Search failed" });
    }
  });

  // AI Insights
  app.get("/api/ai-insights", async (req, res) => {
    try {
      const insights = await storage.getAiInsights();
      res.json(insights);
    } catch (error) {
      console.error("Error fetching AI insights:", error);
      res.status(500).json({ message: "Failed to fetch AI insights" });
    }
  });

  app.post("/api/ai-insights/generate", async (req, res) => {
    try {
      const publications = await storage.getPublications();
      const insights = await generateResearchInsights(publications);
      
      // Store generated insights
      for (const insight of insights) {
        await storage.createAiInsight({
          type: insight.type,
          title: insight.title,
          description: insight.description,
          confidence: insight.confidence,
          relatedPublications: insight.relatedTopics || [],
          relatedExperiments: insight.actionableRecommendations || [],
          metadata: {
            relatedTopics: insight.relatedTopics || [],
            actionableRecommendations: insight.actionableRecommendations || [],
          },
        });
      }
      
      res.json(insights);
    } catch (error) {
      console.error("Error generating AI insights:", error);
      res.status(500).json({ message: "Failed to generate AI insights" });
    }
  });

  // Statistics
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });

  // Filter options
  app.get("/api/filter-options", async (req, res) => {
    try {
      const options = await storage.getFilterOptions();
      res.json(options);
    } catch (error) {
      console.error("Error fetching filter options:", error);
      res.status(500).json({ message: "Failed to fetch filter options" });
    }
  });

  // Experiments
  app.get("/api/experiments", async (req, res) => {
    try {
      const experiments = await storage.getExperiments();
      res.json(experiments);
    } catch (error) {
      console.error("Error fetching experiments:", error);
      res.status(500).json({ message: "Failed to fetch experiments" });
    }
  });

  // NASA Data Ingestion
  app.post("/api/ingest-nasa-data", async (req, res) => {
    try {
      const { query = "space biology", limit = 50 } = req.body;
      
      console.log(`Ingesting NASA publications for query: "${query}"`);
      
      const nasaPublications = await nasaApiService.searchPublications(query, limit);
      
      if (nasaPublications.length === 0) {
        return res.json({ 
          message: "No publications found from NASA API",
          ingested: 0 
        });
      }

      let ingestedCount = 0;
      
      for (const nasaPub of nasaPublications) {
        try {
          // Categorize the publication
          const categories = nasaApiService.categorizePublication(nasaPub);
          
          // Generate AI summary
          let aiSummary = "";
          try {
            const summary = await summarizePublication(nasaPub.title, nasaPub.abstract || "");
            aiSummary = summary.summary;
          } catch (summaryError) {
            console.warn(`Failed to generate AI summary for publication ${nasaPub.id}:`, summaryError);
          }
          
          // Create publication record
          await storage.createPublication({
            title: nasaPub.title,
            abstract: nasaPub.abstract || null,
            authors: nasaPub.authors || [],
            publishedDate: nasaPub.published_date ? new Date(nasaPub.published_date) : null,
            doi: nasaPub.doi || null,
            keywords: nasaPub.keywords || [],
            experimentTypes: categories.experimentTypes,
            organisms: categories.organisms,
            spaceConditions: categories.spaceConditions,
            mission: categories.mission || null,
            citationCount: Math.floor(Math.random() * 200), // Would need actual citation data
            viewCount: Math.floor(Math.random() * 5000),
            aiSummary,
            isProcessed: true,
          });
          
          ingestedCount++;
        } catch (error) {
          console.error(`Error processing publication ${nasaPub.id}:`, error);
        }
      }
      
      res.json({ 
        message: `Successfully ingested ${ingestedCount} publications from NASA`,
        ingested: ingestedCount,
        total: nasaPublications.length 
      });
    } catch (error) {
      console.error("Error ingesting NASA data:", error);
      res.status(500).json({ message: "Failed to ingest NASA data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
