
import { Plus, GitlabIcon, BarChart2, Trophy, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface RepositoriesHeaderProps {
  onAddRepository: () => void;
}

export function RepositoriesHeader({ onAddRepository }: RepositoriesHeaderProps) {
  const navigate = useNavigate();
  
  const handleAddRepository = () => {
    navigate("/repositories/add");
  };
  
  const handleCompareRepositories = () => {
    navigate("/repositories/compare");
  };
  
  const handleRankRepositories = () => {
    navigate("/repositories/ranking");
  };
  
  const handleSyncRepositories = () => {
    toast.success("Synchronization started", {
      description: "Your GitLab repositories are being synchronized.",
    });
    
    // Simulate sync completion after 2 seconds
    setTimeout(() => {
      toast.success("Synchronization complete", {
        description: "All repositories have been updated successfully.",
      });
    }, 2000);
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
          <Button 
            variant="outline" 
            size="sm" 
            className="h-9"
            onClick={handleRankRepositories}
          >
            <Trophy className="h-4 w-4 mr-2" />
            Rankings
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-9"
            onClick={handleCompareRepositories}
          >
            <BarChart2 className="h-4 w-4 mr-2" />
            Compare
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-9"
            onClick={handleSyncRepositories}
          >
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
