
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, TrendingDown, TrendingUp } from "lucide-react";

interface PredictionScoreCardProps {
  predictedGrade: string;
  confidence: number;
  trend: "up" | "down" | "stable";
}

export function PredictionScoreCard({ predictedGrade, confidence, trend }: PredictionScoreCardProps) {
  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-2 bg-primary/5 rounded-t-lg">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <Award className="h-4 w-4" />
          Predicted Grade
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-4xl font-bold">{predictedGrade}</p>
            <p className="text-sm text-muted-foreground mt-1">
              with {confidence}% confidence
            </p>
          </div>
          <div className="flex items-center gap-1">
            {trend === "up" ? (
              <TrendingUp className="h-5 w-5 text-green-500" />
            ) : trend === "down" ? (
              <TrendingDown className="h-5 w-5 text-red-500" />
            ) : null}
            <span className={`text-sm font-medium ${
              trend === "up" ? "text-green-500" : 
              trend === "down" ? "text-red-500" : ""
            }`}>
              {trend === "up" ? "Improving" : 
               trend === "down" ? "Declining" : "Stable"}
            </span>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t">
          <div className="text-xs text-muted-foreground mb-1">Confidence Level</div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${
                confidence >= 80 ? "bg-green-500" : 
                confidence >= 60 ? "bg-yellow-500" : 
                "bg-red-500"
              }`} 
              style={{ width: `${confidence}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
