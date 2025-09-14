import { apiRequest } from "./queryClient";
import type { Publication, Experiment, AiInsight, SearchFilters, DashboardStats, FilterOptions } from "@/types";

export const api = {
  // Publications
  getPublications: async (filters?: SearchFilters): Promise<Publication[]> => {
    const params = new URLSearchParams();
    if (filters?.query) params.append('query', filters.query);
    if (filters?.experimentTypes?.length) {
      filters.experimentTypes.forEach(type => params.append('experimentTypes', type));
    }
    if (filters?.organisms?.length) {
      filters.organisms.forEach(org => params.append('organisms', org));
    }
    if (filters?.spaceConditions?.length) {
      filters.spaceConditions.forEach(cond => params.append('spaceConditions', cond));
    }
    if (filters?.mission) params.append('mission', filters.mission);
    if (filters?.dateRange?.start) params.append('dateRange[start]', filters.dateRange.start);
    if (filters?.dateRange?.end) params.append('dateRange[end]', filters.dateRange.end);

    const response = await apiRequest('GET', `/api/publications?${params.toString()}`);
    return response.json();
  },

  getPublication: async (id: string): Promise<Publication> => {
    const response = await apiRequest('GET', `/api/publications/${id}`);
    return response.json();
  },

  // Search
  search: async (query: string): Promise<{
    publications: Publication[];
    suggestedFilters: {
      experimentTypes: string[];
      organisms: string[];
      spaceConditions: string[];
    };
    enhancedQuery: string;
  }> => {
    const response = await apiRequest('GET', `/api/search?q=${encodeURIComponent(query)}`);
    return response.json();
  },

  // AI Insights
  getAiInsights: async (): Promise<AiInsight[]> => {
    const response = await apiRequest('GET', '/api/ai-insights');
    return response.json();
  },

  generateAiInsights: async (): Promise<AiInsight[]> => {
    const response = await apiRequest('POST', '/api/ai-insights/generate');
    return response.json();
  },

  // Statistics
  getStats: async (): Promise<DashboardStats> => {
    const response = await apiRequest('GET', '/api/stats');
    return response.json();
  },

  // Filter options
  getFilterOptions: async (): Promise<FilterOptions> => {
    const response = await apiRequest('GET', '/api/filter-options');
    return response.json();
  },

  // Experiments
  getExperiments: async (): Promise<Experiment[]> => {
    const response = await apiRequest('GET', '/api/experiments');
    return response.json();
  },

  // NASA Data Ingestion
  ingestNasaData: async (query?: string, limit?: number): Promise<{
    message: string;
    ingested: number;
    total?: number;
  }> => {
    const response = await apiRequest('POST', '/api/ingest-nasa-data', {
      query: query || 'space biology',
      limit: limit || 50,
    });
    return response.json();
  },
};
