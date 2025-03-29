
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PredictionAccuracyProps {
  accuracy: {
    overall: number;
    byGrade: {
      grade: string;
      actual: number;
      predicted: number;
    }[];
    confusionMatrix: number[][];
    gradeLabels: string[];
  };
}

export function PredictionAccuracy({ accuracy }: PredictionAccuracyProps) {
  const [isRendered, setIsRendered] = useState(false);
  
  useEffect(() => {
    setIsRendered(true);
  }, []);

  // Max value for scaling in the chart
  const maxBarValue = Math.max(
    ...accuracy.byGrade.flatMap(item => [item.actual, item.predicted])
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Model Accuracy Analysis</CardTitle>
        <CardDescription>
          Evaluation of the machine learning model's prediction accuracy
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="byGrade">By Grade</TabsTrigger>
            <TabsTrigger value="confusion">Confusion Matrix</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="flex flex-col items-center text-center py-8">
              <div className="relative w-36 h-36 mb-6">
                <div className="absolute inset-0 rounded-full bg-muted"></div>
                <div 
                  className="absolute inset-0 rounded-full bg-primary transition-all duration-1000"
                  style={{ 
                    clipPath: isRendered 
                      ? `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.sin(2 * Math.PI * accuracy.overall / 100)}% ${50 - 50 * Math.cos(2 * Math.PI * accuracy.overall / 100)}%, 50% 50%)` 
                      : 'polygon(50% 50%, 50% 0%, 50% 0%, 50% 50%)'
                  }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-4xl font-bold">{accuracy.overall}%</div>
                </div>
              </div>
              <h3 className="text-lg font-medium">Overall Accuracy</h3>
              <p className="text-sm text-muted-foreground mt-2 max-w-md">
                The model correctly predicts {accuracy.overall}% of student grades within ±1 grade point
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="byGrade">
            <div className="space-y-6">
              {accuracy.byGrade.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium">Grade {item.grade}</h3>
                    <div className="text-xs text-muted-foreground">
                      Accuracy: {Math.round(100 - Math.abs(item.actual - item.predicted) / item.actual * 100)}%
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-16 text-xs">Actual</div>
                      <div className="flex-1 h-4 bg-muted rounded-sm overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 transition-all duration-1000"
                          style={{ width: isRendered ? `${(item.actual / maxBarValue) * 100}%` : '0%' }}
                        ></div>
                      </div>
                      <div className="w-10 text-xs text-right">{item.actual}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-16 text-xs">Predicted</div>
                      <div className="flex-1 h-4 bg-muted rounded-sm overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all duration-1000"
                          style={{ width: isRendered ? `${(item.predicted / maxBarValue) * 100}%` : '0%' }}
                        ></div>
                      </div>
                      <div className="w-10 text-xs text-right">{item.predicted}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="confusion">
            <div className="py-4">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="p-2 text-xs font-medium text-muted-foreground text-left">Actual \ Predicted</th>
                      {accuracy.gradeLabels.map((grade, i) => (
                        <th key={i} className="p-2 text-xs font-medium text-primary">{grade}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {accuracy.confusionMatrix.map((row, i) => (
                      <tr key={i}>
                        <td className="p-2 text-xs font-medium text-muted-foreground">
                          {accuracy.gradeLabels[i]}
                        </td>
                        {row.map((value, j) => (
                          <td key={j} className="p-0">
                            <div 
                              className={`w-full h-10 flex items-center justify-center text-xs
                                ${i === j ? 'bg-primary/20 text-primary font-medium' : 'bg-muted/20 text-muted-foreground'}
                                ${value > 0 ? 'opacity-100' : 'opacity-50'}
                              `}
                              style={{
                                opacity: isRendered ? (value / Math.max(...row.flat()) * 0.8 + 0.2) : 0.2
                              }}
                            >
                              {value}
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 text-xs text-muted-foreground">
                <p>The confusion matrix shows how many students with a certain actual grade were predicted to have each possible grade.</p>
                <p className="mt-1">Diagonal cells (highlighted) represent correct predictions.</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
