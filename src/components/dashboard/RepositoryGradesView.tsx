
import { useState } from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, User, FileText, Award, Download, Pencil, Users, GitBranch, FileCode, FileEdit } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { StudentFormDialog } from "@/components/dashboard/StudentFormDialog";
import { toast } from "sonner";

export interface Student {
  id: string;
  name: string;
  email: string;
  commitCount: number;
  grade?: string;
  lastActivity: string;
  studentNumber?: string;
  gitlabUsername?: string;
  groupNumber?: number;
  additions?: number;
  deletions?: number;
  averageOperationsPerCommit?: number;
  averageCommitsPerWeek?: number;
  projectId?: string;
}

interface RepositoryGradesViewProps {
  repositoryName: string;
  students: Student[];
  repositoryId?: string;
  onStudentAdded?: (student: Student) => void;
  onStudentEdited?: (student: Student) => void;
}

export function RepositoryGradesView({ 
  repositoryName, 
  students, 
  repositoryId,
  onStudentAdded,
  onStudentEdited
}: RepositoryGradesViewProps) {
  const navigate = useNavigate();
  const [studentFormOpen, setStudentFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | undefined>(undefined);

  const handleViewStudentMetrics = (studentId: string) => {
    if (repositoryId) {
      navigate(`/repositories/${repositoryId}/student/${studentId}`);
    }
  };

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setStudentFormOpen(true);
  };

  const handleStudentSaved = (student: Student) => {
    if (editingStudent) {
      // Handle editing existing student
      onStudentEdited?.(student);
      toast.success(`Student ${student.name} updated successfully`);
    } else {
      // Handle adding new student
      onStudentAdded?.(student);
      toast.success(`Student ${student.name} added successfully`);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">{repositoryName} - Student Grades</CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button size="sm">
              <Award className="h-4 w-4 mr-2" />
              Assign Grades
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>Student grades and activity for {repositoryName}</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Student</TableHead>
              <TableHead>Project ID</TableHead>
              <TableHead>Total Commits</TableHead>
              <TableHead>Total Adds</TableHead>
              <TableHead>Total Dels</TableHead>
              <TableHead>Avg Ops/Commit</TableHead>
              <TableHead>Avg Commit/Week</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div>{student.name}</div>
                      <div className="text-xs text-muted-foreground">{student.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    <span className="font-medium">{student.projectId || student.studentNumber || 'N/A'}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    <GitBranch className="h-3.5 w-3.5 mr-1 text-blue-500" />
                    <span>{student.commitCount || 0}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    <FileCode className="h-3.5 w-3.5 mr-1 text-green-500" />
                    <span>{student.additions || 0}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    <FileEdit className="h-3.5 w-3.5 mr-1 text-red-500" />
                    <span>{student.deletions || 0}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span>{student.averageOperationsPerCommit?.toFixed(1) || '0.0'}</span>
                </TableCell>
                <TableCell>
                  <span>{student.averageCommitsPerWeek?.toFixed(1) || '0.0'}</span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => handleEditStudent(student)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <BarChart className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Student Activity Analysis</DialogTitle>
                          <DialogDescription>
                            Detailed activity metrics for {student.name}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                          <div className="rounded-md bg-muted p-8 h-[300px] flex items-center justify-center">
                            <p className="text-muted-foreground">Activity chart would appear here</p>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => handleViewStudentMetrics(student.id)}
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      
      <StudentFormDialog
        open={studentFormOpen}
        onOpenChange={setStudentFormOpen}
        onStudentSaved={handleStudentSaved}
        initialStudent={editingStudent}
        repositoryId={repositoryId || ''}
      />
    </Card>
  );
}
