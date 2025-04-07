
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SideNav } from "@/components/dashboard/SideNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Edit, Save, User } from "lucide-react";
import { toast } from "sonner";
import { getRepositories, updateRepository, Repository, getRepositoryStudents, saveRepositoryStudent } from "@/services/repositoryData";
import { Student } from "@/services/studentData";
import { DeleteRepositoryDialog } from "@/components/dashboard/DeleteRepositoryDialog";
import { EditRepositoryDialog } from "@/components/dashboard/EditRepositoryDialog";
import { saveStudentData } from "@/services/studentData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function RepositoryDetailsPage() {
  const {
    id
  } = useParams();
  const navigate = useNavigate();
  const [repository, setRepository] = useState<Repository | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  
  useEffect(() => {
    loadRepository();
  }, [id]);

  const loadRepository = () => {
    if (id) {
      const allRepositories = getRepositories();
      const foundRepo = allRepositories.find(repo => repo.id === id);
      if (foundRepo) {
        setRepository(foundRepo);
        const repoStudents = getRepositoryStudents(id);
        
        const studentsWithTrend = repoStudents.map(student => ({
          ...student,
          commitTrend: student.commitTrend || 
            ['up', 'down', 'stable'][Math.floor(Math.random() * 3)] as 'up' | 'down' | 'stable'
        }));
        
        setStudents(studentsWithTrend);
      }
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate("/dashboard");
  };

  const handleRepositoryDeleted = () => {
    toast.success("Redirecting to dashboard", {
      description: "Repository has been deleted successfully."
    });
    navigate("/dashboard");
  };

  const handleRepositoryUpdated = (updatedRepo: Repository) => {
    setRepository(updatedRepo);
    setHasUnsavedChanges(false);
  };

  const saveChanges = () => {
    if (repository && repository.id) {
      const repoWithStudents = {
        ...repository,
        students: students
      };
      const success = updateRepository(repository.id, repoWithStudents);
      if (success) {
        setHasUnsavedChanges(false);
        toast.success("Changes saved", {
          description: "Repository data has been saved successfully."
        });
      } else {
        toast.error("Failed to save changes", {
          description: "An error occurred while saving your changes."
        });
      }
    }
  };

  const handleStudentAdded = async (newStudent: Student) => {
    setStudents(prev => [...prev, newStudent]);
    setHasUnsavedChanges(true);
    saveRepositoryStudent(id || '', newStudent);
    try {
      await saveStudentData({
        id: newStudent.id,
        name: newStudent.name,
        email: newStudent.email,
        commitCount: newStudent.commitCount,
        currentGrade: newStudent.grade || 'Not Graded',
        commitTrend: "up",
        commitPercentChange: 0,
        activityScore: 5.0,
        studentNumber: newStudent.studentNumber,
        gitlabUsername: newStudent.gitlabUsername,
        groupNumber: newStudent.groupNumber
      });
      toast.success("Student added", {
        description: `${newStudent.name} has been added to the repository.`
      });
    } catch (error) {
      console.error("Error saving detailed student data:", error);
      toast.error("Error saving student data", {
        description: "The student was added but detailed metrics could not be saved."
      });
    }
  };

  const handleStudentEdited = async (updatedStudent: Student) => {
    setStudents(prev => prev.map(student => student.id === updatedStudent.id ? updatedStudent : student));
    setHasUnsavedChanges(true);
    saveRepositoryStudent(id || '', updatedStudent);
    try {
      await saveStudentData({
        id: updatedStudent.id,
        name: updatedStudent.name,
        email: updatedStudent.email,
        commitCount: updatedStudent.commitCount,
        currentGrade: updatedStudent.grade || 'Not Graded',
        commitTrend: "up",
        commitPercentChange: 0,
        activityScore: 5.0,
        studentNumber: updatedStudent.studentNumber,
        gitlabUsername: updatedStudent.gitlabUsername,
        groupNumber: updatedStudent.groupNumber
      });
      toast.success("Student updated", {
        description: `${updatedStudent.name}'s information has been updated.`
      });
    } catch (error) {
      console.error("Error updating detailed student data:", error);
      toast.error("Error updating student data", {
        description: "The student was updated but detailed metrics could not be saved."
      });
    }
  };

  if (!loading && !repository) {
    return <div className="flex h-screen overflow-hidden">
        <SideNav />
        <main className="flex-1 overflow-y-auto p-6 bg-background">
          <div className="max-w-6xl mx-auto space-y-6">
            <Button variant="outline" onClick={handleGoBack} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="p-8 text-center">
              <h2 className="text-2xl font-semibold mb-2">Repository not found</h2>
              <p className="text-muted-foreground">The requested repository does not exist or has been removed.</p>
            </div>
          </div>
        </main>
      </div>;
  }

  return <div className="flex h-screen overflow-hidden">
      <SideNav />
      <main className="flex-1 overflow-y-auto p-6 bg-background">
        <div className="max-w-6xl mx-auto space-y-6">
          <Button variant="outline" onClick={handleGoBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          
          {repository && <>
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-semibold">{repository.name}</h1>
                  <p className="text-muted-foreground">{repository.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={() => setEditDialogOpen(true)} className="gap-2">
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)} className="gap-2">
                    <Edit className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-medium">Repository Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Project ID</TableHead>
                        <TableHead>ID/Group</TableHead>
                        <TableHead>Number of Students</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>{repository.projectId || 'N/A'}</TableCell>
                        <TableCell>{repository.id || 'N/A'}</TableCell>
                        <TableCell>{students.length}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-medium">Students Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>GitLab User</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {students.length > 0 ? (
                        students.map((student) => (
                          <TableRow key={student.id}>
                            <TableCell>
                              <div className="flex items-center">
                                <User className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                                {student.name || 'N/A'}
                              </div>
                            </TableCell>
                            <TableCell>{student.gitlabUsername || 'N/A'}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={2} className="text-center py-4 text-muted-foreground">
                            No students found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-medium">Activity Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Author</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Commits</TableHead>
                        <TableHead>Additions</TableHead>
                        <TableHead>Deletions</TableHead>
                        <TableHead>Operations</TableHead>
                        <TableHead>Week of Prediction</TableHead>
                        <TableHead>Final Grade Prediction</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>{repository.author || 'N/A'}</TableCell>
                        <TableCell>{repository.date || repository.lastActivity || 'N/A'}</TableCell>
                        <TableCell>{repository.commitCount || 0}</TableCell>
                        <TableCell>{repository.additions || 0}</TableCell>
                        <TableCell>{repository.deletions || 0}</TableCell>
                        <TableCell>{repository.operations || 0}</TableCell>
                        <TableCell>{repository.weekOfPrediction || 'Not set'}</TableCell>
                        <TableCell>{repository.finalGradePrediction || repository.predictedGrade || 'Not predicted'}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              
              {/* Removed RepositoryGradesView component */}
              
              <div className="flex justify-end mt-6">
                <Button variant="default" onClick={saveChanges} className="gap-2" disabled={!hasUnsavedChanges}>
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </div>
              
              <DeleteRepositoryDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} repositoryId={repository.id || ""} repositoryName={repository.name} onRepositoryDeleted={handleRepositoryDeleted} />
              
              <EditRepositoryDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} repository={repository} onRepositoryUpdated={handleRepositoryUpdated} />
            </>}
        </div>
      </main>
    </div>;
}
