
import { useState } from "react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Legend, TooltipProps
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

// Sample data
const students = [
  { id: 1, name: "Alex Johnson" },
  { id: 2, name: "Maria Garcia" },
  { id: 3, name: "Zack Williams" },
  { id: 4, name: "Jamie Chen" },
  { id: 5, name: "Sam Taylor" },
];

const metrics = [
  { id: "commit_frequency", name: "Commit Frequency" },
  { id: "code_quality", name: "Code Quality" },
  { id: "test_coverage", name: "Test Coverage" },
  { id: "completion_rate", name: "Completion Rate" },
];

const timePoints = [
  { id: "week1", name: "Week 1" },
  { id: "week3", name: "Week 3" },
  { id: "week6", name: "Week 6" },
  { id: "week9", name: "Week 9" },
  { id: "week12", name: "Week 12" },
];

// Generate data
const generateData = () => {
  return timePoints.map(timePoint => {
    const data: any = { name: timePoint.name };
    students.forEach(student => {
      data[student.name] = Math.floor(Math.random() * 100);
    });
    return data;
  });
};

const data = generateData();

const colors = [
  "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A569BD"
];

export function StudentComparisonChart() {
  const [selectedMetric, setSelectedMetric] = useState(metrics[0].id);
  const [selectedStudents, setSelectedStudents] = useState([1, 2, 3]);
  
  const toggleStudent = (studentId: number) => {
    if (selectedStudents.includes(studentId)) {
      setSelectedStudents(selectedStudents.filter(id => id !== studentId));
    } else {
      setSelectedStudents([...selectedStudents, studentId]);
    }
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Student Performance Comparison</CardTitle>
            <CardDescription>Compare students across different metrics</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select value={selectedMetric} onValueChange={setSelectedMetric}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Select metric" />
              </SelectTrigger>
              <SelectContent>
                {metrics.map(metric => (
                  <SelectItem key={metric.id} value={metric.id}>
                    {metric.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Students <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {students.map(student => (
                  <DropdownMenuItem 
                    key={student.id} 
                    onClick={() => toggleStudent(student.id)}
                    className="flex items-center"
                  >
                    <div className={`w-3 h-3 rounded-full mr-2 ${selectedStudents.includes(student.id) ? 'bg-primary' : 'bg-muted'}`} />
                    {student.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              {students.map((student, index) => (
                <linearGradient key={student.id} id={`color${student.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors[index % colors.length]} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={colors[index % colors.length]} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
            <XAxis dataKey="name" fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip 
              contentStyle={{ 
                borderRadius: '8px', 
                border: 'none', 
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                padding: '8px 12px',
                fontSize: '12px'
              }} 
              itemStyle={{ padding: '2px 0' }}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            {students
              .filter(student => selectedStudents.includes(student.id))
              .map((student, index) => (
                <Area
                  key={student.id}
                  type="monotone"
                  dataKey={student.name}
                  stroke={colors[index % colors.length]}
                  fillOpacity={1}
                  fill={`url(#color${student.id})`}
                  activeDot={{ r: 6 }}
                  strokeWidth={2}
                />
              ))}
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
