import { useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Maximize2, Download } from "lucide-react";
import type { Publication, Experiment } from "@/types";

interface KnowledgeGraphProps {
  publications: Publication[];
  experiments: Experiment[];
}

export default function KnowledgeGraph({ publications, experiments }: KnowledgeGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || publications.length === 0) return;

    // Simple static visualization matching the design
    const svg = svgRef.current;
    const rect = svg.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Clear existing content
    svg.innerHTML = '';

    // Create connection lines
    const lines = [
      { x1: centerX, y1: centerY, x2: centerX * 0.5, y2: centerY * 0.5 },
      { x1: centerX, y1: centerY, x2: centerX * 1.5, y2: centerY * 0.6 },
      { x1: centerX, y1: centerY, x2: centerX * 0.4, y2: centerY * 1.4 },
      { x1: centerX, y1: centerY, x2: centerX * 1.6, y2: centerY * 1.5 },
      { x1: centerX, y1: centerY, x2: centerX * 1.2, y2: centerY * 0.3 },
    ];

    lines.forEach(line => {
      const lineElement = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      lineElement.setAttribute('x1', line.x1.toString());
      lineElement.setAttribute('y1', line.y1.toString());
      lineElement.setAttribute('x2', line.x2.toString());
      lineElement.setAttribute('y2', line.y2.toString());
      lineElement.setAttribute('stroke', 'hsl(var(--border))');
      lineElement.setAttribute('stroke-width', '2');
      lineElement.setAttribute('opacity', '0.5');
      svg.appendChild(lineElement);
    });

  }, [publications, experiments]);

  const getExperimentTypeColor = (type: string) => {
    const colors = {
      'Cell Biology': 'hsl(var(--chart-1))',
      'Plant Growth': 'hsl(var(--chart-2))',
      'Protein Crystallization': 'hsl(var(--chart-3))',
      'Microbiology': 'hsl(var(--chart-4))',
      'Tissue Engineering': 'hsl(var(--chart-5))',
    };
    return colors[type as keyof typeof colors] || 'hsl(var(--primary))';
  };

  const uniqueExperimentTypes = Array.from(
    new Set(publications.flatMap(pub => pub.experimentTypes))
  ).slice(0, 5);

  return (
    <Card className="bg-card border-border">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Knowledge Graph</h3>
            <p className="text-sm text-muted-foreground">Experiment relationships and cross-connections</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" data-testid="button-fullscreen-graph">
              <Maximize2 size={16} className="mr-1" />
              Fullscreen
            </Button>
            <Button variant="default" size="sm" data-testid="button-export-graph">
              <Download size={16} className="mr-1" />
              Export
            </Button>
          </div>
        </div>

        <div className="relative h-96 bg-muted/10 rounded-lg overflow-hidden">
          <svg
            ref={svgRef}
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 400 300"
            data-testid="knowledge-graph-svg"
          />
          
          {/* Central node */}
          <div 
            className="knowledge-node absolute bg-primary text-primary-foreground rounded-full w-20 h-20 flex items-center justify-center font-semibold text-sm transform -translate-x-1/2 -translate-y-1/2 cursor-pointer" 
            style={{ left: '50%', top: '50%' }}
            data-testid="node-central-iss"
          >
            <div className="text-center">
              <div className="text-xs">ISS</div>
              <div className="text-xs opacity-75">Research</div>
            </div>
          </div>
          
          {/* Connected nodes */}
          {uniqueExperimentTypes.map((type, index) => {
            const positions = [
              { left: '25%', top: '25%' },
              { left: '75%', top: '30%' },
              { left: '20%', top: '70%' },
              { left: '80%', top: '75%' },
              { left: '60%', top: '15%' },
            ];
            
            const position = positions[index] || positions[0];
            const size = 14 + Math.random() * 4; // Varying sizes
            
            return (
              <div
                key={type}
                className="knowledge-node absolute rounded-full flex items-center justify-center text-xs font-medium cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: position.left,
                  top: position.top,
                  width: `${size * 0.25}rem`,
                  height: `${size * 0.25}rem`,
                  backgroundColor: getExperimentTypeColor(type),
                  color: type.includes('Plant') ? 'hsl(var(--background))' : 'hsl(var(--primary-foreground))',
                }}
                data-testid={`node-${type.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className="text-center leading-tight">
                  {type.split(' ').map((word, i) => (
                    <div key={i} className="text-xs">{word}</div>
                  ))}
                </div>
              </div>
            );
          })}
          
          {/* Legend */}
          <div className="absolute bottom-4 left-4">
            <div className="flex space-x-4 text-xs text-muted-foreground">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'hsl(var(--chart-1))' }}></div>
                <span>Biology</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'hsl(var(--chart-2))' }}></div>
                <span>Botany</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'hsl(var(--chart-3))' }}></div>
                <span>Chemistry</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
