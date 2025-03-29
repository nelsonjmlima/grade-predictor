import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SideNav } from "@/components/dashboard/SideNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, GitCommit, BarChart, Calendar, User, Activity, Clock, FileText } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import { motion } from "framer-motion";
import { allRepositories, sampleStudents, programmingStudents } from "@/services/repositoryData";
import { toast } from "sonner";

const generateWeeklyCommitData = (studentId) => {
  const baseValue = parseInt(studentId.split('-')[1], 10) * 3 || 5;
  return [
    { week: "Week 1", commits: baseValue + Math.floor(Math.random() * 10) },
    { week: "Week 2", commits: baseValue + Math.floor(Math.random() * 15) },
    { week: "Week 3", commits: baseValue + Math.floor(Math.random() * 20) },
    { week: "Week 4", commits: baseValue + Math.floor(Math.random() * 12) },
    { week: "Week 5", commits: baseValue + Math.floor(Math.random() * 18) },
    { week: "Week 6", commits: baseValue + Math.floor(Math.random() * 25) },
  ];
};

const generateFileModificationsData = (studentId) => {
  const baseValue = parseInt(studentId.split('-')[1], 10) * 2 || 4;
  return [
    { name: "JavaScript", value: baseValue + Math.floor(Math.random() * 30) },
    { name: "CSS", value: baseValue + Math.floor(Math.random() * 20) },
    { name: "HTML", value: Math.floor(Math.random() * 15) },
    { name: "Assets", value: Math.floor(Math.random() * 10) },
    { name: "Config", value: Math.floor(Math.random() * 5) },
  ];
};

const generateDailyActivityData = (studentId) => {
  const baseValue = parseInt(studentId.split('-')[1], 10) || 3;
  return [
    { day: "Mon", activity: baseValue + Math.floor(Math.random() * 10) },
    { day: "Tue", activity: baseValue + Math.floor(Math.random() * 12) },
    { day: "Wed", activity: baseValue + Math.floor(Math.random() * 15) },
    { day: "Thu", activity: baseValue + Math.floor(Math.random() * 10) },
    { day: "Fri", activity: baseValue + Math.floor(Math.random() * 8) },
    { day: "Sat", activity: baseValue + Math.floor(Math.random() * 5) },
    { day: "Sun", activity: baseValue + Math.floor(Math.random() * 3) },
  ];
};

const generateCommitTypeData = (studentId) => {
  const baseValue = parseInt(studentId.split('-')[1], 10) || 2;
  return [
    { type: "Feature", count: baseValue + Math.floor(Math.random() * 20) },
    { type: "Bug Fix", count: baseValue + Math.floor(Math.random() * 15) },
    { type: "Refactor", count: baseValue + Math.floor(Math.random() * 10) },
    { type: "Docs", count: Math.floor(Math.random() * 8) },
    { type: "Testing", count: Math.floor(Math.random() * 6) },
  ];
};

const generateCodeQualityData = (studentId) => {
  const baseValue = parseInt(studentId.split('-')[1], 10) * 5 || 10;
  return [
    { metric: "Code Coverage", value: Math.min(100, baseValue + 50 + Math.floor(Math.random() * 30)) },
    { metric: "Maintainability", value: Math.min(100, baseValue + 60 + Math.floor(Math.random() * 20)) },
    { metric: "Performance", value: Math.min(100, baseValue + 40 + Math.floor(Math.random() * 40)) },
    { metric: "Modularity", value: Math.min(100, baseValue + 55 + Math.floor(Math.random() * 25)) },
    { metric: "Documentation", value: Math.min(100, baseValue + 30 + Math.floor(Math.random() * 35)) },
  ];
};

const generateCollaborationData = (studentId) => {
  const baseValue = parseInt(studentId.split('-')[1], 10) || 2;
  return [
    { month: "Jan", reviews: baseValue + Math.floor(Math.random() * 5), discussions: baseValue + Math.floor(Math.random() * 8) },
    { month: "Feb", reviews: baseValue + Math.floor(Math.random() * 7), discussions: baseValue + Math.floor(Math.random() * 10) },
    { month: "Mar", reviews: baseValue + Math.floor(Math.random() * 6), discussions: baseValue + Math.floor(Math.random() * 12) },
    { month: "Apr", reviews: baseValue + Math.floor(Math.random() * 8), discussions: baseValue + Math.floor(Math.random() * 9) },
    { month: "May", reviews: baseValue + Math.floor(Math.random() * 10), discussions: baseValue + Math.floor(Math.random() * 15) },
    { month: "Jun", reviews: baseValue + Math.floor(Math.random() * 12), discussions: baseValue + Math.floor(Math.random() * 14) },
  ];
};

const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

export default function StudentMetricsPage() {
  const { id: repositoryId, studentId } = useParams();
  const navigate = useNavigate();
  const [repository, setRepository] = useState<any>(null);
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("activity");
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  
  const [weeklyCommits, setWeeklyCommits] = useState([]);
  const [fileModifications, setFileModifications] = useState([]);
  const [dailyActivity, setDailyActivity] = useState([]);
  const [commitTypes, setCommitTypes] = useState([]);
  const [codeQuality, setCodeQuality] = useState([]);
  const [collaboration, setCollaboration] = useState([]);

  useEffect(() => {
    if (repositoryId) {
      const foundRepo = allRepositories.find(repo => repo.id === repositoryId);
      if (foundRepo) {
        setRepository(foundRepo);
      }
      
      const isProgRepo = repositoryId === 'programming-fundamentals';
      const studentsList = isProgRepo ? programmingStudents : sampleStudents;
      const foundStudent = studentsList.find(s => s.id === studentId);
      
      if (foundStudent) {
        setStudent(foundStudent);
        
        setTimeout(() => {
          setWeeklyCommits(generateWeeklyCommitData(studentId));
          setFileModifications(generateFileModificationsData(studentId));
          setDailyActivity(generateDailyActivityData(studentId));
          setCommitTypes(generateCommitTypeData(studentId));
          setCodeQuality(generateCodeQualityData(studentId));
          setCollaboration(generateCollaborationData(studentId));
          setIsDataLoaded(true);
          setLoading(false);
          toast.success("Student metrics loaded successfully");
        }, 1000);
      } else {
        setLoading(false);
        toast.error("Student not found");
      }
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

  if (loading || !isDataLoaded) {
    return (
      <div className="flex h-screen overflow-hidden">
        <SideNav />
        <main className="flex-1 overflow-y-auto p-6 bg-background">
          <div className="max-w-6xl mx-auto space-y-6">
            <Button variant="outline" onClick={handleGoBack} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            
            <div className="flex justify-between items-center">
              <div className="animate-pulse">
                <div className="h-8 w-48 bg-gray-200 rounded"></div>
                <div className="h-4 w-64 bg-gray-200 rounded mt-2"></div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((item) => (
                <Card key={item}>
                  <CardHeader className="pb-2">
                    <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="h-80 w-full bg-gray-100 rounded animate-pulse"></div>
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
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex justify-between items-center"
              >
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
                    View Commits
                  </Button>
                </div>
              </motion.div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
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
                  transition={{ duration: 0.5, delay: 0.2 }}
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
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
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
                </motion.div>
              </div>
              
              <Tabs 
                defaultValue="activity" 
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="mb-4 grid grid-cols-4 md:flex">
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                  <TabsTrigger value="commits">Commits</TabsTrigger>
                  <TabsTrigger value="patterns">Work Patterns</TabsTrigger>
                  <TabsTrigger value="quality">Code Quality</TabsTrigger>
                </TabsList>
                
                <TabsContent value="activity">
                  <motion.div
                    key="activity"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <GitCommit className="h-4 w-4" />
                          Weekly Commits
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-80">
                          <ChartContainer
                            config={{
                              commits: { color: "#8b5cf6" }
                            }}
                          >
                            <RechartsBarChart
                              data={weeklyCommits}
                              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="week" />
                              <YAxis />
                              <ChartTooltip
                                content={
                                  <ChartTooltipContent formatter={(value, name) => [`${value}`, 'Commits']} />
                                }
                              />
                              <Legend />
                              <Bar dataKey="commits" fill="#8b5cf6" name="Commits" />
                            </RechartsBarChart>
                          </ChartContainer>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          File Modifications
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-80">
                          <ChartContainer
                            config={{
                              value: { color: "#8b5cf6" }
                            }}
                          >
                            <PieChart>
                              <Pie
                                data={fileModifications}
                                cx="50%"
                                cy="50%"
                                labelLine={true}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                              >
                                {fileModifications.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <ChartTooltip
                                content={
                                  <ChartTooltipContent formatter={(value, name) => [`${value}`, 'Modifications']} />
                                }
                              />
                              <Legend />
                            </PieChart>
                          </ChartContainer>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="lg:col-span-2">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Activity className="h-4 w-4" />
                          Contribution Timeline
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-40">
                          <ChartContainer
                            config={{
                              reviews: { color: "#8b5cf6" },
                              discussions: { color: "#06b6d4" }
                            }}
                          >
                            <LineChart
                              data={collaboration}
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
                              <Line type="monotone" dataKey="reviews" stroke="#8b5cf6" activeDot={{ r: 8 }} name="Code Reviews" />
                              <Line type="monotone" dataKey="discussions" stroke="#06b6d4" activeDot={{ r: 8 }} name="Discussions" />
                            </LineChart>
                          </ChartContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>
                
                <TabsContent value="commits">
                  <motion.div
                    key="commits"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <GitCommit className="h-4 w-4" />
                          Commit Types Distribution
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-80">
                          <ChartContainer
                            config={{
                              count: { color: "#8b5cf6" }
                            }}
                          >
                            <RechartsBarChart
                              data={commitTypes}
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
                    key="patterns"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Daily Activity Pattern
                        </CardTitle>
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
                
                <TabsContent value="quality">
                  <motion.div
                    key="quality"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BarChart className="h-4 w-4" />
                          Code Quality Metrics
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-80">
                          <ChartContainer
                            config={{
                              value: { color: "#8b5cf6" }
                            }}
                          >
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={codeQuality}>
                              <PolarGrid />
                              <PolarAngleAxis dataKey="metric" />
                              <PolarRadiusAxis angle={30} domain={[0, 100]} />
                              <Radar name="Code Quality" dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                              <ChartTooltip
                                content={
                                  <ChartTooltipContent formatter={(value, name) => [`${value}%`, name]} />
                                }
                              />
                              <Legend />
                            </RadarChart>
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
