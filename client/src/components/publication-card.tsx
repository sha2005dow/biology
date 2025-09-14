import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Calendar, Quote, Eye } from "lucide-react";
import type { Publication } from "@/types";

interface PublicationCardProps {
  publication: Publication;
  featured?: boolean;
}

export default function PublicationCard({ publication, featured = false }: PublicationCardProps) {
  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "Date not available";
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const getExperimentTypeIcon = (type: string) => {
    const icons = {
      'Cell Biology': 'fa-microscope',
      'Plant Growth': 'fa-seedling',
      'Protein Crystallization': 'fa-atom',
      'Microbiology': 'fa-bacteria',
      'Tissue Engineering': 'fa-dna',
    };
    return icons[type as keyof typeof icons] || 'fa-flask';
  };

  const getExperimentTypeColor = (type: string) => {
    const colors = {
      'Cell Biology': 'text-chart-2',
      'Plant Growth': 'text-chart-4',
      'Protein Crystallization': 'text-chart-3',
      'Microbiology': 'text-chart-1',
      'Tissue Engineering': 'text-chart-5',
    };
    return colors[type as keyof typeof colors] || 'text-primary';
  };

  if (featured) {
    return (
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          {publication.title}
        </h3>
        
        <p className="text-sm text-muted-foreground mb-4">
          {publication.abstract || publication.aiSummary || "No description available"}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {publication.experimentTypes.map(type => (
            <Badge 
              key={type} 
              variant="secondary" 
              className="bg-chart-2/20 text-chart-2"
            >
              {type}
            </Badge>
          ))}
          {publication.spaceConditions.map(condition => (
            <Badge 
              key={condition} 
              variant="secondary" 
              className="bg-chart-1/20 text-chart-1"
            >
              {condition}
            </Badge>
          ))}
          {publication.mission && (
            <Badge 
              variant="secondary" 
              className="bg-chart-4/20 text-chart-4"
            >
              {publication.mission}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span className="flex items-center">
              <Calendar size={14} className="mr-1" />
              Published: {formatDate(publication.publishedDate)}
            </span>
            <span className="flex items-center">
              <Quote size={14} className="mr-1" />
              Cited: {publication.citationCount} times
            </span>
            <span className="flex items-center">
              <Eye size={14} className="mr-1" />
              Views: {publication.viewCount.toLocaleString()}
            </span>
          </div>
          <Button data-testid={`button-view-study-${publication.id}`}>
            View Full Study
          </Button>
        </div>
      </div>
    );
  }

  const primaryType = publication.experimentTypes[0] || 'Research';

  return (
    <Card className="experiment-card border-border hover:border-primary/50 transition-colors">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <i className={`fas ${getExperimentTypeIcon(primaryType)} ${getExperimentTypeColor(primaryType)}`}></i>
            <span className={`text-xs font-medium ${getExperimentTypeColor(primaryType)}`}>
              {primaryType}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">
            {formatDate(publication.publishedDate)}
          </span>
        </div>
        
        <h4 className="font-semibold text-foreground mb-2">
          {publication.title}
        </h4>
        
        <p className="text-sm text-muted-foreground mb-3">
          {publication.abstract?.slice(0, 150) || publication.aiSummary?.slice(0, 150) || "No description available"}
          {(publication.abstract || publication.aiSummary || "").length > 150 && "..."}
        </p>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {publication.keywords.slice(0, 2).map(keyword => (
            <Badge 
              key={keyword} 
              variant="outline" 
              className="bg-muted/50 text-muted-foreground text-xs"
            >
              {keyword}
            </Badge>
          ))}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            <Quote size={12} className="inline mr-1" />
            {publication.citationCount} citations
          </div>
          <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80" data-testid={`button-read-more-${publication.id}`}>
            <span className="mr-1">Read More</span>
            <ArrowRight size={14} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
