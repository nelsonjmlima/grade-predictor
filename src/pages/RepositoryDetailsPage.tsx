
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SideNav } from "@/components/dashboard/SideNav";
import { getRepositories, Repository, getRepositoryStudents } from "@/services/repositoryData";
import { Student } from "@/services/studentData";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, FileText, Users } from "lucide-react";
import { RepositoryComparisonChart } from "@/components/dashboard/RepositoryComparisonChart";
import { DeleteRepositoryDialog } from "@/components/dashboard/DeleteRepositoryDialog";
import { EditRepositoryDialog } from "@/components/dashboard/EditRepositoryDialog";
import { CSVImportDialog } from "@/components/dashboard/CSVImportDialog";
import { MetricsImportDialog } from "@/components/dashboard/MetricsImportDialog";
import { GradeAnalyticsDialog } from "@/components/dashboard/GradeAnalyticsDialog";
import { useAuth } from "@/contexts/AuthContext";

export default function RepositoryDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [repository, setRepository] = useState<Repository | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [csvDialogOpen, setCsvDialogOpen] = useState(false);
  const [metricsDialogOpen, setMetricsDialogOpen] = useState(false);
  const [gradeDialogOpen, setGradeDialogOpen] = useState(false);
  
  // Add state for chart props
  const [allRepositories, setAllRepositories] = useState<Repository[]>([]);
  
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        if (!id) {
          toast.error("Repository ID not provided");
          navigate("/dashboard");
          return;
        }

        // Fetch repository data
        const repositories = await getRepositories();
        setAllRepositories(repositories);
        
        const repo = repositories.find(r => r.id === id);
        
        if (!repo) {
          toast.error("Repository not found");
          navigate("/dashboard");
          return;
        }

        setRepository(repo);
        
        // Fetch students data
        const studentsData = await getRepositoryStudents(id);
        // Ensure we're handling either the array or string case
        setStudents(Array.isArray(studentsData) ? studentsData : []);
      } catch (error) {
        console.error("Error loading repository data:", error);
        toast.error("Failed to load repository data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, navigate, editDialogOpen, csvDialogOpen, metricsDialogOpen]);

  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };

  const handleEdit = () => {
    setEditDialogOpen(true);
  };

  const handleCSVImport = () => {
    setCsvDialogOpen(true);
  };

  const handleMetricsImport = () => {
    setMetricsDialogOpen(true);
  };

  const handleGradeAnalytics = () => {
    setGradeDialogOpen(true);
  };
  
  // Add handlers for dialog events
  const handleRepositoryDeleted = () => {
    toast.success("Repository deleted successfully");
    navigate("/dashboard");
  };
  
  const handleRepositoryUpdated = (updatedRepo: Repository) => {
    setRepository(updatedRepo);
    toast.success("Repository updated successfully");
  };
  
  const handleDataImported = (data: Partial<Repository>) => {
    if (repository) {
      setRepository({...repository, ...data});
    }
    toast.success("Data imported successfully");
  };

  if (loading) {
    return <div className="flex h-screen bg-background">
        <SideNav />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-4xl">
            <p>Loading repository details...</p>
          </div>
        </main>
      </div>;
  }

  if (!repository) {
    return <div className="flex h-screen bg-background">
        <SideNav />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-4xl">
            <p>Repository not found.</p>
          </div>
        </main>
      </div>;
  }

  return <div className="flex h-screen bg-background">
      <SideNav />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-4xl space-y-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")} className="mr-2">
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">{repository.name}</h1>
          </div>

          <div className="flex justify-between items-center">
            <p className="text-muted-foreground">
              View details and manage your repository.
            </p>
            <div className="space-x-2">
              <Button size="sm" onClick={handleEdit}>
                Edit Repository
              </Button>
              <Button size="sm" variant="destructive" onClick={handleDelete}>
                Delete Repository
              </Button>
            </div>
          </div>

          <Tabs defaultValue="details" className="w-full">
            <TabsList>
              <TabsTrigger value="details">
                <FileText className="h-4 w-4 mr-2" />
                Details
              </TabsTrigger>
              <TabsTrigger value="students">
                <Users className="h-4 w-4 mr-2" />
                Students
              </TabsTrigger>
              <TabsTrigger value="analytics">
                <FileText className="h-4 w-4 mr-2" />
                Analytics
              </TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="space-y-4">
              <Card>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h2 className="text-lg font-semibold">Repository Information</h2>
                      <p className="text-muted-foreground">
                        {repository.description || "No description provided."}
                      </p>
                      <div className="mt-4 space-y-2">
                        <div>
                          <strong>Project ID:</strong> {repository.projectId}
                        </div>
                        <div>
                          <strong>Last Activity:</strong> {repository.lastActivity}
                        </div>
                        <div>
                          <strong>Commit Count:</strong> {repository.commitCount}
                        </div>
                        <div>
                          <strong>Merge Request Count:</strong> {repository.mergeRequestCount}
                        </div>
                        <div>
                          <strong>Branch Count:</strong> {repository.branchCount}
                        </div>
                        <div>
                          <strong>Progress:</strong> {repository.progress}%
                        </div>
                      </div>
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold">Actions</h2>
                      <div className="mt-4 space-y-2">
                        <Button onClick={handleCSVImport} className="w-full">
                          Import CSV Data
                        </Button>
                        <Button onClick={handleMetricsImport} className="w-full">
                          Import Metrics
                        </Button>
                         <Button onClick={handleGradeAnalytics} className="w-full">
                          Grade Analytics
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="students" className="space-y-4">
              <Card>
                <CardContent>
                  <h2 className="text-lg font-semibold">Students</h2>
                  {students && students.length > 0 ? (
                    <ul>
                      {students.map(student => (
                        <li key={student.id} className="py-2">
                          {student.name} ({student.email})
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No students associated with this repository.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="analytics" className="space-y-4">
               <Card>
                <CardContent>
                  <RepositoryComparisonChart 
                    selectedRepos={[repository.id || '']} 
                    repositories={allRepositories}
                    selectedMetric="commit_frequency"
                    viewType="line"
                    timePeriod="semester"
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <DeleteRepositoryDialog 
        open={deleteDialogOpen} 
        onOpenChange={setDeleteDialogOpen} 
        repositoryId={id || ''} 
        repositoryName={repository.name}
        onRepositoryDeleted={handleRepositoryDeleted}
      />

      <EditRepositoryDialog 
        open={editDialogOpen} 
        onOpenChange={setEditDialogOpen} 
        repository={repository}
        onRepositoryUpdated={handleRepositoryUpdated}
      />

      <CSVImportDialog 
        open={csvDialogOpen} 
        onOpenChange={setCsvDialogOpen}
        onDataImported={handleDataImported}
      />

      <MetricsImportDialog 
        open={metricsDialogOpen} 
        onOpenChange={setMetricsDialogOpen}
        onDataImported={handleDataImported}
      />

      <GradeAnalyticsDialog 
        open={gradeDialogOpen}
        onOpenChange={setGradeDialogOpen}
        repositoryName={repository.name}
      />
    </div>;
}
