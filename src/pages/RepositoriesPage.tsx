
import { useState, useEffect } from "react";
import { SideNav } from "@/components/dashboard/SideNav";
import { CreateRepositoryDialog } from "@/components/dashboard/CreateRepositoryDialog";
import { RepositoriesHeader } from "@/components/dashboard/RepositoriesHeader";
import { RepositoryControls } from "@/components/dashboard/RepositoryControls";
import { RepositoriesList } from "@/components/dashboard/RepositoriesList";
import { 
  allRepositories, 
  sampleStudents, 
  programmingStudents,
  filterRepositories,
  sortRepositories
} from "@/services/repositoryData";

export default function RepositoriesPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [showGradesTemplate, setShowGradesTemplate] = useState(false);
  const [selectedRepository, setSelectedRepository] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [repositories, setRepositories] = useState(allRepositories);
  
  // Listen for changes to repositories
  useEffect(() => {
    const filteredRepositories = filterRepositories(allRepositories, searchTerm);
    const sortedRepositories = sortRepositories(filteredRepositories, sortBy);
    setRepositories(sortedRepositories);
  }, [searchTerm, sortBy, allRepositories]);

  const handleRepositorySelect = (repoId: string) => {
    setSelectedRepository(repoId);
    setShowGradesTemplate(true);
  };

  const toggleGradesView = () => {
    setShowGradesTemplate(!showGradesTemplate);
  };

  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode);
  };

  const handleRepositoryCreated = () => {
    // This will trigger the useEffect to update the repositories list
    setRepositories([...allRepositories]);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <SideNav />
      
      <main className="flex-1 overflow-y-auto">
        <div className="p-4">
          <RepositoriesHeader 
            onAddRepository={() => setDialogOpen(true)} 
          />
          
          <RepositoryControls 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            sortBy={sortBy}
            onSortChange={setSortBy}
            viewMode={viewMode}
            onViewModeChange={handleViewModeChange}
            onToggleGradesView={toggleGradesView}
            showGradesTemplate={showGradesTemplate}
          />
          
          <RepositoriesList 
            repositories={repositories}
            viewMode={viewMode}
            showGradesTemplate={showGradesTemplate}
            selectedRepository={selectedRepository}
            programmingStudents={programmingStudents}
            sampleStudents={sampleStudents}
            onRepositorySelect={handleRepositorySelect}
          />
        </div>
      </main>

      <CreateRepositoryDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen} 
        onRepositoryCreated={handleRepositoryCreated}
      />
    </div>
  );
}
