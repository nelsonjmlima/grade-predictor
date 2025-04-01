
import { useState, useEffect } from "react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Legend, TooltipProps, BarChart, Bar
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, BarChart2, Activity } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Student } from "@/services/repositoryData";

type ChartMetric = "commitCount" | "additions" | "deletions" | "operations" | "averageCommit";

interface MetricInfo {
  id: ChartMetric;
  name: string;
  description: string;
}

const metrics: MetricInfo[] = [
  { id: "commitCount", name: "Commit Count", description: "Number of commits by each student" },
  { id: "additions", name: "Additions", description: "Lines of code added" },
  { id: "deletions", name: "Deletions", description: "Lines of code removed" },
  { id: "operations", name: "Operations", description: "Total git operations" },
  { id: "averageCommit", name: "Average Commit Size", description: "Average operations per commit" },
];

// Generate random colors for each student
const generateColors = (count: number) => {
  const colors = [
    "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A569BD", 
    "#3498DB", "#16A085", "#F39C12", "#E74C3C", "#9B59B6",
    "#2ECC71", "#F1C40F", "#E67E22", "#1ABC9C", "#5499C7"
  ];
  
  // If we need more colors than in our preset array, generate additional ones
  if (count > colors.length) {
    for (let i = colors.length; i < count; i++) {
      const r = Math.floor(Math.random() * 200);
      const g = Math.floor(Math.random() * 200);
      const b = Math.floor(Math.random() * 200);
      colors.push(`rgb(${r}, ${g}, ${b})`);
    }
  }
  
  return colors.slice(0, count);
};

interface GroupStudentComparisonChartProps {
  students: Student[];
  repositoryName: string;
}

export function GroupStudentComparisonChart({ students, repositoryName }: GroupStudentComparisonChartProps) {
  const [selectedMetric, setSelectedMetric] = useState<ChartMetric>("commitCount");
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [chartType, setChartType] = useState<"area" | "bar">("bar");
  const [colors, setColors] = useState<string[]>([]);
  
  // Initialize selected students (select all by default)
  useEffect(() => {
    if (students.length > 0 && selectedStudents.length === 0) {
      setSelectedStudents(students.map(student => student.id));
      setColors(generateColors(students.length));
    }
  }, [students]);

  const toggleStudent = (studentId: string) => {
    if (selectedStudents.includes(studentId)) {
      setSelectedStudents(selectedStudents.filter(id => id !== studentId));
    } else {
      setSelectedStudents([...selectedStudents, studentId]);
    }
  };

  // Generate comparison data for the chart
  const generateComparisonData = () => {
    if (selectedStudents.length === 0) return [];

    // Filter students to only include selected ones
    const filteredStudents = students.filter(student => 
      selectedStudents.includes(student.id)
    );

    // Bar chart data (simpler format - each student is a category)
    if (chartType === "bar") {
      return filteredStudents.map(student => {
        // Calculate average commit size if that's the selected metric
        const averageCommit = student.commitCount > 0 ? 
          (student.commitCount / Math.max(1, student.commitCount)) : 0;

        return {
          name: student.name.split(' ')[0], // Use first name only to save space
          id: student.id,
          [selectedMetric === "averageCommit" ? "value" : selectedMetric]: 
            selectedMetric === "averageCommit" ? averageCommit : student[selectedMetric] || 0
        };
      });
    }
    
    // Area chart data (time-based - we'll simulate some time points)
    const timePoints = ["Week 1", "Week 2", "Week 3", "Week 4"];
    
    return timePoints.map(week => {
      const data: any = { name: week };
      
      filteredStudents.forEach(student => {
        // For the area chart, we'll simulate some data distribution over time
        // In a real app, you'd use actual time-series data
        let baseValue = 0;
        
        switch(selectedMetric) {
          case "commitCount":
            baseValue = student.commitCount || 0;
            break;
          case "additions":
            baseValue = student.additions || 0;
            break;
          case "deletions":
            baseValue = student.deletions || 0;
            break;
          case "operations":
            baseValue = student.operations || 0;
            break;
          case "averageCommit":
            baseValue = student.commitCount ? (student.operations || 0) / student.commitCount : 0;
            break;
        }
        
        // Distribute the value across weeks with some randomness
        // This is just for visualization purposes
        const weekIndex = parseInt(week.split(' ')[1]) - 1;
        const weekMultiplier = [0.2, 0.4, 0.7, 1.0][weekIndex];
        const randomFactor = 0.8 + (Math.random() * 0.4); // 0.8 to 1.2
        
        data[student.name] = Math.round(baseValue * weekMultiplier * randomFactor);
      });
      
      return data;
    });
  };

  const chartData = generateComparisonData();

  return (
    <Card className="animate-fade-in">
      <CardHeader className="pb-1 pt-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-base">{repositoryName} - Student Performance Comparison</CardTitle>
            <CardDescription className="text-xs">
              Compare students across different performance metrics
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Tabs value={chartType} onValueChange={(value) => setChartType(value as "area" | "bar")} className="w-[150px]">
              <TabsList className="h-7">
                <TabsTrigger value="bar" className="text-xs h-6">
                  <BarChart2 className="h-3 w-3 mr-1" />
                  Bar
                </TabsTrigger>
                <TabsTrigger value="area" className="text-xs h-6">
                  <Activity className="h-3 w-3 mr-1" />
                  Timeline
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            <Select value={selectedMetric} onValueChange={(value) => setSelectedMetric(value as ChartMetric)}>
              <SelectTrigger className="w-[140px] h-7 text-xs">
                <SelectValue placeholder="Select metric" />
              </SelectTrigger>
              <SelectContent>
                {metrics.map(metric => (
                  <SelectItem key={metric.id} value={metric.id} className="text-xs">
                    {metric.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-7 text-xs px-2">
                  Students <ChevronDown className="ml-1 h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="text-xs">
                {students.map((student, index) => (
                  <DropdownMenuItem 
                    key={student.id} 
                    onClick={() => toggleStudent(student.id)}
                    className="flex items-center text-xs"
                  >
                    <div 
                      className="w-2 h-2 rounded-full mr-2" 
                      style={{ 
                        backgroundColor: selectedStudents.includes(student.id) 
                          ? colors[index] || '#888'
                          : 'transparent',
                        border: `1px solid ${colors[index] || '#888'}`
                      }} 
                    />
                    {student.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="h-[350px]">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "bar" ? (
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                <XAxis dataKey="name" fontSize={11} />
                <YAxis fontSize={11} />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '8px', 
                    border: 'none', 
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    padding: '6px 10px',
                    fontSize: '11px'
                  }} 
                  formatter={(value, name) => {
                    // Show the student name instead of "value" or the metric name
                    const student = students.find(s => s.name.split(' ')[0] === name);
                    return [value, student?.name || name];
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar 
                  dataKey={selectedMetric === "averageCommit" ? "value" : selectedMetric} 
                  fill="#8884d8"
                  name={metrics.find(m => m.id === selectedMetric)?.name || ""}
                >
                  {chartData.map((entry, index) => {
                    const studentIndex = students.findIndex(s => s.id === entry.id);
                    return (
                      <rect
                        key={`bar-${index}`}
                        fill={colors[studentIndex] || "#8884d8"}
                      />
                    );
                  })}
                </Bar>
              </BarChart>
            ) : (
              <AreaChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  {students
                    .filter(student => selectedStudents.includes(student.id))
                    .map((student, index) => (
                      <linearGradient key={student.id} id={`color${student.id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={colors[index] || "#8884d8"} stopOpacity={0.8} />
                        <stop offset="95%" stopColor={colors[index] || "#8884d8"} stopOpacity={0} />
                      </linearGradient>
                    ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                <XAxis dataKey="name" fontSize={11} />
                <YAxis fontSize={11} />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '8px', 
                    border: 'none', 
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    padding: '6px 10px',
                    fontSize: '11px'
                  }} 
                  itemStyle={{ padding: '2px 0' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                {students
                  .filter(student => selectedStudents.includes(student.id))
                  .map((student, index) => (
                    <Area
                      key={student.id}
                      type="monotone"
                      dataKey={student.name}
                      stroke={colors[index] || "#8884d8"}
                      fillOpacity={1}
                      fill={`url(#color${student.id})`}
                      activeDot={{ r: 5 }}
                      strokeWidth={1.5}
                    />
                  ))}
              </AreaChart>
            )}
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">
              {students.length === 0 
                ? "No student data available for this repository" 
                : "Select at least one student to display the chart"}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
