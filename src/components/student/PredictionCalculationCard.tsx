
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { GitCommit, FileCode, Clock, Users, GitBranch, FileCheck, Code } from "lucide-react";

interface PredictionCalculationCardProps {
  factor: {
    name: string;
    description: string;
    rawValue: number;
    maxValue: number;
    normalizedScore: number;
    weight: number;
    icon: string;
    metrics: {
      name: string;
      value: string | number;
      icon: string;
    }[];
  };
  index: number;
}

export function PredictionCalculationCard({ factor, index }: PredictionCalculationCardProps) {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(factor.normalizedScore * 100);
    }, 500 + index * 300);
    
    return () => clearTimeout(timer);
  }, [factor.normalizedScore, index]);
  
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "git-commit":
        return <GitCommit className="h-5 w-5" />;
      case "file-code":
        return <FileCode className="h-5 w-5" />;
      case "clock":
        return <Clock className="h-5 w-5" />;
      case "users":
        return <Users className="h-5 w-5" />;
      case "git-branch":
        return <GitBranch className="h-5 w-5" />;
      case "file-check":
        return <FileCheck className="h-5 w-5" />;
      case "code":
        return <Code className="h-5 w-5" />;
      default:
        return <GitCommit className="h-5 w-5" />;
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.3 + index * 0.2 }}
    >
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            {getIcon(factor.icon)}
            {factor.name} Factor (Weight: {factor.weight * 100}%)
          </CardTitle>
          <CardDescription>{factor.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {factor.metrics.map((metric, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.2 + idx * 0.1 }}
                  className="bg-muted/50 p-3 rounded-md"
                >
                  <div className="flex items-center gap-2 mb-1">
                    {getIcon(metric.icon)}
                    <span className="text-sm text-muted-foreground">{metric.name}</span>
                  </div>
                  <div className="text-lg font-medium">{metric.value}</div>
                </motion.div>
              ))}
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Raw Value: {factor.rawValue} / {factor.maxValue}</span>
                <span className="font-medium">Normalized Score: {Math.round(factor.normalizedScore * 100)}%</span>
              </div>
              <motion.div layout>
                <Progress value={progress} className="h-2" />
              </motion.div>
              <p className="text-sm text-muted-foreground pt-2">
                This factor contributes {Math.round(factor.normalizedScore * factor.weight * 100)}% to the final grade prediction.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
