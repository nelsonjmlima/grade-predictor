
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Repository } from "@/services/repositoryData";
import { GitCommit, FileCode, FileEdit, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface RepositoryComparisonTableProps {
  repositories: Repository[];
}

export function RepositoryComparisonTable({ repositories }: RepositoryComparisonTableProps) {
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Repository</TableHead>
            <TableHead className="text-center">Commits</TableHead>
            <TableHead className="text-center">Additions</TableHead>
            <TableHead className="text-center">Deletions</TableHead>
            <TableHead className="text-center">Total Operations</TableHead>
            <TableHead className="text-center">Grade Prediction</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {repositories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                No repositories selected for comparison
              </TableCell>
            </TableRow>
          ) : (
            repositories.map((repo) => (
              <TableRow key={repo.id}>
                <TableCell className="font-medium">
                  {repo.name}
                  <div className="text-xs text-muted-foreground mt-1">{repo.description}</div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex flex-col items-center">
                    <GitCommit className="h-4 w-4 mb-1 text-blue-500" />
                    <span>{repo.commitCount || "0"}</span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex flex-col items-center">
                    <FileCode className="h-4 w-4 mb-1 text-green-500" />
                    <span>{repo.additions || "0"}</span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex flex-col items-center">
                    <FileEdit className="h-4 w-4 mb-1 text-red-500" />
                    <span>{repo.deletions || "0"}</span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="outline">
                    {repo.operations || (repo.additions && repo.deletions ? repo.additions + repo.deletions : repo.commitCount || "0")}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex flex-col items-center">
                    <Award className="h-4 w-4 mb-1 text-primary" />
                    <span className="font-bold">{repo.finalGradePrediction || "N/A"}</span>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
