import { useNavigate } from "react-router-dom";
import { Repository } from "@/services/repositoryData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { GitCommit, GitBranch, GitMerge, Users, Book, Calendar } from "lucide-react";

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
              <TableHead className="w-[250px]">Repository</TableHead>
              <TableHead>Language</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead className="text-center">Commits</TableHead>
              <TableHead className="text-center">Branches</TableHead>
              <TableHead className="text-center">PRs</TableHead>
              <TableHead className="text-center">Contributors</TableHead>
              <TableHead className="text-center">Grade</TableHead>
              <TableHead>Last Activity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {repositories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
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
                    <div className="flex flex-col">
                      <span>{repo.name}</span>
                      <span className="text-xs text-muted-foreground line-clamp-1">{repo.description}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {repo.language && (
                      <Badge variant="outline" className="font-mono text-xs">
                        {repo.language}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Progress value={repo.progress} className="h-2" />
                      <span className="text-xs text-muted-foreground">{repo.progress}% complete</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center">
                      <GitCommit className="h-4 w-4 mb-1 text-muted-foreground" />
                      <span>{repo.commitCount}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center">
                      <GitBranch className="h-4 w-4 mb-1 text-muted-foreground" />
                      <span>{repo.branchCount}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center">
                      <GitMerge className="h-4 w-4 mb-1 text-muted-foreground" />
                      <span>{repo.mergeRequestCount}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center">
                      <Users className="h-4 w-4 mb-1 text-muted-foreground" />
                      <span>{repo.contributorsCount || '0'}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      className={`
                        ${repo.predictedGrade?.startsWith('A') ? 'bg-green-100 text-green-800' : 
                          repo.predictedGrade?.startsWith('B') ? 'bg-blue-100 text-blue-800' :
                          repo.predictedGrade?.startsWith('C') ? 'bg-yellow-100 text-yellow-800' :
                          repo.predictedGrade?.startsWith('D') ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'}
                      `}
                    >
                      {repo.predictedGrade || 'N/A'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                      <span className="text-sm">{repo.lastActivity}</span>
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
