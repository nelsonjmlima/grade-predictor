
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { GitBranch, GitCommit, Clock, Users, FileCode, TestTube } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface RepositoryCardProps {
  name: string;
  description?: string; // Changed from required to optional
  lastActivity: string;
  commitCount: number;
  mergeRequestCount: number;
  branchCount: number;
  progress: number;
  predictedGrade?: string;
  id?: string;
  contributorsCount?: number;
  codeQuality?: number;
  testCoverage?: number;
  language?: string;
}

export function RepositoryCard({
  name,
  description = "", // Added default value
  lastActivity,
  commitCount,
  branchCount,
  progress,
  id,
  predictedGrade,
  contributorsCount,
  codeQuality,
  testCoverage,
  language
}: RepositoryCardProps) {
  const isProgrammingFundamentals = id === 'programming-fundamentals';
  
  return (
    <Card className={`overflow-hidden transition-all duration-300 hover:shadow-md ${isProgrammingFundamentals ? 'border-primary/30' : ''}`}>
      <CardHeader className="pb-1 pt-3">
        <CardTitle className="font-medium text-base flex items-center justify-between">
          <span className="truncate mr-2">{name}</span>
          {isProgrammingFundamentals && (
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full flex-shrink-0">
              Featured
            </span>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pb-3">
        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
          {description}
        </p>
        
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {language && (
            <Badge variant="outline" className="text-xs">
              {language}
            </Badge>
          )}
          {predictedGrade && (
            <Badge 
              className={`text-xs
                ${predictedGrade.startsWith('A') ? 'bg-green-100 text-green-800' : 
                  predictedGrade.startsWith('B') ? 'bg-blue-100 text-blue-800' :
                  predictedGrade.startsWith('C') ? 'bg-yellow-100 text-yellow-800' :
                  predictedGrade.startsWith('D') ? 'bg-orange-100 text-orange-800' :
                  'bg-red-100 text-red-800'}
              `}
            >
              Grade: {predictedGrade}
            </Badge>
          )}
        </div>
        
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
            <Users className="h-3 w-3" />
            <span>{contributorsCount || '0'}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mb-2">
          {codeQuality !== undefined && (
            <div className="flex flex-col">
              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                <FileCode className="h-3 w-3" />
                <span>Code Quality</span>
              </div>
              <Progress value={codeQuality} className="h-1" />
            </div>
          )}
          {testCoverage !== undefined && (
            <div className="flex flex-col">
              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                <TestTube className="h-3 w-3" />
                <span>Test Coverage</span>
              </div>
              <Progress value={testCoverage} className="h-1" />
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{lastActivity}</span>
          </div>
          <div>
            Progress: <span className="font-medium">{progress}%</span>
          </div>
        </div>
        
        <Progress value={progress} className="h-1.5 mt-1" />
      </CardContent>
    </Card>
  );
}
