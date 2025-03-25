
import { GitBranch, GitCommit, GitMerge, ExternalLink, BarChart } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

interface RepositoryCardProps {
  name: string;
  description: string;
  lastActivity: string;
  commitCount: number;
  mergeRequestCount: number;
  branchCount: number;
  progress: number;
  predictedGrade?: string;
}

export function RepositoryCard({
  name,
  description,
  lastActivity,
  commitCount,
  mergeRequestCount,
  branchCount,
  progress,
  predictedGrade
}: RepositoryCardProps) {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md animate-fade-in">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="font-medium text-lg">{name}</CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="h-8">
              <BarChart className="h-4 w-4 mr-1" />
              Analyze
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid grid-cols-3 gap-4 mt-2">
          <div className="flex flex-col items-center p-2 rounded-md bg-secondary/50">
            <GitCommit className="h-4 w-4 mb-1 text-muted-foreground" />
            <span className="text-sm font-medium">{commitCount}</span>
            <span className="text-xs text-muted-foreground">Commits</span>
          </div>
          <div className="flex flex-col items-center p-2 rounded-md bg-secondary/50">
            <GitMerge className="h-4 w-4 mb-1 text-muted-foreground" />
            <span className="text-sm font-medium">{mergeRequestCount}</span>
            <span className="text-xs text-muted-foreground">Merges</span>
          </div>
          <div className="flex flex-col items-center p-2 rounded-md bg-secondary/50">
            <GitBranch className="h-4 w-4 mb-1 text-muted-foreground" />
            <span className="text-sm font-medium">{branchCount}</span>
            <span className="text-xs text-muted-foreground">Branches</span>
          </div>
        </div>
        
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Project Progress</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        {predictedGrade && (
          <div className="mt-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Predicted Grade:</span>
              <span className="font-semibold text-lg">{predictedGrade}</span>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-2">
        <div className="w-full flex justify-between items-center">
          <span className="text-xs text-muted-foreground">Last activity: {lastActivity}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
