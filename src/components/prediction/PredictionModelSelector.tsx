
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PredictionModelOption } from "@/services/predictionModels";
import { cn } from "@/lib/utils";
import { Brain, GitBranch, Network, Layers, PieChart, BarChart } from "lucide-react";

interface PredictionModelSelectorProps {
  models: PredictionModelOption[];
  selectedModel: string;
  onSelect: (modelId: string) => void;
}

export function PredictionModelSelector({
  models,
  selectedModel,
  onSelect
}: PredictionModelSelectorProps) {
  const [hoveredModel, setHoveredModel] = useState<string | null>(null);
  
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "brain":
        return <Brain className="h-5 w-5" />;
      case "tree":
        return <GitBranch className="h-5 w-5" />;
      case "network":
        return <Network className="h-5 w-5" />;
      case "deep":
        return <Layers className="h-5 w-5" />;
      case "ensemble":
        return <PieChart className="h-5 w-5" />;
      case "basic":
      default:
        return <BarChart className="h-5 w-5" />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {models.map((model) => (
        <Card 
          key={model.id}
          className={cn(
            "cursor-pointer transition-all duration-300 overflow-hidden",
            selectedModel === model.id 
              ? "border-primary ring-1 ring-primary" 
              : "hover:border-primary/50",
            hoveredModel === model.id && selectedModel !== model.id
              ? "shadow-md" 
              : ""
          )}
          onClick={() => onSelect(model.id)}
          onMouseEnter={() => setHoveredModel(model.id)}
          onMouseLeave={() => setHoveredModel(null)}
        >
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className={cn(
                "p-2 rounded-md flex-shrink-0 mt-1",
                selectedModel === model.id 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted"
              )}>
                {getIconComponent(model.icon)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{model.name}</h3>
                  <ChevronRight 
                    className={cn(
                      "h-4 w-4 text-muted-foreground transition-transform", 
                      selectedModel === model.id ? "rotate-90" : ""
                    )} 
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-1">{model.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
