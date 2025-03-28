
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { GitBranch, GitCommit, Clock } from "lucide-react";

interface RepositoryCardProps {
  name: string;
  description: string;
  lastActivity: string;
  commitCount: number;
  mergeRequestCount: number;
  branchCount: number;
  progress: number;
  predictedGrade?: string;
  id?: string;
}

export function RepositoryCard({
  name,
  description,
  lastActivity,
  commitCount,
  branchCount,
  progress,
  id
}: RepositoryCardProps) {
  const isProgrammingFundamentals = id === 'programming-fundamentals';
  
  return (
    <Card className={`overflow-hidden transition-all duration-300 hover:shadow-md ${isProgrammingFundamentals ? 'border-primary/30' : ''}`}>
      <CardHeader className="pb-1 pt-3">
        <CardTitle className="font-medium text-base flex items-center justify-between">
          {name}
          {isProgrammingFundamentals && (
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
              Featured
            </span>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pb-3">
        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
          {description}
        </p>
        
        <div className="flex items-center gap-3 mb-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <GitCommit className="h-3 w-3" />
            <span>{commitCount}</span>
          </div>
          <div className="flex items-center gap-1">
            <GitBranch className="h-3 w-3" />
            <span>{branchCount}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{lastActivity}</span>
          </div>
        </div>
        
        <div className="mt-1 space-y-1">
          <div className="flex justify-between text-xs">
            <span>Progress</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>
      </CardContent>
    </Card>
  );
}
