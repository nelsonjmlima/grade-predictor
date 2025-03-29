
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, User, FileText, Award, Download } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Student {
  id: string;
  name: string;
  email: string;
  commitCount: number;
  grade?: string;
  lastActivity: string;
}

interface RepositoryGradesViewProps {
  repositoryName: string;
  students: Student[];
  repositoryId?: string;
}

export function RepositoryGradesView({ repositoryName, students, repositoryId }: RepositoryGradesViewProps) {
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
              <TableHead>Commits</TableHead>
              <TableHead>Last Activity</TableHead>
              <TableHead>Grade</TableHead>
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
                <TableCell>{student.commitCount}</TableCell>
                <TableCell>{student.lastActivity}</TableCell>
                <TableCell>
                  {student.grade ? (
                    <span className="font-semibold">{student.grade}</span>
                  ) : (
                    <span className="text-muted-foreground text-sm">Not graded</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
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
    </Card>
  );
}
