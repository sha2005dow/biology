import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Rocket, Search, Brain } from "lucide-react";

interface HeaderProps {
  onSearch: (query: string) => void;
}

export default function Header({ onSearch }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <Rocket className="text-2xl text-primary" size={32} />
              <div>
                <h1 className="text-xl font-bold text-foreground">Space Biology Knowledge Engine</h1>
                <p className="text-sm text-muted-foreground">NASA Research Dashboard</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <form onSubmit={handleSubmit} className="relative">
              <Input 
                type="search" 
                placeholder="Search experiments, organisms, conditions..." 
                className="w-96 pl-10 bg-input border-border text-foreground placeholder-muted-foreground"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search"
              />
              <Search className="absolute left-3 top-3 text-muted-foreground" size={16} />
            </form>
            
            <Button 
              className="bg-primary text-primary-foreground hover:bg-primary/90" 
              data-testid="button-ai-insights"
              onClick={() => {
                // Scroll to AI insights section or show insights modal
                const insightsSection = document.querySelector('[data-testid="ai-insights-section"]');
                if (insightsSection) {
                  insightsSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              <Brain size={16} className="mr-2" />
              AI Insights
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
