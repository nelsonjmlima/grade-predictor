import { useState, useEffect } from "react";
import { SideNav } from "@/components/dashboard/SideNav";
import { RepositoryCard } from "@/components/dashboard/RepositoryCard";
import { RepositoriesTable } from "@/components/dashboard/RepositoriesTable";
import { StudentComparisonChart } from "@/components/dashboard/StudentComparisonChart";
import { CreateRepositoryDialog } from "@/components/dashboard/CreateRepositoryDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Grid, List } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getRepositories, Repository, filterRepositories, sortRepositories } from "@/services/repositoryData";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
export default function DashboardPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [sortBy, setSortBy] = useState("recent");
  const navigate = useNavigate();

  // Fetch repositories on mount and when dialogOpen changes (indicating a potential new repo)
  useEffect(() => {
    const fetchedRepositories = getRepositories();
    setRepositories(fetchedRepositories);
  }, [dialogOpen]);
  const handleCreateRepository = () => {
    setDialogOpen(true);
  };
  const handleRepositoryClick = (repoId: string) => {
    navigate(`/repositories/${repoId}`);
  };
  const handleAddRepository = () => {
    navigate("/repositories/add");
  };

  // Filter repositories based on search term
  const filteredRepositories = filterRepositories(repositories, searchTerm);

  // Sort repositories based on sort selection
  const sortedRepositories = sortRepositories(filteredRepositories, sortBy);
  return <div className="flex h-screen overflow-hidden bg-background">
      <SideNav />
      
      <main className="flex-1 overflow-y-auto">
        
      </main>

      <CreateRepositoryDialog open={dialogOpen} onOpenChange={setDialogOpen} onRepositoryCreated={() => {
      // Refresh repositories after creation
      const updatedRepositories = getRepositories();
      setRepositories(updatedRepositories);
    }} />
    </div>;
}