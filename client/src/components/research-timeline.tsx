import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Experiment } from "@/types";

interface ResearchTimelineProps {
  experiments: Experiment[];
}

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  tags: string[];
  type: string;
}

export default function ResearchTimeline({ experiments }: ResearchTimelineProps) {
  // Static timeline events based on major space biology milestones
  const timelineEvents: TimelineEvent[] = [
    {
      year: "2001",
      title: "ISS Cell Science Program Launch",
      description: "First comprehensive cell biology experiments aboard the International Space Station",
      tags: ["Cell Biology", "ISS"],
      type: "milestone"
    },
    {
      year: "2017",
      title: "Advanced Plant Habitat Installation",
      description: "Automated plant growth facility enables long-term botanical studies in space",
      tags: ["Plant Biology", "Hardware"],
      type: "facility"
    },
    {
      year: "2019",
      title: "Tissue Chips in Space Initiative",
      description: "Groundbreaking organ-on-chip technology tests disease models in microgravity",
      tags: ["Tissue Engineering", "Medical"],
      type: "initiative"
    },
    {
      year: "2023",
      title: "AI-Powered Analysis Integration",
      description: "Machine learning algorithms begin automated analysis of space biology data",
      tags: ["AI/ML", "Data Science"],
      type: "technology"
    },
  ];

  // Add recent experiments to timeline if available
  const recentExperiments = experiments
    .filter(exp => exp.startDate)
    .sort((a, b) => new Date(b.startDate!).getTime() - new Date(a.startDate!).getTime())
    .slice(0, 3)
    .map(exp => ({
      year: new Date(exp.startDate!).getFullYear().toString(),
      title: exp.name,
      description: exp.description || "Space biology experiment",
      tags: exp.organisms.slice(0, 2),
      type: "experiment"
    }));

  const allEvents = [...timelineEvents, ...recentExperiments]
    .sort((a, b) => parseInt(a.year) - parseInt(b.year));

  const getTagColor = (tag: string) => {
    const colors = {
      'Cell Biology': 'bg-chart-1/20 text-chart-1',
      'Plant Biology': 'bg-chart-4/20 text-chart-4',
      'ISS': 'bg-chart-2/20 text-chart-2',
      'Hardware': 'bg-chart-3/20 text-chart-3',
      'Tissue Engineering': 'bg-chart-5/20 text-chart-5',
      'Medical': 'bg-accent/20 text-accent',
      'AI/ML': 'bg-accent/20 text-accent',
      'Data Science': 'bg-primary/20 text-primary',
    };
    return colors[tag as keyof typeof colors] || 'bg-muted/50 text-muted-foreground';
  };

  return (
    <Card className="bg-card border-border">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Research Timeline</h3>
            <p className="text-sm text-muted-foreground">Evolution of space biology research over time</p>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="default" 
              size="sm"
              onClick={() => {
                // Show all timeline items
                const timelineItems = document.querySelectorAll('[data-testid^="timeline-item-"]');
                timelineItems.forEach(item => {
                  (item as HTMLElement).style.display = 'block';
                });
              }}
            >
              All
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                // Filter timeline items to show only biology-related
                const timelineItems = document.querySelectorAll('[data-testid^="timeline-item-"]');
                timelineItems.forEach(item => {
                  const content = item.textContent?.toLowerCase() || '';
                  (item as HTMLElement).style.display = 
                    content.includes('biology') || content.includes('cell') || content.includes('plant') ? 'block' : 'none';
                });
              }}
            >
              Biology
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                // Filter timeline items to show only physics-related
                const timelineItems = document.querySelectorAll('[data-testid^="timeline-item-"]');
                timelineItems.forEach(item => {
                  const content = item.textContent?.toLowerCase() || '';
                  (item as HTMLElement).style.display = 
                    content.includes('physics') || content.includes('radiation') || content.includes('gravity') ? 'block' : 'none';
                });
              }}
            >
              Physics
            </Button>
          </div>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border"></div>
          
          {/* Timeline items */}
          <div className="space-y-6 relative">
            {allEvents.map((event, index) => (
              <div 
                key={`${event.year}-${index}`} 
                className="timeline-item relative pl-12"
                data-testid={`timeline-item-${event.year}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{event.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {event.description}
                    </p>
                    <div className="flex space-x-2 mt-2">
                      {event.tags.map(tag => (
                        <Badge 
                          key={tag} 
                          variant="secondary" 
                          className={`text-xs ${getTagColor(tag)}`}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">
                    {event.year}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
