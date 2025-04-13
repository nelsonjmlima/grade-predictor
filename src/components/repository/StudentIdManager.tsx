
import { useState } from "react";
import { Plus, User, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface StudentIdManagerProps {
  initialStudents?: Array<{
    id: number;
    name: string;
    username: string;
    selected?: boolean;
  }>;
  onChange: (students: Array<{
    id: number;
    name: string;
    username: string;
    selected?: boolean;
  }>) => void;
}

export function StudentIdManager({ initialStudents = [], onChange }: StudentIdManagerProps) {
  const [students, setStudents] = useState(initialStudents.map(student => ({
    ...student,
    selected: false // Explicitly set to false for all students
  })));
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
      toast.error("Student ID already exists", {
        id: "student-id-exists", // Using a fixed ID to prevent duplicate toasts
      });
      return;
    }

    const newStudents = [
      ...students,
      {
        id,
        name: studentName || `Student ${id}`,
        username: studentUsername || `user_${id}`,
        selected: false, // Ensure new students are not pre-selected
      }
    ];
    
    setStudents(newStudents);
    onChange(newStudents);
    
    toast.success("Student added successfully", {
      id: "student-added", // Using a fixed ID to prevent duplicate toasts
    });
    
    // Clear inputs
    setStudentId("");
    setStudentName("");
    setStudentUsername("");
  };

  const toggleStudentSelection = (idToToggle: number) => {
    const newStudents = students.map(student => 
      student.id === idToToggle 
        ? { ...student, selected: !student.selected } 
        : student
    );
    setStudents(newStudents);
    onChange(newStudents);
    
    const selectedStudent = newStudents.find(s => s.id === idToToggle);
    if (selectedStudent) {
      toast.info(
        selectedStudent.selected 
          ? `Selected student: ${selectedStudent.name}` 
          : `Deselected student: ${selectedStudent.name}`,
        { id: `toggle-student-${idToToggle}` } // Using a dynamic ID based on the student to prevent duplicates
      );
    }
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
          <div className="mt-2">
            <Button 
              size="default" 
              onClick={addStudent}
              disabled={!studentId || isNaN(Number(studentId))}
              className="w-full flex items-center justify-center"
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
                  variant={student.selected ? "secondary" : "outline"}
                  className={`flex items-center gap-1 py-1.5 px-2 ${student.selected ? 'bg-secondary' : 'bg-muted/50'}`}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 mr-1"
                    onClick={() => toggleStudentSelection(student.id)}
                  >
                    {student.selected ? 
                      <Check className="h-3 w-3 text-primary" /> : 
                      <Plus className="h-3 w-3" />
                    }
                    <span className="sr-only">
                      {student.selected ? "Deselect" : "Select"} student
                    </span>
                  </Button>
                  <User className="h-3 w-3" />
                  <span>
                    {student.name} ({student.username}, ID: {student.id})
                  </span>
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
