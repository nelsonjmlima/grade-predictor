
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SideNav } from "@/components/dashboard/SideNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, GitCommit, BarChart, Calendar, User, Activity } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip, Legend, LineChart, Line } from "recharts";
import { motion } from "framer-motion";
import { allRepositories, sampleStudents, programmingStudents } from "@/services/repositoryData";

// Sample student activity data
const activityData = [
  { month: "Jan", commits: 5, pullRequests: 2, reviews: 3 },
  { month: "Feb", commits: 8, pullRequests: 3, reviews: 5 },
  { month: "Mar", commits: 12, pullRequests: 5, reviews: 7 },
  { month: "Apr", commits: 6, pullRequests: 2, reviews: 4 },
  { month: "May", commits: 10, pullRequests: 4, reviews: 6 },
  { month: "Jun", commits: 15, pullRequests: 6, reviews: 8 },
];

// Sample daily activity
const dailyActivity = [
  { day: "Mon", activity: 12 },
  { day: "Tue", activity: 8 },
  { day: "Wed", activity: 15 },
  { day: "Thu", activity: 10 },
  { day: "Fri", activity: 6 },
  { day: "Sat", activity: 2 },
  { day: "Sun", activity: 4 },
];

// Sample commit message data
const commitsByType = [
  { type: "Feature", count: 25 },
  { type: "Bug Fix", count: 15 },
  { type: "Refactor", count: 10 },
  { type: "Docs", count: 5 },
  { type: "Testing", count: 8 },
];

export default function StudentMetricsPage() {
  const { id: repositoryId, studentId } = useParams();
  const navigate = useNavigate();
  const [repository, setRepository] = useState<any>(null);
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (repositoryId) {
      const foundRepo = allRepositories.find(repo => repo.id === repositoryId);
      if (foundRepo) {
        setRepository(foundRepo);
      }
      
      // Find the student based on the repository type
      const isProgRepo = repositoryId === 'programming-fundamentals';
      const studentsList = isProgRepo ? programmingStudents : sampleStudents;
      const foundStudent = studentsList.find(s => s.id === studentId);
      
      if (foundStudent) {
        setStudent(foundStudent);
      }
      
      setLoading(false);
    }
  }, [repositoryId, studentId]);

  const handleGoBack = () => {
    navigate(`/repositories/${repositoryId}`);
  };

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
              <h2 className="text-2xl font-semibold mb-2">Data not found</h2>
              <p className="text-muted-foreground">The requested student or repository data does not exist.</p>
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
            Back
          </Button>
          
          {student && repository && (
            <>
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-semibold">{student.name}</h1>
                  <p className="text-muted-foreground">{student.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" className="gap-2">
                    <Calendar className="h-4 w-4" />
                    Activity Log
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <GitCommit className="h-4 w-4" />
                    Commits
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
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
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-medium flex items-center gap-2">
                        <BarChart className="h-4 w-4" />
                        Grade
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">{student.grade || "Not graded"}</p>
                    </CardContent>
                  </Card>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-medium flex items-center gap-2">
                        <Activity className="h-4 w-4" />
                        Last Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">{student.lastActivity}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
              
              <Tabs defaultValue="activity" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                  <TabsTrigger value="commits">Commits</TabsTrigger>
                  <TabsTrigger value="patterns">Work Patterns</TabsTrigger>
                </TabsList>
                
                <TabsContent value="activity">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle>Monthly Activity</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-80">
                          <ChartContainer
                            config={{
                              commits: { color: "#8b5cf6" },
                              pullRequests: { color: "#06b6d4" },
                              reviews: { color: "#10b981" },
                            }}
                          >
                            <RechartsBarChart
                              data={activityData}
                              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="month" />
                              <YAxis />
                              <ChartTooltip
                                content={
                                  <ChartTooltipContent formatter={(value, name) => [`${value}`, name]} />
                                }
                              />
                              <Legend />
                              <Bar dataKey="commits" fill="#8b5cf6" name="Commits" />
                              <Bar dataKey="pullRequests" fill="#06b6d4" name="Pull Requests" />
                              <Bar dataKey="reviews" fill="#10b981" name="Reviews" />
                            </RechartsBarChart>
                          </ChartContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>
                
                <TabsContent value="commits">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle>Commit Types Distribution</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-80">
                          <ChartContainer
                            config={{
                              count: { color: "#8b5cf6" }
                            }}
                          >
                            <RechartsBarChart
                              data={commitsByType}
                              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="type" />
                              <YAxis />
                              <ChartTooltip
                                content={
                                  <ChartTooltipContent formatter={(value, name) => [`${value}`, 'Commits']} />
                                }
                              />
                              <Legend />
                              <Bar dataKey="count" fill="#8b5cf6" name="Commits" />
                            </RechartsBarChart>
                          </ChartContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>
                
                <TabsContent value="patterns">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle>Daily Activity Pattern</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-80">
                          <ChartContainer
                            config={{
                              activity: { color: "#8b5cf6" }
                            }}
                          >
                            <LineChart
                              data={dailyActivity}
                              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="day" />
                              <YAxis />
                              <ChartTooltip
                                content={
                                  <ChartTooltipContent formatter={(value, name) => [`${value}`, 'Activity Points']} />
                                }
                              />
                              <Legend />
                              <Line type="monotone" dataKey="activity" stroke="#8b5cf6" activeDot={{ r: 8 }} name="Activity Points" />
                            </LineChart>
                          </ChartContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
