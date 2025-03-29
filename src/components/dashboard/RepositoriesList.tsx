
import { SlidersHorizontal } from "lucide-react";
import { RepositoryCard } from "@/components/dashboard/RepositoryCard";
import { RepositoryGradesView } from "@/components/dashboard/RepositoryGradesView";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";

interface Repository {
  name: string;
  description: string;
  lastActivity: string;
  commitCount: number;
  mergeRequestCount: number;
  branchCount: number;
  progress: number;
  predictedGrade?: string;
  id?: string;
}

interface Student {
  id: string;
  name: string;
  email: string;
  commitCount: number;
  grade?: string;
  lastActivity: string;
}

interface RepositoriesListProps {
  repositories: Repository[];
  viewMode: 'grid' | 'list';
  showGradesTemplate: boolean;
  selectedRepository: string;
  programmingStudents: Student[];
  sampleStudents: Student[];
  onRepositorySelect: (repoId: string) => void;
}

export function RepositoriesList({
  repositories,
  viewMode,
  showGradesTemplate,
  selectedRepository,
  programmingStudents,
  sampleStudents,
  onRepositorySelect
}: RepositoriesListProps) {
  const navigate = useNavigate();

  const handleRepositoryClick = (repo: Repository) => {
    if (repo.id) {
      navigate(`/repositories/${repo.id}`);
    } else {
      // For repositories without IDs, use the previous behavior
      onRepositorySelect('programming-fundamentals');
    }
  };

  if (showGradesTemplate) {
    return (
      <div className="mb-4">
        <RepositoryGradesView 
          repositoryName={selectedRepository === 'programming-fundamentals' ? "Programming Fundamentals 2023" : "Advanced Programming Course"} 
          students={selectedRepository === 'programming-fundamentals' ? programmingStudents : sampleStudents} 
        />
        <div className="mt-3 p-2 bg-muted rounded-md">
          <p className="text-xs text-muted-foreground">
            {selectedRepository === 'programming-fundamentals' 
              ? "Showing detailed student data for Programming Fundamentals 2023." 
              : "This is a template view showing how repositories with student grades would appear."} 
            Click the <SlidersHorizontal className="h-3 w-3 inline mx-1" /> button to toggle back to regular repository view.
          </p>
        </div>
      </div>
    );
  }

  // Display all repositories
  const repositoriesToDisplay = repositories;

  return (
    <ScrollArea className="h-full">
      <div className={viewMode === 'grid' 
        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" 
        : "space-y-3"
      }>
        {repositoriesToDisplay.length > 0 ? (
          repositoriesToDisplay.map((repo) => (
            <div 
              key={repo.id || repo.name} 
              className="cursor-pointer transform transition-transform hover:scale-[1.01]"
              onClick={() => handleRepositoryClick(repo)}
            >
              <RepositoryCard {...repo} />
            </div>
          ))
        ) : (
          <div className="col-span-3 p-8 border border-dashed rounded-lg flex flex-col items-center justify-center text-center">
            <p className="text-muted-foreground mb-2">No repositories found</p>
            <p className="text-sm text-muted-foreground">Try changing your search or create a new repository</p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
