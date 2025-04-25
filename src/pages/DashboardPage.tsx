
import { useState, useEffect, useCallback } from "react";
import { SideNav } from "@/components/dashboard/SideNav";
import { RepositoryCard } from "@/components/dashboard/RepositoryCard";
import { CreateRepositoryDialog } from "@/components/dashboard/CreateRepositoryDialog";
import { useNavigate } from "react-router-dom";
import { getRepositories, Repository } from "@/services/repositoryData";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function DashboardPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  const fetchRepositories = useCallback(async () => {
    try {
      setLoading(true);
      console.log("Fetching repositories for user:", user?.id);
      if (!user) {
        console.log("No authenticated user found");
        setRepositories([]);
        return;
      }
      
      const fetchedRepositories = await getRepositories();
      console.log("Fetched repositories:", fetchedRepositories);

      const enhancedRepositories = fetchedRepositories.map(repo => ({
        ...repo,
        projectId: repo.projectId || repo.id || `project-${Math.random().toString(36).substr(2, 9)}`,
        author: repo.author || "Anonymous",
        email: repo.email || "no-email@example.com",
        date: repo.date || repo.lastActivity,
        additions: repo.additions || Math.floor(Math.random() * 500),
        deletions: repo.deletions || Math.floor(Math.random() * 200),
        operations: repo.operations || (repo.additions && repo.deletions ? repo.additions + repo.deletions : repo.commitCount),
        totalAdditions: repo.totalAdditions || Math.floor(Math.random() * 2000) + (repo.additions || 0),
        totalDeletions: repo.totalDeletions || Math.floor(Math.random() * 1000) + (repo.deletions || 0),
        totalOperations: repo.totalOperations || (repo.totalAdditions && repo.totalDeletions ? repo.totalAdditions + repo.totalDeletions : repo.additions && repo.deletions ? (repo.additions + repo.deletions) * 5 : 0),
        averageOperationsPerCommit: repo.averageOperationsPerCommit || (repo.commitCount ? Math.round(((repo.additions || 0) + (repo.deletions || 0)) / repo.commitCount * 10) / 10 : Math.floor(Math.random() * 20) + 5),
        averageCommitsPerWeek: repo.averageCommitsPerWeek || Math.floor(Math.random() * 20) + 1
      }));
      
      console.log("Enhanced repositories:", enhancedRepositories);
      setRepositories(enhancedRepositories);
    } catch (error) {
      console.error("Error fetching repositories:", error);
      toast.error("Failed to load repositories");
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchRepositories();
    
    // Refresh repositories when window gets focus (in case repositories were added elsewhere)
    window.addEventListener('focus', fetchRepositories);
    
    return () => {
      window.removeEventListener('focus', fetchRepositories);
    };
  }, [fetchRepositories, dialogOpen]);

  const handleRepositoryClick = (repoId: string) => {
    navigate(`/repositories/${repoId}`);
  };

  const handleRepositoryCreated = () => {
    console.log("Repository created, refreshing list...");
    fetchRepositories();
    toast.success("Repository added successfully");
  };

  return <div className="flex h-screen overflow-hidden bg-background">
      <SideNav />
      
      <main className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="flex flex-col mb-4">
            <h1 className="font-semibold tracking-tight text-2xl">Dashboard</h1>
            <p className="text-muted-foreground font-normal text-base">Manage your repositories</p>
            <p className="text-base text-primary mt-1 font-semibold">
              {user ? `Bem-vindo ${user.email}` : "Bem-vindo Sr. Professor"}
            </p>
          </div>
          
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-muted-foreground">
              {repositories.length > 0 ? `Managing ${repositories.length} repositories.` : ""}
            </p>
            
            <Button 
              onClick={() => navigate('/repositories/add')} 
              className="flex items-center"
              variant="default"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Repository
            </Button>
          </div>
          
          <div className="mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? (
              <div className="col-span-full p-8 text-center">
                <p className="text-muted-foreground">
                  Loading repositories...
                </p>
              </div>
            ) : repositories.length > 0 ? repositories.map(repo => (
              <div 
                key={repo.id || repo.name} 
                className="cursor-pointer transform transition-transform hover:scale-[1.01]" 
                onClick={() => handleRepositoryClick(repo.id || '')}
              >
                <RepositoryCard {...repo} />
              </div>
            )) : (
              <div className="col-span-full p-8 text-center">
                <p className="text-muted-foreground">
                  No repositories found. Click the "Add Repository" button to add your first repository.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <CreateRepositoryDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen} 
        onRepositoryCreated={handleRepositoryCreated}
      />
    </div>;
}
