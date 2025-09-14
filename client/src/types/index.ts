export interface Publication {
  id: string;
  title: string;
  abstract?: string;
  authors: string[];
  publishedDate?: Date;
  doi?: string;
  keywords: string[];
  experimentTypes: string[];
  organisms: string[];
  spaceConditions: string[];
  mission?: string;
  citationCount: number;
  viewCount: number;
  aiSummary?: string;
  isProcessed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Experiment {
  id: string;
  name: string;
  description?: string;
  type: string;
  status: string;
  startDate?: Date;
  endDate?: Date;
  mission?: string;
  organisms: string[];
  conditions: string[];
  objectives: string[];
  results?: string;
  publicationIds: string[];
  createdAt: Date;
}

export interface AiInsight {
  id: string;
  type: "correlation" | "trend" | "recommendation";
  title: string;
  description: string;
  confidence: number;
  relatedPublications: string[];
  relatedExperiments: string[];
  metadata: Record<string, any>;
  createdAt: Date;
}

export interface SearchFilters {
  query?: string;
  experimentTypes?: string[];
  organisms?: string[];
  spaceConditions?: string[];
  dateRange?: {
    start?: string;
    end?: string;
  };
  mission?: string;
}

export interface DashboardStats {
  totalPublications: number;
  activeExperiments: number;
  researchAreas: number;
  aiInsights: number;
}

export interface FilterOptions {
  experimentTypes: Array<{ value: string; count: number }>;
  organisms: Array<{ value: string; count: number }>;
  spaceConditions: Array<{ value: string; count: number }>;
  missions: Array<{ value: string; count: number }>;
}

export interface KnowledgeGraphNode {
  id: string;
  label: string;
  type: string;
  x: number;
  y: number;
  size: number;
  color: string;
}

export interface KnowledgeGraphLink {
  source: string;
  target: string;
  strength: number;
}
