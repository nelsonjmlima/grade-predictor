import { useNavigate } from "react-router-dom";
import { Repository } from "@/services/repositoryData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { GitCommit, Users, Calendar, FileCode, FileEdit, TrendingUp, Award, Hash, Mail, GitBranch, User } from "lucide-react";

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
              <TableHead>ID/Group</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>GitLab User</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-center">Commits</TableHead>
              <TableHead className="text-center">Adds</TableHead>
              <TableHead className="text-center">Dels</TableHead>
              <TableHead className="text-center">Ops</TableHead>
              <TableHead>Week of Prediction</TableHead>
              <TableHead>Final Grade Prediction</TableHead>
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
                    <div className="flex items-center">
                      <Hash className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                      {repo.projectId || repo.id || 'N/A'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Users className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                      {repo.id || 'N/A'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <User className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                      {repo.author || 'Unknown'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Mail className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                      {repo.email || 'N/A'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <GitBranch className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                      {repo.gitlabUser || 'N/A'}
                    </div>
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
                      <span>{repo.commitCount || '0'}</span>
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
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="h-3.5 w-3.5 mr-1.5 text-amber-500" />
                      <span>{repo.weekOfPrediction || 'Not predicted'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Award className="h-3.5 w-3.5 mr-1.5 text-primary" />
                      <span className="font-bold">{repo.finalGradePrediction || 'N/A'}</span>
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
