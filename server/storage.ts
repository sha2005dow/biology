import { type Publication, type InsertPublication, type Experiment, type InsertExperiment, type AiInsight, type InsertAiInsight, type SearchFilters } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Publications
  getPublications(filters?: SearchFilters): Promise<Publication[]>;
  getPublication(id: string): Promise<Publication | undefined>;
  createPublication(publication: InsertPublication): Promise<Publication>;
  updatePublication(id: string, updates: Partial<Publication>): Promise<Publication | undefined>;
  
  // Experiments
  getExperiments(): Promise<Experiment[]>;
  getExperiment(id: string): Promise<Experiment | undefined>;
  createExperiment(experiment: InsertExperiment): Promise<Experiment>;
  
  // AI Insights
  getAiInsights(): Promise<AiInsight[]>;
  createAiInsight(insight: InsertAiInsight): Promise<AiInsight>;
  
  // Statistics
  getStats(): Promise<{
    totalPublications: number;
    activeExperiments: number;
    researchAreas: number;
    aiInsights: number;
  }>;
  
  // Search and filters
  searchPublications(query: string): Promise<Publication[]>;
  getFilterOptions(): Promise<{
    experimentTypes: Array<{ value: string; count: number }>;
    organisms: Array<{ value: string; count: number }>;
    spaceConditions: Array<{ value: string; count: number }>;
    missions: Array<{ value: string; count: number }>;
  }>;
}

export class MemStorage implements IStorage {
  private publications: Map<string, Publication>;
  private experiments: Map<string, Experiment>;
  private aiInsights: Map<string, AiInsight>;

  constructor() {
    this.publications = new Map();
    this.experiments = new Map();
    this.aiInsights = new Map();
  }

  // Publications
  async getPublications(filters?: SearchFilters): Promise<Publication[]> {
    let results = Array.from(this.publications.values());

    if (filters?.query) {
      const query = filters.query.toLowerCase();
      results = results.filter(pub => 
        pub.title.toLowerCase().includes(query) ||
        pub.abstract?.toLowerCase().includes(query) ||
        pub.keywords?.some(k => k.toLowerCase().includes(query))
      );
    }

    if (filters?.experimentTypes?.length) {
      results = results.filter(pub => 
        pub.experimentTypes?.some(type => filters.experimentTypes!.includes(type))
      );
    }

    if (filters?.organisms?.length) {
      results = results.filter(pub => 
        pub.organisms?.some(org => filters.organisms!.includes(org))
      );
    }

    if (filters?.spaceConditions?.length) {
      results = results.filter(pub => 
        pub.spaceConditions?.some(cond => filters.spaceConditions!.includes(cond))
      );
    }

    if (filters?.mission) {
      results = results.filter(pub => pub.mission === filters.mission);
    }

    if (filters?.dateRange?.start || filters?.dateRange?.end) {
      results = results.filter(pub => {
        if (!pub.publishedDate) return false;
        const pubDate = new Date(pub.publishedDate);
        if (filters.dateRange?.start && pubDate < new Date(filters.dateRange.start)) return false;
        if (filters.dateRange?.end && pubDate > new Date(filters.dateRange.end)) return false;
        return true;
      });
    }

    return results.sort((a, b) => {
      const aDate = a.publishedDate ? new Date(a.publishedDate) : new Date(0);
      const bDate = b.publishedDate ? new Date(b.publishedDate) : new Date(0);
      return bDate.getTime() - aDate.getTime();
    });
  }

  async getPublication(id: string): Promise<Publication | undefined> {
    return this.publications.get(id);
  }

  async createPublication(insertPublication: InsertPublication): Promise<Publication> {
    const id = randomUUID();
    const now = new Date();
    const publication: Publication = {
      ...insertPublication,
      id,
      createdAt: now,
      updatedAt: now,
      // Ensure required fields have proper defaults
      experimentTypes: Array.isArray(insertPublication.experimentTypes) ? insertPublication.experimentTypes : [],
      organisms: Array.isArray(insertPublication.organisms) ? insertPublication.organisms : [],
      spaceConditions: Array.isArray(insertPublication.spaceConditions) ? insertPublication.spaceConditions : [],
      keywords: Array.isArray(insertPublication.keywords) ? insertPublication.keywords : [],
      authors: Array.isArray(insertPublication.authors) ? insertPublication.authors : [],
      citationCount: insertPublication.citationCount || 0,
      viewCount: insertPublication.viewCount || 0,
      isProcessed: insertPublication.isProcessed || false,
    };
    this.publications.set(id, publication);
    return publication;
  }

  async updatePublication(id: string, updates: Partial<Publication>): Promise<Publication | undefined> {
    const existing = this.publications.get(id);
    if (!existing) return undefined;

    const updated: Publication = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };
    this.publications.set(id, updated);
    return updated;
  }

  // Experiments
  async getExperiments(): Promise<Experiment[]> {
    return Array.from(this.experiments.values()).sort((a, b) => {
      const aDate = a.startDate ? new Date(a.startDate) : new Date(0);
      const bDate = b.startDate ? new Date(b.startDate) : new Date(0);
      return bDate.getTime() - aDate.getTime();
    });
  }

  async getExperiment(id: string): Promise<Experiment | undefined> {
    return this.experiments.get(id);
  }

  async createExperiment(insertExperiment: InsertExperiment): Promise<Experiment> {
    const id = randomUUID();
    const experiment: Experiment = {
      ...insertExperiment,
      id,
      createdAt: new Date(),
      // Ensure required fields have proper defaults
      organisms: Array.isArray(insertExperiment.organisms) ? insertExperiment.organisms : [],
      conditions: Array.isArray(insertExperiment.conditions) ? insertExperiment.conditions : [],
      objectives: Array.isArray(insertExperiment.objectives) ? insertExperiment.objectives : [],
      publicationIds: Array.isArray(insertExperiment.publicationIds) ? insertExperiment.publicationIds : [],
    };
    this.experiments.set(id, experiment);
    return experiment;
  }

  // AI Insights
  async getAiInsights(): Promise<AiInsight[]> {
    return Array.from(this.aiInsights.values()).sort((a, b) => {
      const aDate = a.createdAt ? new Date(a.createdAt) : new Date(0);
      const bDate = b.createdAt ? new Date(b.createdAt) : new Date(0);
      return bDate.getTime() - aDate.getTime();
    });
  }

  async createAiInsight(insertAiInsight: InsertAiInsight): Promise<AiInsight> {
    const id = randomUUID();
    const insight: AiInsight = {
      ...insertAiInsight,
      id,
      createdAt: new Date(),
      // Ensure required fields have proper defaults
      relatedPublications: Array.isArray(insertAiInsight.relatedPublications) ? insertAiInsight.relatedPublications : [],
      relatedExperiments: Array.isArray(insertAiInsight.relatedExperiments) ? insertAiInsight.relatedExperiments : [],
      metadata: insertAiInsight.metadata || {},
      confidence: insertAiInsight.confidence || 0,
    };
    this.aiInsights.set(id, insight);
    return insight;
  }

  // Statistics
  async getStats(): Promise<{
    totalPublications: number;
    activeExperiments: number;
    researchAreas: number;
    aiInsights: number;
  }> {
    const activeExperiments = Array.from(this.experiments.values()).filter(exp => exp.status === 'active').length;
    const researchAreas = new Set(
      Array.from(this.publications.values()).flatMap(pub => pub.experimentTypes || [])
    ).size;

    return {
      totalPublications: this.publications.size,
      activeExperiments,
      researchAreas,
      aiInsights: this.aiInsights.size,
    };
  }

  // Search and filters
  async searchPublications(query: string): Promise<Publication[]> {
    return this.getPublications({ query });
  }

  async getFilterOptions(): Promise<{
    experimentTypes: Array<{ value: string; count: number }>;
    organisms: Array<{ value: string; count: number }>;
    spaceConditions: Array<{ value: string; count: number }>;
    missions: Array<{ value: string; count: number }>;
  }> {
    const publications = Array.from(this.publications.values());
    
    const experimentTypeCounts = new Map<string, number>();
    const organismCounts = new Map<string, number>();
    const conditionCounts = new Map<string, number>();
    const missionCounts = new Map<string, number>();

    publications.forEach(pub => {
      pub.experimentTypes?.forEach(type => {
        experimentTypeCounts.set(type, (experimentTypeCounts.get(type) || 0) + 1);
      });
      pub.organisms?.forEach(org => {
        organismCounts.set(org, (organismCounts.get(org) || 0) + 1);
      });
      pub.spaceConditions?.forEach(cond => {
        conditionCounts.set(cond, (conditionCounts.get(cond) || 0) + 1);
      });
      if (pub.mission) {
        missionCounts.set(pub.mission, (missionCounts.get(pub.mission) || 0) + 1);
      }
    });

    return {
      experimentTypes: Array.from(experimentTypeCounts.entries()).map(([value, count]) => ({ value, count })),
      organisms: Array.from(organismCounts.entries()).map(([value, count]) => ({ value, count })),
      spaceConditions: Array.from(conditionCounts.entries()).map(([value, count]) => ({ value, count })),
      missions: Array.from(missionCounts.entries()).map(([value, count]) => ({ value, count })),
    };
  }
}

export const storage = new MemStorage();
