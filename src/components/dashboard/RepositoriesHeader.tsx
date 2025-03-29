
import { Plus, GitlabIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface RepositoriesHeaderProps {
  onAddRepository: () => void;
}

export function RepositoriesHeader({ onAddRepository }: RepositoriesHeaderProps) {
  const navigate = useNavigate();
  
  const handleAddRepository = () => {
    navigate("/repositories/add");
  };
  
  return (
    <div className="flex flex-col gap-4 mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Repositories</h1>
          <p className="text-muted-foreground">
            View and manage all your GitLab repositories
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="h-9">
            <GitlabIcon className="h-4 w-4 mr-2" />
            Sync Repositories
          </Button>
          <Button size="sm" className="h-9 px-4" onClick={handleAddRepository}>
            <Plus className="h-4 w-4 mr-2" />
            Add Repository
          </Button>
        </div>
      </div>
    </div>
  );
}
