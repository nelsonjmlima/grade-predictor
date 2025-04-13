
import { useState, useEffect } from "react";
import { Plus, Trash2, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

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
  const [studentCount, setStudentCount] = useState<string>("1");
  
  const generateSequentialIds = (startId: number, count: number) => {
    const ids = [];
    for (let i = 0; i < count; i++) {
      ids.push(startId + i);
    }
    return ids;
  };

  const addStudent = () => {
    if (!studentId || isNaN(Number(studentId))) {
      return;
    }

    const baseId = Number(studentId);
    const count = Number(studentCount);
    
    // Generate sequential IDs
    const newIds = generateSequentialIds(baseId, count);
    
    // Filter out IDs that already exist in students
    const availableIds = newIds.filter(id => !students.some(s => s.id === id));
    
    if (availableIds.length === 0) {
      return;
    }
    
    const newStudents = [
      ...students,
      ...availableIds.map(id => ({
        id,
        name: studentName || `Student ${id}`,
        username: studentUsername || `user_${id}`,
      }))
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
          <div className="grid grid-cols-4 gap-2">
            <div className="flex flex-col">
              <label htmlFor="studentId" className="text-sm font-medium mb-1">
                Starting ID
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
              <label htmlFor="studentCount" className="text-sm font-medium mb-1">
                Number of Students
              </label>
              <Select 
                value={studentCount} 
                onValueChange={(value) => setStudentCount(value)}
              >
                <SelectTrigger id="studentCount">
                  <SelectValue placeholder="Select count" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 10].map(count => (
                    <SelectItem key={count} value={count.toString()}>
                      {count}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col">
              <label htmlFor="studentName" className="text-sm font-medium mb-1">
                Base Name
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
                Base Username
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
              <Plus className="h-4 w-4 mr-1" /> Add Students
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
