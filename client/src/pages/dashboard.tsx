import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import StatsOverview from "@/components/stats-overview";
import KnowledgeGraph from "@/components/knowledge-graph";
import PublicationCard from "@/components/publication-card";
import ResearchTimeline from "@/components/research-timeline";
import { api } from "@/lib/api";
import type { SearchFilters } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

export default function Dashboard() {
  const [filters, setFilters] = useState<SearchFilters>({});
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const { data: publications = [], isLoading: publicationsLoading } = useQuery({
    queryKey: ['/api/publications', filters],
    queryFn: () => api.getPublications(filters),
  });

  const { data: stats } = useQuery({
    queryKey: ['/api/stats'],
    queryFn: () => api.getStats(),
  });

  const { data: filterOptions } = useQuery({
    queryKey: ['/api/filter-options'],
    queryFn: () => api.getFilterOptions(),
  });

  const { data: experiments = [] } = useQuery({
    queryKey: ['/api/experiments'],
    queryFn: () => api.getExperiments(),
  });

  const { data: aiInsights = [] } = useQuery({
    queryKey: ['/api/ai-insights'],
    queryFn: () => api.getAiInsights(),
  });

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
    
    try {
      const searchResults = await api.search(query);
      setFilters({ query });
      setSearchQuery(query);
      
      toast({
        title: "Search completed",
        description: `Found ${searchResults.publications.length} publications`,
      });
    } catch (error) {
      toast({
        title: "Search failed",
        description: "Unable to perform search. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleGenerateInsights = async () => {
    try {
      await api.generateAiInsights();
      // Invalidate AI insights cache to refresh the data
      queryClient.invalidateQueries({ queryKey: ['/api/ai-insights'] });
      toast({
        title: "AI insights generated",
        description: "New research insights have been generated successfully.",
      });
    } catch (error) {
      toast({
        title: "Failed to generate insights",
        description: "Unable to generate AI insights. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleIngestData = async () => {
    try {
      const result = await api.ingestNasaData("space biology", 25);
      
      // Invalidate all data caches to refresh the dashboard
      queryClient.invalidateQueries({ queryKey: ['/api/publications'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
      queryClient.invalidateQueries({ queryKey: ['/api/filter-options'] });
      queryClient.invalidateQueries({ queryKey: ['/api/experiments'] });
      
      toast({
        title: "Data ingestion completed",
        description: result.message,
      });
    } catch (error) {
      toast({
        title: "Data ingestion failed",
        description: "Unable to ingest NASA data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const featuredPublication = publications.find(pub => pub.citationCount > 100) || publications[0];
  const recentPublications = publications.slice(0, 4);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header onSearch={handleSearch} />
      
      <div className="flex">
        <Sidebar 
          filters={filters}
          onFiltersChange={setFilters}
          filterOptions={filterOptions}
        />
        
        <main className="flex-1 p-6 space-y-6 max-w-full">
          {/* AI Insights Banner */}
          <div className="bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 rounded-lg p-4" data-testid="ai-insights-section">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Brain className="text-accent ai-processing" size={24} />
                <div>
                  <h3 className="font-semibold text-foreground">AI Analysis</h3>
                  <p className="text-sm text-muted-foreground">
                    {aiInsights.length > 0 
                      ? `${aiInsights.length} insights available from recent analysis`
                      : "Generate insights from current publications"
                    }
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button 
                  onClick={handleGenerateInsights}
                  className="bg-accent text-accent-foreground hover:bg-accent/90"
                  data-testid="button-generate-insights"
                >
                  Generate Insights
                </Button>
                <Button 
                  onClick={handleIngestData}
                  variant="outline"
                  data-testid="button-ingest-data"
                >
                  Ingest NASA Data
                </Button>
              </div>
            </div>
            
            {/* Display AI Insights */}
            {aiInsights.length > 0 && (
              <div className="mt-4 space-y-3">
                <h4 className="text-sm font-medium text-foreground">Recent Insights</h4>
                {aiInsights.slice(0, 3).map((insight) => (
                  <div key={insight.id} className="bg-background/50 rounded-lg p-3 border border-border/50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h5 className="text-sm font-medium text-foreground">{insight.title}</h5>
                        <p className="text-xs text-muted-foreground mt-1">{insight.description}</p>
                        <div className="flex items-center mt-2 space-x-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            insight.type === 'correlation' ? 'bg-chart-1/20 text-chart-1' :
                            insight.type === 'trend' ? 'bg-chart-2/20 text-chart-2' :
                            'bg-chart-3/20 text-chart-3'
                          }`}>
                            {insight.type}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {insight.confidence}% confidence
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Stats Overview */}
          <StatsOverview stats={stats} />

          {/* Knowledge Graph */}
          <KnowledgeGraph publications={publications} experiments={experiments} />

          {/* Publications Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Featured Publication */}
            {featuredPublication && (
              <div className="lg:col-span-2">
                <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <i className="fas fa-star text-accent text-lg"></i>
                      <div>
                        <h4 className="font-semibold text-foreground">Featured Research</h4>
                        <p className="text-sm text-muted-foreground">AI-recommended based on impact</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-accent text-accent-foreground text-xs rounded-lg font-medium">
                      High Impact
                    </span>
                  </div>
                  
                  <PublicationCard publication={featuredPublication} featured />
                </div>
              </div>
            )}

            {/* Recent Publications */}
            {publicationsLoading ? (
              <div className="lg:col-span-2 flex items-center justify-center py-8">
                <Loader2 className="animate-spin" size={32} />
                <span className="ml-2 text-muted-foreground">Loading publications...</span>
              </div>
            ) : recentPublications.length === 0 ? (
              <div className="lg:col-span-2">
                <Card>
                  <CardContent className="py-8 text-center">
                    <p className="text-muted-foreground mb-4">No publications found</p>
                    <Button onClick={handleIngestData} data-testid="button-ingest-initial-data">
                      Load NASA Publications
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ) : (
              recentPublications.slice(featuredPublication ? 1 : 0).map((publication) => (
                <PublicationCard 
                  key={publication.id} 
                  publication={publication}
                  data-testid={`card-publication-${publication.id}`}
                />
              ))
            )}
          </div>

          {/* Research Timeline */}
          <ResearchTimeline experiments={experiments} />
        </main>
      </div>
    </div>
  );
}
