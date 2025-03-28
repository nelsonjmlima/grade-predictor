
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

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
  progress,
  id
}: RepositoryCardProps) {
  const isProgrammingFundamentals = id === 'programming-fundamentals';
  
  return (
    <Card className={`overflow-hidden transition-all duration-300 hover:shadow-md`}>
      <CardHeader className="pb-2">
        <CardTitle className="font-medium text-lg">
          {name}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pb-4">
        <div className="mt-2 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Project Progress</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}
