
import { Plus, GitlabIcon, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RepositoriesHeaderProps {
  onAddRepository: () => void;
}

export function RepositoriesHeader({ onAddRepository }: RepositoriesHeaderProps) {
  return (
    <div className="flex flex-col gap-4 mb-8">
      <div className="flex items-center justify-between">
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
      
      <div className="bg-muted/50 p-3 rounded-md flex items-center border border-muted">
        <Star className="h-4 w-4 text-yellow-500 mr-2" />
        <p className="text-sm">
          <span className="font-medium">Featured Repository:</span> Programming Fundamentals 2023 - Contains data for students Ines, Carolina, Bruna, Luis, and Nelson. 
          <span className="text-primary ml-1 font-medium">Click on it to view student grades.</span>
        </p>
      </div>
    </div>
  );
}
