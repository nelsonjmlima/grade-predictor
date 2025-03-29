
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GitCommit } from "lucide-react";

interface CommitActivityChartProps {
  commits: {
    date: string;
    count: number;
  }[];
}

export function CommitActivityChart({ commits }: CommitActivityChartProps) {
  // Find max for scaling
  const maxCommits = Math.max(...commits.map(c => c.count));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitCommit className="h-5 w-5" />
          Commit Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 flex items-end gap-1">
          {commits.map((commit, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div 
                className="w-full bg-primary/80 rounded-t hover:bg-primary transition-all duration-300"
                style={{ 
                  height: `${(commit.count / maxCommits) * 100}%`,
                  minHeight: commit.count > 0 ? '4px' : '0'
                }}
              ></div>
              <div className="text-xs mt-2 text-muted-foreground">
                {commit.date}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
