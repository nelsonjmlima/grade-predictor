
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { GitCommit, Code, GitMerge, Clock, FileCode, GitBranch } from "lucide-react";

interface MetricImportance {
  name: string;
  value: number;
  description: string;
  icon: keyof typeof iconMap;
}

interface MetricsImportanceProps {
  metricsImportance: MetricImportance[];
}

const iconMap = {
  "commit": GitCommit,
  "code": Code,
  "merge": GitMerge,
  "time": Clock,
  "file": FileCode,
  "branch": GitBranch
};

export function MetricsImportance({ metricsImportance }: MetricsImportanceProps) {
  const [metrics, setMetrics] = useState<MetricImportance[]>([]);

  // Animate metrics one by one
  useEffect(() => {
    const animateMetrics = async () => {
      setMetrics([]);
      
      for (let i = 0; i < metricsImportance.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 300));
        setMetrics(prev => [...prev, metricsImportance[i]]);
      }
    };
    
    animateMetrics();
  }, [metricsImportance]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Metrics Importance Analysis</CardTitle>
        <CardDescription>
          How different GitLab metrics impact the grade prediction
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {metrics.map((metric, index) => {
            const Icon = iconMap[metric.icon];
            return (
              <div 
                key={index} 
                className="animate-fade-in"
                style={{ animationDelay: `${index * 300}ms` }}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">{metric.name}</span>
                  </div>
                  <span className="text-sm font-medium">{metric.value}%</span>
                </div>
                <Progress 
                  value={metric.value} 
                  className="h-2 mb-1"
                  style={{ 
                    transitionProperty: "width",
                    transitionDuration: "1s",
                    transitionTimingFunction: "ease-out" 
                  }} 
                />
                <p className="text-xs text-muted-foreground">{metric.description}</p>
              </div>
            );
          })}

          {metrics.length < metricsImportance.length && (
            <div className="text-center py-4 text-sm text-muted-foreground animate-pulse">
              Loading metrics importance...
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
