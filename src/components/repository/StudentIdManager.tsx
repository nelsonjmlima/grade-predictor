
import { useState } from "react";
import { Plus, Trash2, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface StudentIdManagerProps {
  initialStudents?: Array<{
    id: number;
    name: string;
    username: string;
  }>;
  onChange: (students: Array<{
    id: number;
    name: string;
    username: string;
  }>) => void;
}

export function StudentIdManager({ initialStudents = [], onChange }: StudentIdManagerProps) {
  const [students, setStudents] = useState(initialStudents);
  const [studentId, setStudentId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [studentUsername, setStudentUsername] = useState("");

  const addStudent = () => {
    if (!studentId || isNaN(Number(studentId))) {
      return;
    }

    const id = Number(studentId);
    
    // Check if student ID already exists
    if (students.some(s => s.id === id)) {
      return;
    }

    const newStudents = [
      ...students,
      {
        id,
        name: studentName || `Student ${id}`,
        username: studentUsername || `user_${id}`,
      }
    ];
    
    setStudents(newStudents);
    onChange(newStudents);
    
    // Clear inputs
    setStudentId("");
    setStudentName("");
    setStudentUsername("");
  };

  const removeStudent = (idToRemove: number) => {
    const newStudents = students.filter(student => student.id !== idToRemove);
    setStudents(newStudents);
    onChange(newStudents);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Student Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col space-y-2">
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col">
              <label htmlFor="studentId" className="text-sm font-medium mb-1">
                Student ID
              </label>
              <Input
                id="studentId"
                type="number"
                placeholder="Enter ID"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="studentName" className="text-sm font-medium mb-1">
                Name
              </label>
              <Input
                id="studentName"
                type="text"
                placeholder="Enter name"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="studentUsername" className="text-sm font-medium mb-1">
                Username
              </label>
              <Input
                id="studentUsername"
                type="text"
                placeholder="Enter username"
                value={studentUsername}
                onChange={(e) => setStudentUsername(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end mt-2">
            <Button 
              size="sm" 
              onClick={addStudent}
              disabled={!studentId || isNaN(Number(studentId))}
            >
              <Plus className="h-4 w-4 mr-1" /> Add Student
            </Button>
          </div>
        </div>

        {students.length > 0 && (
          <div className="border rounded-md p-3 bg-muted/30">
            <div className="text-sm font-medium mb-2">Added Students</div>
            <div className="flex flex-wrap gap-2">
              {students.map((student) => (
                <Badge 
                  key={student.id} 
                  variant="secondary"
                  className="flex items-center gap-1 py-1.5 px-2"
                >
                  <User className="h-3 w-3" />
                  <span>
                    {student.name} ({student.username}, ID: {student.id})
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 ml-1 hover:bg-destructive/20"
                    onClick={() => removeStudent(student.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                    <span className="sr-only">Remove</span>
                  </Button>
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
