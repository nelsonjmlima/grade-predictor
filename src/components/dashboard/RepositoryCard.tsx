
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
      <CardHeader className="pb-2">
        <CardTitle className="font-medium text-lg flex items-center justify-between">
          {name}
          {isProgrammingFundamentals && (
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
              Destacado
            </span>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pb-4">
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {description}
        </p>
        
        <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <GitCommit className="h-3.5 w-3.5" />
            <span>{commitCount}</span>
          </div>
          <div className="flex items-center gap-1">
            <GitBranch className="h-3.5 w-3.5" />
            <span>{branchCount}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            <span>{lastActivity}</span>
          </div>
        </div>
        
        <div className="mt-2 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progresso do Projeto</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}
