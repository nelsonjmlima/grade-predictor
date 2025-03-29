
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { GitBranch, GitCommit, GitMerge, FileCode, CheckCircle2, Clock } from "lucide-react";

interface PredictionModelVisualizationProps {
  predictionData: any;
}

export function PredictionModelVisualization({ predictionData }: PredictionModelVisualizationProps) {
  const [animationStep, setAnimationStep] = useState(0);
  const animationRef = useRef<NodeJS.Timeout | null>(null);

  const metrics = [
    { name: "Commit Frequency", icon: GitCommit, value: predictionData.metrics.commitFrequency },
    { name: "Code Quality", icon: CheckCircle2, value: predictionData.metrics.codeQuality },
    { name: "Pull Requests", icon: GitMerge, value: predictionData.metrics.pullRequestCount },
    { name: "Branch Activity", icon: GitBranch, value: predictionData.metrics.branchActivity },
    { name: "File Changes", icon: FileCode, value: predictionData.metrics.fileChanges },
    { name: "Time Consistency", icon: Clock, value: predictionData.metrics.timeConsistency },
  ];

  useEffect(() => {
    // Start the animation sequence
    animationRef.current = setInterval(() => {
      setAnimationStep((prev) => (prev + 1) % (metrics.length + 2));
    }, 2000);

    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    };
  }, [metrics.length]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Prediction Model Visualization</CardTitle>
        <CardDescription>
          Visual representation of how our machine learning model uses GitLab metrics to predict the final grade
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative h-[400px] w-full bg-muted/20 rounded-md border overflow-hidden">
          {/* Input Layer */}
          <div className="absolute left-0 top-0 bottom-0 w-1/3 border-r border-dashed border-muted p-4">
            <h3 className="text-sm font-medium mb-3 text-center">Input Metrics</h3>
            <div className="space-y-3">
              {metrics.map((metric, index) => {
                const Icon = metric.icon;
                return (
                  <div 
                    key={index}
                    className={`flex items-center gap-2 p-2 rounded-md transition-all duration-300 ${
                      animationStep === index ? "bg-primary/10 scale-105" : "bg-card"
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${
                      animationStep === index ? "text-primary" : "text-muted-foreground"
                    }`} />
                    <div className="flex-1">
                      <p className={`text-xs font-medium ${
                        animationStep === index ? "text-primary" : ""
                      }`}>{metric.name}</p>
                      <div className="w-full bg-muted rounded-full h-1.5 mt-1">
                        <div 
                          className={`h-1.5 rounded-full ${
                            animationStep === index ? "bg-primary" : "bg-muted-foreground/40"
                          }`} 
                          style={{ width: `${metric.value * 10}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Hidden Layer */}
          <div className="absolute left-1/3 top-0 bottom-0 w-1/3 border-r border-dashed border-muted flex flex-col items-center justify-center">
            <h3 className="text-sm font-medium mb-6 absolute top-4">Processing</h3>
            <div className="space-y-4 w-4/5">
              {[0, 1, 2].map((i) => (
                <div key={i} className="relative">
                  <div className={`h-8 rounded-md ${
                    animationStep === metrics.length ? "bg-primary/20" : "bg-muted/40"
                  } flex items-center justify-center`}>
                    <div className={`text-xs ${
                      animationStep === metrics.length ? "text-primary font-medium" : "text-muted-foreground"
                    }`}>
                      Neural Network Layer {i + 1}
                    </div>
                  </div>
                  {/* Connection lines - horizontal */}
                  <div className="absolute left-0 top-1/2 w-2 h-0.5 -translate-x-2 bg-muted-foreground/20"></div>
                  <div className="absolute right-0 top-1/2 w-2 h-0.5 translate-x-2 bg-muted-foreground/20"></div>
                </div>
              ))}
            </div>
            {/* Animated calculation effect */}
            {animationStep === metrics.length && (
              <div className="absolute inset-0 bg-primary/5 flex items-center justify-center">
                <div className="animate-pulse text-center">
                  <div className="inline-block animate-spin mx-2 text-primary">⚙️</div>
                  <div className="text-sm font-medium text-primary mt-2">Processing data...</div>
                </div>
              </div>
            )}
          </div>

          {/* Output Layer */}
          <div className="absolute right-0 top-0 bottom-0 w-1/3 flex flex-col items-center justify-center">
            <h3 className="text-sm font-medium mb-3 absolute top-4">Prediction Output</h3>
            <div className={`transform transition-all duration-500 ${
              animationStep === metrics.length + 1 ? "scale-110" : "scale-100 opacity-70"
            }`}>
              <div className="text-center">
                <div className={`text-5xl font-bold mb-2 transition-all duration-500 ${
                  animationStep === metrics.length + 1 ? "text-primary" : "text-muted-foreground/50"
                }`}>
                  {predictionData.prediction.grade}
                </div>
                <div className="text-sm text-muted-foreground">Predicted Grade</div>
                <div className={`mt-4 text-sm font-medium ${
                  animationStep === metrics.length + 1 ? "text-primary" : "text-muted-foreground"
                }`}>
                  {predictionData.prediction.confidence}% Confidence
                </div>
              </div>
            </div>
          </div>

          {/* Connection lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <g className="opacity-10">
              {/* Draw connections from metrics to hidden layer */}
              {metrics.map((_, i) => (
                <path 
                  key={`input-${i}`}
                  d={`M ${window.innerWidth / 3 - 20} ${60 + i * 40} L ${window.innerWidth / 3 + 20} ${140}`}
                  stroke={animationStep === i ? "#8A2BE2" : "#94a3b8"}
                  strokeWidth={animationStep === i ? 2 : 1}
                  fill="none"
                />
              ))}
              
              {/* Draw connections from hidden layer to output */}
              {[0, 1, 2].map((i) => (
                <path 
                  key={`hidden-${i}`}
                  d={`M ${window.innerWidth * 2/3 - 20} ${150 + i * 50} L ${window.innerWidth * 2/3 + 20} ${200}`}
                  stroke={animationStep === metrics.length ? "#8A2BE2" : "#94a3b8"}
                  strokeWidth={animationStep === metrics.length ? 2 : 1}
                  fill="none"
                />
              ))}
            </g>
          </svg>
        </div>
        
        <p className="text-sm text-muted-foreground mt-6">
          Our machine learning model analyzes various GitLab metrics to predict the student's final grade. 
          The prediction is based on historical data and patterns identified in successful student projects.
        </p>
      </CardContent>
    </Card>
  );
}
