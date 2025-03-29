
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SideNav } from "@/components/dashboard/SideNav";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, GitCommit, User, FileText, Award, Clock, BarChart2, LineChart as LineChartIcon, GitBranch } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { GradeAnalyticsDialog } from "@/components/dashboard/GradeAnalyticsDialog";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from "recharts";
import { allRepositories, sampleStudents, programmingStudents } from "@/services/repositoryData";

export default function StudentMetricsPage() {
  const { id, studentId } = useParams();
  const navigate = useNavigate();
  const [repository, setRepository] = useState<any>(null);
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showGradeAnalytics, setShowGradeAnalytics] = useState(false);

  // Simulated activity data
  const activityData = [
    { date: "2023-09-01", commits: 5, lines: 120, mergeRequests: 1 },
    { date: "2023-09-08", commits: 8, lines: 230, mergeRequests: 2 },
    { date: "2023-09-15", commits: 3, lines: 80, mergeRequests: 1 },
    { date: "2023-09-22", commits: 12, lines: 340, mergeRequests: 3 },
    { date: "2023-09-29", commits: 7, lines: 190, mergeRequests: 2 },
    { date: "2023-10-06", commits: 10, lines: 280, mergeRequests: 2 },
  ];

  // Simulated performance data
  const performanceData = [
    { name: "Code Quality", value: 78 },
    { name: "Test Coverage", value: 62 },
    { name: "Git Collaboration", value: 85 },
    { name: "Documentation", value: 70 },
    { name: "Problem Solving", value: 82 },
    { name: "Algorithm Efficiency", value: 75 },
  ];

  useEffect(() => {
    if (id && studentId) {
      // Find repository by id
      const foundRepo = allRepositories.find(repo => repo.id === id);
      
      // Find student data
      const students = id === 'programming-fundamentals' ? programmingStudents : sampleStudents;
      const foundStudent = students.find(s => s.id === studentId);
      
      if (foundRepo) {
        setRepository(foundRepo);
      }
      
      if (foundStudent) {
        setStudent(foundStudent);
      }
      
      setLoading(false);
    }
  }, [id, studentId]);

  const handleGoBack = () => {
    navigate(`/repositories/${id}`);
  };

  const handleViewGitlabMetrics = () => {
    navigate(`/repositories/${id}/student/${studentId}/gitlab`);
  };

  // If repository or student not found
  if (!loading && (!repository || !student)) {
    return (
      <div className="flex h-screen overflow-hidden">
        <SideNav />
        <main className="flex-1 overflow-y-auto p-6 bg-background">
          <div className="max-w-6xl mx-auto space-y-6">
            <Button variant="outline" onClick={handleGoBack} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="p-8 text-center">
              <h2 className="text-2xl font-semibold mb-2">Student or repository not found</h2>
              <p className="text-muted-foreground">The requested student or repository does not exist or has been removed.</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <SideNav />
      <main className="flex-1 overflow-y-auto p-6 bg-background">
        <div className="max-w-6xl mx-auto space-y-6">
          <Button variant="outline" onClick={handleGoBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Repository
          </Button>
          
          {student && repository && (
            <>
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-semibold">{student.name}</h1>
                  <p className="text-muted-foreground">{student.email} • {repository.name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    className="gap-2"
                    onClick={() => window.open(`mailto:${student.email}`)}
                  >
                    <User className="h-4 w-4" />
                    Contact Student
                  </Button>
                  <Button 
                    variant="outline"
                    className="gap-2"
                    onClick={handleViewGitlabMetrics}
                  >
                    <GitBranch className="h-4 w-4" />
                    GitLab Metrics
                  </Button>
                  <Button 
                    onClick={() => setShowGradeAnalytics(true)}
                    className="gap-2"
                  >
                    <Award className="h-4 w-4" />
                    Grade Analytics
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                      <GitCommit className="h-4 w-4" />
                      Commits
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{student.commitCount}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                      <Award className="h-4 w-4" />
                      Current Grade
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{student.grade || "Not graded"}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Last Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{student.lastActivity}</p>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Student Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Course Completion</span>
                      <span className="font-medium">78%</span>
                    </div>
                    <Progress value={78} className="h-2" />
                    <p className="text-sm text-muted-foreground pt-2">
                      Based on assignment completion and participation
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Tabs defaultValue="activity" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                  <TabsTrigger value="performance">Performance</TabsTrigger>
                  <TabsTrigger value="assignments">Assignments</TabsTrigger>
                </TabsList>
                
                <TabsContent value="activity">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                      <CardDescription>Student's activity over the last 6 weeks</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={activityData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line 
                              type="monotone" 
                              dataKey="commits" 
                              stroke="#6366F1" 
                              activeDot={{ r: 8 }}
                              name="Commits"
                            />
                            <Line 
                              type="monotone" 
                              dataKey="lines" 
                              stroke="#10B981" 
                              name="Lines of Code"
                            />
                            <Line 
                              type="monotone" 
                              dataKey="mergeRequests" 
                              stroke="#F59E0B" 
                              name="Merge Requests"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="performance">
                  <Card>
                    <CardHeader>
                      <CardTitle>Performance Metrics</CardTitle>
                      <CardDescription>Assessment of various performance indicators</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={performanceData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            layout="vertical"
                          >
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} opacity={0.2} />
                            <XAxis type="number" domain={[0, 100]} />
                            <YAxis dataKey="name" type="category" width={150} />
                            <Tooltip formatter={(value) => [`${value}%`, "Score"]} />
                            <Bar 
                              dataKey="value" 
                              fill="#6366F1" 
                              name="Performance Score"
                              radius={[0, 4, 4, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="assignments">
                  <Card>
                    <CardHeader>
                      <CardTitle>Assignment Performance</CardTitle>
                      <CardDescription>Grades and submission status for assignments</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="divide-y">
                        {[
                          { name: "Homework 1: Introduction", score: 95, status: "Completed", date: "2023-09-05" },
                          { name: "Lab Exercise 1: Git Basics", score: 88, status: "Completed", date: "2023-09-12" },
                          { name: "Homework 2: Data Structures", score: 78, status: "Completed", date: "2023-09-19" },
                          { name: "Project Milestone 1", score: 92, status: "Completed", date: "2023-09-26" },
                          { name: "Homework 3: Algorithms", score: 85, status: "Completed", date: "2023-10-03" },
                          { name: "Lab Exercise 2: Testing", score: null, status: "Pending", date: "Due 2023-10-10" },
                        ].map((assignment, index) => (
                          <div key={index} className="py-4 flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">{assignment.name}</h4>
                              <p className="text-sm text-muted-foreground">{assignment.date}</p>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                assignment.status === "Completed" 
                                  ? "bg-green-100 text-green-800" 
                                  : "bg-amber-100 text-amber-800"
                              }`}>
                                {assignment.status}
                              </span>
                              {assignment.score !== null ? (
                                <span className="font-medium">{assignment.score}/100</span>
                              ) : (
                                <span className="text-muted-foreground">—</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
              
              <GradeAnalyticsDialog 
                open={showGradeAnalytics}
                onOpenChange={setShowGradeAnalytics}
                repositoryName={repository.name}
              />
            </>
          )}
        </div>
      </main>
    </div>
  );
}
