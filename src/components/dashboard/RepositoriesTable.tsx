
import { useNavigate } from "react-router-dom";
import { Repository } from "@/services/repositoryData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { GitCommit, GitBranch, GitMerge, Users, Calendar, FileCode, FileEdit, TrendingUp, Gauge } from "lucide-react";

interface RepositoriesTableProps {
  repositories: Repository[];
}

export function RepositoriesTable({ repositories }: RepositoriesTableProps) {
  const navigate = useNavigate();

  const handleRowClick = (repoId: string) => {
    navigate(`/repositories/${repoId}`);
  };

  return (
    <div className="rounded-md border overflow-hidden">
      <div className="max-h-[calc(100vh-200px)] overflow-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-background z-10 shadow-sm">
            <TableRow>
              <TableHead className="w-[120px]">Project ID</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-center">Adds</TableHead>
              <TableHead className="text-center">Dels</TableHead>
              <TableHead className="text-center">Ops</TableHead>
              <TableHead className="text-center">Total Adds</TableHead>
              <TableHead className="text-center">Total Dels</TableHead>
              <TableHead className="text-center">Total Ops</TableHead>
              <TableHead className="text-center">Avg Ops/Commit</TableHead>
              <TableHead className="text-center">Avg Commit/Week</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {repositories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={12} className="text-center py-8 text-muted-foreground">
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
                      <FileCode className="h-4 w-4 mb-1 text-green-500" />
                      <span>{repo.additions || '0'}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center">
                      <FileEdit className="h-4 w-4 mb-1 text-red-500" />
                      <span>{repo.deletions || '0'}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline">
                      {repo.operations || (repo.additions && repo.deletions ? repo.additions + repo.deletions : repo.commitCount || '0')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center">
                      <FileCode className="h-4 w-4 mb-1 text-green-500" />
                      <span>{repo.totalAdditions || '0'}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center">
                      <FileEdit className="h-4 w-4 mb-1 text-red-500" />
                      <span>{repo.totalDeletions || '0'}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline">
                      {repo.totalOperations || (repo.totalAdditions && repo.totalDeletions ? repo.totalAdditions + repo.totalDeletions : '0')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center">
                      <Gauge className="h-4 w-4 mb-1 text-amber-500" />
                      <span>{repo.averageOperationsPerCommit || '0'}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center">
                      <TrendingUp className="h-4 w-4 mb-1 text-blue-500" />
                      <span>{repo.averageCommitsPerWeek || '0'}</span>
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
