
import { Plus, GitlabIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RepositoriesHeaderProps {
  onAddRepository: () => void;
}

export function RepositoriesHeader({ onAddRepository }: RepositoriesHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight animate-fade-in">Repositories</h1>
        <p className="text-muted-foreground animate-fade-in opacity-0" style={{ animationDelay: "100ms" }}>
          View and manage all your GitLab repositories
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" className="h-9">
          <GitlabIcon className="h-4 w-4 mr-2" />
          Sync Repositories
        </Button>
        <Button size="sm" className="h-9 px-4" onClick={onAddRepository}>
          <Plus className="h-4 w-4 mr-2" />
          Add Repository
        </Button>
      </div>
    </div>
  );
}
