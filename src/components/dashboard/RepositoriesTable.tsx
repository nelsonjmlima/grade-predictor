
import { useNavigate } from "react-router-dom";
import { Repository } from "@/services/repositoryData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  GitCommit, 
  GitBranch, 
  Calendar, 
  FileCode, 
  FileEdit, 
  Gauge, 
  TrendingUp,
  Award,
  Clock
} from "lucide-react";

interface RepositoriesTableProps {
  repositories: Repository[];
}

export function RepositoriesTable({ repositories }: RepositoriesTableProps) {
  const navigate = useNavigate();

  const handleRowClick = (repoId: string) => {
    navigate(`/repositories/${repoId}`);
  };

  const getGradeColor = (grade: string) => {
    if (!grade) return "bg-gray-100 text-gray-800";
    
    if (grade.startsWith('A')) return "bg-green-100 text-green-800";
    if (grade.startsWith('B')) return "bg-blue-100 text-blue-800";
    if (grade.startsWith('C')) return "bg-yellow-100 text-yellow-800";
    if (grade.startsWith('D')) return "bg-orange-100 text-orange-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <div className="rounded-md border overflow-hidden">
      <div className="max-h-[calc(100vh-200px)] overflow-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-background z-10 shadow-sm">
            <TableRow>
              <TableHead className="w-[150px]">Project ID</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-center">Total Commits</TableHead>
              <TableHead className="text-center">Total Additions</TableHead>
              <TableHead className="text-center">Total Deletions</TableHead>
              <TableHead className="text-center">Avg Ops/Commit</TableHead>
              <TableHead className="text-center">Avg Commits/Week</TableHead>
              <TableHead className="text-center">Grade Prediction</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {repositories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                  No repositories found
                </TableCell>
              </TableRow>
            ) : (
              repositories.map((repo) => (
                <TableRow 
                  key={repo.id} 
                  className="cursor-pointer hover:bg-muted/50" 
                  onClick={() => handleRowClick(repo.id || '')}
                >
                  <TableCell className="font-medium">
                    {repo.projectId || repo.id || 'N/A'}
                  </TableCell>
                  <TableCell>
                    {repo.author || 'Unknown'}
                  </TableCell>
                  <TableCell>
                    {repo.email || 'N/A'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                      <span className="text-sm">{repo.date || repo.lastActivity}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center">
                      <GitCommit className="h-4 w-4 mb-1 text-blue-500" />
                      <span>{repo.totalCommits || repo.commitCount || '0'}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center">
                      <FileCode className="h-4 w-4 mb-1 text-green-500" />
                      <span>{repo.totalAdditions || (repo.additions ? repo.additions * (repo.commitCount || 1) : '0')}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center">
                      <FileEdit className="h-4 w-4 mb-1 text-red-500" />
                      <span>{repo.totalDeletions || (repo.deletions ? repo.deletions * (repo.commitCount || 1) : '0')}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center">
                      <Gauge className="h-4 w-4 mb-1 text-purple-500" />
                      <span>
                        {repo.averageOperationsPerCommit || 
                          (repo.totalCommits ? 
                            Math.round(((repo.totalAdditions || 0) + (repo.totalDeletions || 0)) / repo.totalCommits) : 
                            (repo.commitCount ? 
                              Math.round(((repo.additions || 0) + (repo.deletions || 0)) / repo.commitCount) : 
                              '0')
                          )
                        }
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center">
                      <TrendingUp className="h-4 w-4 mb-1 text-indigo-500" />
                      <span>{repo.averageCommitsPerWeek || Math.round((repo.totalCommits || repo.commitCount || 1) / 4)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center">
                      <Award className="h-4 w-4 mb-1 text-amber-500" />
                      <div className="flex flex-col items-center">
                        <Badge className={getGradeColor(repo.finalGradePrediction || repo.predictedGrade || '')}>
                          {repo.finalGradePrediction || repo.predictedGrade || 'No grade'}
                        </Badge>
                        {repo.predictionWeek && (
                          <span className="text-xs text-muted-foreground mt-1 flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {repo.predictionWeek}
                          </span>
                        )}
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
