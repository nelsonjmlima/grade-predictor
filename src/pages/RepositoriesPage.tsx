
import { useState } from "react";
import { SideNav } from "@/components/dashboard/SideNav";
import { RepositoryCard } from "@/components/dashboard/RepositoryCard";
import { RepositoryGradesView } from "@/components/dashboard/RepositoryGradesView";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  GitlabIcon, 
  SlidersHorizontal,
  Plus,
  Grid,
  List,
  Calendar 
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateRepositoryDialog } from "@/components/dashboard/CreateRepositoryDialog";

// Sample repository data
const allRepositories = [
  {
    name: "Programming Fundamentals 2023",
    description: "Course repository for first-year programming fundamentals",
    lastActivity: "Today at 10:15",
    commitCount: 215,
    mergeRequestCount: 32,
    branchCount: 8,
    progress: 78,
    predictedGrade: "B+",
    id: "programming-fundamentals"
  },
  {
    name: "Team Alpha Project",
    description: "Software Engineering final project for Team Alpha",
    lastActivity: "Today at 13:45",
    commitCount: 127,
    mergeRequestCount: 18,
    branchCount: 5,
    progress: 68,
    predictedGrade: "B+"
  },
  {
    name: "Web Development Course",
    description: "Web development course repository for CS301",
    lastActivity: "Yesterday at 09:22",
    commitCount: 84,
    mergeRequestCount: 12,
    branchCount: 3,
    progress: 75,
    predictedGrade: "A-"
  },
  {
    name: "Algorithm Analysis",
    description: "Team project for algorithm performance analysis",
    lastActivity: "3 days ago",
    commitCount: 56,
    mergeRequestCount: 7,
    branchCount: 2,
    progress: 42
  },
  {
    name: "Database Systems",
    description: "Group project for database implementation",
    lastActivity: "5 days ago",
    commitCount: 92,
    mergeRequestCount: 15,
    branchCount: 4,
    progress: 61,
    predictedGrade: "B"
  },
  {
    name: "Mobile App Development",
    description: "Final year mobile application project",
    lastActivity: "1 week ago",
    commitCount: 143,
    mergeRequestCount: 21,
    branchCount: 7,
    progress: 83,
    predictedGrade: "A"
  },
  {
    name: "Computer Networks",
    description: "Network simulation and analysis project",
    lastActivity: "2 weeks ago",
    commitCount: 48,
    mergeRequestCount: 5,
    branchCount: 2,
    progress: 35
  }
];

// Sample student data for the grades view template
const sampleStudents = [
  { 
    id: "1", 
    name: "Emma Johnson", 
    email: "emma.j@university.edu", 
    commitCount: 34, 
    grade: "A", 
    lastActivity: "Today at 10:15" 
  },
  { 
    id: "2", 
    name: "Liam Smith", 
    email: "l.smith@university.edu", 
    commitCount: 27, 
    grade: "B+", 
    lastActivity: "Yesterday at 15:30" 
  },
  { 
    id: "3", 
    name: "Olivia Davis", 
    email: "o.davis@university.edu", 
    commitCount: 42, 
    grade: "A-", 
    lastActivity: "2 days ago" 
  },
  { 
    id: "4", 
    name: "Noah Wilson", 
    email: "n.wilson@university.edu", 
    commitCount: 18, 
    grade: "C+", 
    lastActivity: "3 days ago" 
  },
  { 
    id: "5", 
    name: "Sophia Martinez", 
    email: "s.martinez@university.edu", 
    commitCount: 31, 
    grade: undefined, 
    lastActivity: "5 days ago" 
  }
];

// New student data for Programming Fundamentals repository
const programmingStudents = [
  { 
    id: "1", 
    name: "Ines Silva", 
    email: "ines.silva@university.edu", 
    commitCount: 45, 
    grade: "A-", 
    lastActivity: "Today at 09:30" 
  },
  { 
    id: "2", 
    name: "Carolina Pereira", 
    email: "carolina.p@university.edu", 
    commitCount: 38, 
    grade: "B+", 
    lastActivity: "Yesterday at 14:20" 
  },
  { 
    id: "3", 
    name: "Bruna Costa", 
    email: "bruna.c@university.edu", 
    commitCount: 52, 
    grade: "A", 
    lastActivity: "Today at 11:45" 
  },
  { 
    id: "4", 
    name: "Luis Santos", 
    email: "luis.s@university.edu", 
    commitCount: 31, 
    grade: "C+", 
    lastActivity: "3 days ago" 
  },
  { 
    id: "5", 
    name: "Nelson Oliveira", 
    email: "nelson.o@university.edu", 
    commitCount: 41, 
    grade: "B", 
    lastActivity: "Yesterday at 08:15" 
  }
];

export default function RepositoriesPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [showGradesTemplate, setShowGradesTemplate] = useState(false);
  const [selectedRepository, setSelectedRepository] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const filteredRepositories = allRepositories.filter(repo => 
    repo.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    repo.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const sortedRepositories = [...filteredRepositories].sort((a, b) => {
    if (sortBy === 'recent') {
      // This is a simplified sort - in reality, you'd parse the dates
      return a.lastActivity > b.lastActivity ? -1 : 1;
    } else if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortBy === 'progress') {
      return b.progress - a.progress;
    }
    return 0;
  });

  const handleRepositorySelect = (repoId: string) => {
    setSelectedRepository(repoId);
    setShowGradesTemplate(true);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <SideNav />
      
      <main className="flex-1 overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
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
              <Button size="sm" className="h-9 px-4" onClick={() => setDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Repository
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search repositories..." 
                className="pl-9 w-full md:w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Recent Activity</SelectItem>
                  <SelectItem value="name">Repository Name</SelectItem>
                  <SelectItem value="progress">Progress</SelectItem>
                </SelectContent>
              </Select>
              
              <Button 
                variant="outline" 
                size="icon" 
                className="h-10 w-10"
                onClick={() => setShowGradesTemplate(!showGradesTemplate)}
              >
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
              
              <div className="flex border rounded-md overflow-hidden">
                <Button 
                  variant={viewMode === 'grid' ? 'default' : 'ghost'} 
                  size="icon" 
                  className="h-10 w-10 rounded-none"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button 
                  variant={viewMode === 'list' ? 'default' : 'ghost'} 
                  size="icon" 
                  className="h-10 w-10 rounded-none"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Show grades template view when toggled */}
          {showGradesTemplate ? (
            <div className="animate-fade-in mb-8">
              <RepositoryGradesView 
                repositoryName={selectedRepository === 'programming-fundamentals' ? "Programming Fundamentals 2023" : "Advanced Programming Course"} 
                students={selectedRepository === 'programming-fundamentals' ? programmingStudents : sampleStudents} 
              />
              <div className="mt-6 p-3 bg-muted rounded-md">
                <p className="text-sm text-muted-foreground">
                  {selectedRepository === 'programming-fundamentals' 
                    ? "Showing detailed student data for Programming Fundamentals 2023." 
                    : "This is a template view showing how repositories with student grades would appear."} 
                  Click the <SlidersHorizontal className="h-3 w-3 inline mx-1" /> button to toggle back to the regular repository view.
                </p>
              </div>
            </div>
          ) : (
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
              : "space-y-4"
            }>
              {sortedRepositories.map((repo, index) => (
                <div 
                  key={repo.name} 
                  className="animate-fade-in opacity-0" 
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => repo.id === 'programming-fundamentals' ? handleRepositorySelect(repo.id) : null}
                >
                  <RepositoryCard {...repo} />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <CreateRepositoryDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen} 
      />
    </div>
  );
}
