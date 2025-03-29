
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code } from "lucide-react";

interface CodeQualityChartProps {
  codeQuality: {
    category: string;
    score: number;
    maxScore: number;
  }[];
}

export function CodeQualityChart({ codeQuality }: CodeQualityChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code className="h-5 w-5" />
          Code Quality Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {codeQuality.map((item, index) => (
            <div key={index}>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">{item.category}</span>
                <span className="text-sm">{item.score}/{item.maxScore}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${(item.score / item.maxScore) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
