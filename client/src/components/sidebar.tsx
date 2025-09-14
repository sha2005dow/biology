import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import type { SearchFilters, FilterOptions } from "@/types";

interface SidebarProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  filterOptions?: FilterOptions;
}

export default function Sidebar({ filters, onFiltersChange, filterOptions }: SidebarProps) {
  const handleExperimentTypeChange = (type: string, checked: boolean) => {
    const current = filters.experimentTypes || [];
    const updated = checked 
      ? [...current, type]
      : current.filter(t => t !== type);
    
    onFiltersChange({ ...filters, experimentTypes: updated });
  };

  const handleOrganismChange = (organism: string, checked: boolean) => {
    const current = filters.organisms || [];
    const updated = checked 
      ? [...current, organism]
      : current.filter(o => o !== organism);
    
    onFiltersChange({ ...filters, organisms: updated });
  };

  const handleSpaceConditionChange = (condition: string, checked: boolean) => {
    const current = filters.spaceConditions || [];
    const updated = checked 
      ? [...current, condition]
      : current.filter(c => c !== condition);
    
    onFiltersChange({ ...filters, spaceConditions: updated });
  };

  return (
    <aside className="w-80 bg-card border-r border-border h-screen overflow-y-auto sticky top-16">
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Research Filters</h3>
        
        {/* Experiment Types Filter */}
        <div className="mb-6">
          <h4 className="font-medium mb-3 text-foreground">Experiment Types</h4>
          <div className="space-y-2">
            {filterOptions?.experimentTypes?.map(({ value, count }) => (
              <div key={value} className="flex items-center space-x-2">
                <Checkbox
                  id={`experiment-${value}`}
                  checked={filters.experimentTypes?.includes(value) || false}
                  onCheckedChange={(checked) => handleExperimentTypeChange(value, !!checked)}
                  data-testid={`checkbox-experiment-${value.toLowerCase().replace(/\s+/g, '-')}`}
                />
                <label 
                  htmlFor={`experiment-${value}`}
                  className="flex-1 text-sm text-card-foreground cursor-pointer"
                >
                  {value}
                </label>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                  {count}
                </span>
              </div>
            )) || (
              <p className="text-sm text-muted-foreground">No experiment types available</p>
            )}
          </div>
        </div>

        {/* Organisms Filter */}
        <div className="mb-6">
          <h4 className="font-medium mb-3 text-foreground">Model Organisms</h4>
          <div className="space-y-2">
            {filterOptions?.organisms?.map(({ value, count }) => (
              <div key={value} className="flex items-center space-x-2">
                <Checkbox
                  id={`organism-${value}`}
                  checked={filters.organisms?.includes(value) || false}
                  onCheckedChange={(checked) => handleOrganismChange(value, !!checked)}
                  data-testid={`checkbox-organism-${value.toLowerCase().replace(/\s+/g, '-')}`}
                />
                <label 
                  htmlFor={`organism-${value}`}
                  className="flex-1 text-sm text-card-foreground cursor-pointer"
                >
                  {value}
                </label>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                  {count}
                </span>
              </div>
            )) || (
              <p className="text-sm text-muted-foreground">No organisms available</p>
            )}
          </div>
        </div>

        {/* Mission Timeline */}
        <div className="mb-6">
          <h4 className="font-medium mb-3 text-foreground">Mission Timeline</h4>
          <div className="space-y-2">
            <div className="bg-muted/30 p-3 rounded-lg">
              <Slider
                min={1998}
                max={2024}
                step={1}
                defaultValue={[2018]}
                className="w-full"
                data-testid="slider-timeline"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>1998</span>
                <span>2024</span>
              </div>
            </div>
          </div>
        </div>

        {/* Space Conditions */}
        <div className="mb-6">
          <h4 className="font-medium mb-3 text-foreground">Space Conditions</h4>
          <div className="space-y-2">
            {filterOptions?.spaceConditions?.map(({ value, count }) => (
              <div key={value} className="flex items-center space-x-2">
                <Checkbox
                  id={`condition-${value}`}
                  checked={filters.spaceConditions?.includes(value) || false}
                  onCheckedChange={(checked) => handleSpaceConditionChange(value, !!checked)}
                  data-testid={`checkbox-condition-${value.toLowerCase().replace(/\s+/g, '-')}`}
                />
                <label 
                  htmlFor={`condition-${value}`}
                  className="flex-1 text-sm text-card-foreground cursor-pointer"
                >
                  {value}
                </label>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                  {count}
                </span>
              </div>
            )) || (
              <p className="text-sm text-muted-foreground">No space conditions available</p>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
