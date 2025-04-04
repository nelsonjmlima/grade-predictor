import { GitlabIcon, BarChart2, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
interface RepositoriesHeaderProps {
  onAddRepository: () => void;
}
export function RepositoriesHeader({
  onAddRepository
}: RepositoriesHeaderProps) {
  const navigate = useNavigate();
  const handleCompareRepositories = () => {
    navigate("/repositories/compare");
  };
  const handleRankRepositories = () => {
    navigate("/repositories/ranking");
  };
  const handleSyncRepositories = () => {
    toast.success("Synchronization started", {
      description: "Your GitLab repositories are being synchronized."
    });

    // Simulate sync completion after 2 seconds
    setTimeout(() => {
      toast.success("Synchronization complete", {
        description: "All repositories have been updated successfully."
      });
    }, 2000);
  };
  return <div className="flex flex-col gap-4 mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Repositories</h1>
          <p className="text-muted-foreground">
            View and manage all your GitLab repositories
          </p>
        </div>
        <div className="flex items-center gap-3">
          
          
          
        </div>
      </div>
    </div>;
}