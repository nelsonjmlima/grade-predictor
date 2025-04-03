
import { useState, useEffect } from "react";
import { SideNav } from "@/components/dashboard/SideNav";
import { RepositoryCard } from "@/components/dashboard/RepositoryCard";
import { RepositoriesTable } from "@/components/dashboard/RepositoriesTable";
import { CreateRepositoryDialog } from "@/components/dashboard/CreateRepositoryDialog";
import { Button } from "@/components/ui/button";
import { Plus, FileUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getRepositories, Repository, filterRepositories, sortRepositories, updateRepository, addRepository } from "@/services/repositoryData";
import { MetricsImportDialog } from "@/components/dashboard/MetricsImportDialog";
import { toast } from "sonner";

export default function DashboardPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  // Always use grid mode now that we've removed the toggle
  const [viewMode] = useState<"grid">("grid");
  const [metricsImportDialogOpen, setMetricsImportDialogOpen] = useState(false);
  const navigate = useNavigate();

  // Fetch repositories on mount and when dialogOpen changes (indicating a potential new repo)
  useEffect(() => {
    const fetchedRepositories = getRepositories();

    // Ensure repositories have the required fields for the updated table
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
    setRepositories(enhancedRepositories);
  }, [dialogOpen, metricsImportDialogOpen]);
  
  const handleCreateRepository = () => {
    setDialogOpen(true);
  };
  
  const handleRepositoryClick = (repoId: string) => {
    navigate(`/repositories/${repoId}`);
  };
  
  const handleAddRepository = () => {
    navigate("/repositories/add");
  };

  // Handle data import from the metrics import dialog
  const handleMetricsDataImported = (data: Partial<Repository>) => {
    if (!data.projectId) {
      toast.success("CSV file uploaded", {
        description: "The CSV file has been stored in the backend."
      });
      return;
    }
    
    // Check if repository with this project ID already exists
    const existingRepo = repositories.find(repo => repo.projectId === data.projectId);
    
    if (existingRepo) {
      // Update existing repository with imported data
      const updatedRepo = updateRepository(existingRepo.id || '', data);
      if (updatedRepo) {
        toast.success("Repository updated", {
          description: `Repository data for ${data.projectId} has been updated.`
        });
      } else {
        toast.error("Update failed", {
          description: "Failed to update repository with imported data."
        });
      }
    } else {
      // Create a new repository with the imported data
      const newRepository: Repository = {
        name: data.projectId || "New Repository",
        description: `Repository for ${data.author || 'Unknown Author'}`,
        lastActivity: data.date || new Date().toISOString(),
        commitCount: 0,
        mergeRequestCount: 0,
        branchCount: 0,
        progress: 0,
        ...data
      };
      
      addRepository(newRepository);
      toast.success("Repository created", {
        description: `New repository created for ${data.projectId}.`
      });
    }
  };

  // Get all repositories without filtering or sorting
  const sortedRepositories = repositories;
  
  return <div className="flex h-screen overflow-hidden bg-background">
      <SideNav />
      
      <main className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="flex flex-col mb-4">
            <h1 className="font-semibold tracking-tight text-2xl">Dashboard</h1>
            <p className="text-muted-foreground font-normal text-base">Manage your repositories</p>
            <p className="text-base text-primary mt-1 font-semibold">
              Bem-vindo Sr. Professor
            </p>
          </div>
          
          <div className="flex items-center justify-between mb-4 rounded-2xl">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">
                {repositories.length > 0 ? `Managing ${repositories.length} repositories.` : ""}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="lg" 
                className="h-14 px-6 text-base" 
                onClick={() => setMetricsImportDialogOpen(true)}
              >
                <FileUp className="h-5 w-5 mr-2" />
                Import CSV
              </Button>
              <Button 
                size="lg" 
                className="h-14 px-6 text-base" 
                onClick={handleAddRepository}
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Repository
              </Button>
            </div>
          </div>
          
          <div className="mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedRepositories.length > 0 ? sortedRepositories.map(repo => <div key={repo.id || repo.name} className="cursor-pointer transform transition-transform hover:scale-[1.01]" onClick={() => handleRepositoryClick(repo.id || '')}>
                  <RepositoryCard {...repo} />
                </div>) : <div className="col-span-full p-8 text-center">
                <p className="text-muted-foreground">
                  No repositories found.
                </p>
              </div>}
          </div>
        </div>
      </main>

      <CreateRepositoryDialog open={dialogOpen} onOpenChange={setDialogOpen} onRepositoryCreated={() => {
      // Refresh repositories after creation
      const updatedRepositories = getRepositories();
      setRepositories(updatedRepositories);
    }} />

      <MetricsImportDialog open={metricsImportDialogOpen} onOpenChange={setMetricsImportDialogOpen} onDataImported={handleMetricsDataImported} />
    </div>;
}
