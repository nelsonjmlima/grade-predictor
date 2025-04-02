
import { useState, useEffect } from "react";
import { SideNav } from "@/components/dashboard/SideNav";
import { RepositoryCard } from "@/components/dashboard/RepositoryCard";
import { RepositoriesTable } from "@/components/dashboard/RepositoriesTable";
import { CreateRepositoryDialog } from "@/components/dashboard/CreateRepositoryDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Grid, List, FileUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getRepositories, Repository, filterRepositories, sortRepositories, updateRepository, addRepository } from "@/services/repositoryData";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CSVImportDialog } from "@/components/dashboard/CSVImportDialog";
import { toast } from "sonner";
export default function DashboardPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [sortBy, setSortBy] = useState("recent");
  const [csvImportDialogOpen, setCsvImportDialogOpen] = useState(false);
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
  }, [dialogOpen, csvImportDialogOpen]);
  
  const handleCreateRepository = () => {
    setDialogOpen(true);
  };
  
  const handleRepositoryClick = (repoId: string) => {
    navigate(`/repositories/${repoId}`);
  };
  
  const handleAddRepository = () => {
    navigate("/repositories/add");
  };

  // Modified data import handler that only uploads the CSV file without creating a repository
  const handleCSVDataImported = (data: Partial<Repository>) => {
    // Only upload the CSV file, don't create or update any repository
    toast.success("CSV file uploaded", {
      description: "The CSV file has been stored in the backend."
    });
  };

  // Filter repositories based on search term
  const filteredRepositories = filterRepositories(repositories, searchTerm);

  // Sort repositories based on sort selection
  const sortedRepositories = sortRepositories(filteredRepositories, sortBy);
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
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">
                {repositories.length > 0 ? `Managing ${repositories.length} repositories.` : ""}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input placeholder="Search repositories..." className="pl-8 w-[200px] h-8 text-sm" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-8 w-[130px]">
                  <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="progress">Progress</SelectItem>
                  <SelectItem value="operations">Operations</SelectItem>
                  <SelectItem value="avgops">Avg Ops/Commit</SelectItem>
                  <SelectItem value="avgcommits">Avg Commits/Week</SelectItem>
                </SelectContent>
              </Select>
              <ToggleGroup type="single" value={viewMode} onValueChange={value => value && setViewMode(value as "grid" | "table")}>
                <ToggleGroupItem value="grid" aria-label="Grid view">
                  <Grid className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="table" aria-label="Table view">
                  <List className="h-4 w-4" />
                </ToggleGroupItem>
              </ToggleGroup>
              <Button variant="outline" size="sm" className="h-9 px-4" onClick={() => setCsvImportDialogOpen(true)}>
                <FileUp className="h-4 w-4 mr-2" />
                Import CSV
              </Button>
              <Button size="sm" className="h-9 px-4" onClick={handleAddRepository}>
                <Plus className="h-4 w-4 mr-2" />
                Add Repository
              </Button>
            </div>
          </div>
          
          {viewMode === "grid" ? <div className="mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedRepositories.length > 0 ? sortedRepositories.map(repo => <div key={repo.id || repo.name} className="cursor-pointer transform transition-transform hover:scale-[1.01]" onClick={() => handleRepositoryClick(repo.id || '')}>
                    <RepositoryCard {...repo} />
                  </div>) : <div className="col-span-full p-8 text-center">
                  <p className="text-muted-foreground">
                    {searchTerm ? "No repositories match your search. Try different keywords." : ""}
                  </p>
                </div>}
            </div> : <div className="mb-4">
              <RepositoriesTable repositories={sortedRepositories} />
            </div>}
        </div>
      </main>

      <CreateRepositoryDialog open={dialogOpen} onOpenChange={setDialogOpen} onRepositoryCreated={() => {
      // Refresh repositories after creation
      const updatedRepositories = getRepositories();
      setRepositories(updatedRepositories);
    }} />

      <CSVImportDialog open={csvImportDialogOpen} onOpenChange={setCsvImportDialogOpen} onDataImported={handleCSVDataImported} />
    </div>;
}
