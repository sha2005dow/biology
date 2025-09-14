import { Card, CardContent } from "@/components/ui/card";
import { FileText, FlaskConical, Microscope, Brain } from "lucide-react";
import type { DashboardStats } from "@/types";

interface StatsOverviewProps {
  stats?: DashboardStats;
}

export default function StatsOverview({ stats }: StatsOverviewProps) {
  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-16 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statItems = [
    {
      label: "Total Publications",
      value: stats.totalPublications.toLocaleString(),
      icon: FileText,
      color: "text-chart-1",
      change: "+12% from last quarter",
      changeColor: "text-chart-1",
      testId: "stat-total-publications"
    },
    {
      label: "Active Experiments",
      value: stats.activeExperiments.toString(),
      icon: FlaskConical,
      color: "text-chart-2",
      change: "23 ongoing missions",
      changeColor: "text-chart-2",
      testId: "stat-active-experiments"
    },
    {
      label: "Research Areas",
      value: stats.researchAreas.toString(),
      icon: Microscope,
      color: "text-chart-3",
      change: "8 emerging fields",
      changeColor: "text-chart-3",
      testId: "stat-research-areas"
    },
    {
      label: "AI Insights",
      value: stats.aiInsights.toLocaleString(),
      icon: Brain,
      color: "text-accent",
      change: "Generated correlations",
      changeColor: "text-accent",
      testId: "stat-ai-insights"
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {statItems.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.label} className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <p className="text-2xl font-bold text-foreground" data-testid={item.testId}>
                    {item.value}
                  </p>
                </div>
                <Icon className={`text-2xl ${item.color}`} size={32} />
              </div>
              <p className={`text-xs ${item.changeColor} mt-2`}>
                {item.change}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
