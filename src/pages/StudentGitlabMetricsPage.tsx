
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SideNav } from "@/components/dashboard/SideNav";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  BarChart, 
  Bar 
} from "recharts";
import { 
  ArrowLeft, 
  GitBranch, 
  GitCommit, 
  GitMerge, 
  GitPullRequest, 
  Code, 
  User,
  Calendar,
  Clock
} from "lucide-react";
import { motion } from "framer-motion";
import { allRepositories, sampleStudents, programmingStudents } from "@/services/repositoryData";

export default function StudentGitlabMetricsPage() {
  const { id, studentId } = useParams();
  const navigate = useNavigate();
  const [repository, setRepository] = useState<any>(null);
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimespan, setSelectedTimespan] = useState("month");

  // Mock GitLab data
  const gitlabMetrics = {
    commits: [
      { date: "2023-09-01", count: 5 },
      { date: "2023-09-08", count: 3 },
      { date: "2023-09-15", count: 7 },
      { date: "2023-09-22", count: 2 },
      { date: "2023-09-29", count: 8 },
      { date: "2023-10-06", count: 4 }
    ],
    mergeRequests: [
      { date: "2023-09-05", count: 1, status: "merged" },
      { date: "2023-09-12", count: 2, status: "merged" },
      { date: "2023-09-19", count: 1, status: "closed" },
      { date: "2023-09-26", count: 3, status: "merged" },
      { date: "2023-10-03", count: 1, status: "opened" }
    ],
    codeAdditionsDeletions: [
      { date: "2023-09-01", additions: 120, deletions: 45 },
      { date: "2023-09-08", additions: 83, deletions: 21 },
      { date: "2023-09-15", additions: 201, deletions: 67 },
      { date: "2023-09-22", additions: 56, deletions: 34 },
      { date: "2023-09-29", additions: 178, deletions: 52 },
      { date: "2023-10-06", additions: 104, deletions: 39 }
    ],
    branches: [
      { name: "feature/login", commits: 8, lastActive: "2023-09-15" },
      { name: "feature/dashboard", commits: 12, lastActive: "2023-09-22" },
      { name: "bugfix/auth", commits: 5, lastActive: "2023-09-28" },
      { name: "development", commits: 25, lastActive: "2023-10-05" }
    ],
    activityHeatmap: {
      Monday: { "8-12": 5, "12-16": 7, "16-20": 3 },
      Tuesday: { "8-12": 2, "12-16": 8, "16-20": 6 },
      Wednesday: { "8-12": 6, "12-16": 4, "16-20": 5 },
      Thursday: { "8-12": 3, "12-16": 5, "16-20": 7 },
      Friday: { "8-12": 4, "12-16": 6, "16-20": 2 }
    }
  };

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
    navigate(`/repositories/${id}/student/${studentId}`);
  };

  // Debug logs to check data loading
  console.log("Repository:", repository);
  console.log("Student:", student);
  console.log("GitLab metrics:", gitlabMetrics);

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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1 
      } 
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 100
      }
    }
  };

  // Format heatmap data for visualization
  const heatmapData = Object.entries(gitlabMetrics.activityHeatmap).map(([day, timeSlots]) => ({
    day,
    ...timeSlots
  }));

  return (
    <div className="flex h-screen overflow-hidden">
      <SideNav />
      <main className="flex-1 overflow-y-auto p-6 bg-background">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={handleGoBack} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Student Overview
            </Button>
            
            <div className="flex gap-2">
              <Button 
                variant={selectedTimespan === "week" ? "default" : "outline"} 
                size="sm"
                onClick={() => setSelectedTimespan("week")}
              >
                Week
              </Button>
              <Button 
                variant={selectedTimespan === "month" ? "default" : "outline"} 
                size="sm"
                onClick={() => setSelectedTimespan("month")}
              >
                Month
              </Button>
              <Button 
                variant={selectedTimespan === "semester" ? "default" : "outline"} 
                size="sm"
                onClick={() => setSelectedTimespan("semester")}
              >
                Semester
              </Button>
            </div>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center h-[400px]">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : (
            student && repository && (
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-6"
              >
                <motion.div variants={itemVariants}>
                  <div className="flex justify-between items-center">
                    <div>
                      <h1 className="text-2xl font-semibold">{student.name} - GitLab Metrics</h1>
                      <p className="text-muted-foreground">{repository.name}</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-medium flex items-center gap-2">
                        <GitCommit className="h-4 w-4" />
                        Total Commits
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">{gitlabMetrics.commits.reduce((sum, item) => sum + item.count, 0)}</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-medium flex items-center gap-2">
                        <GitPullRequest className="h-4 w-4" />
                        Merge Requests
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">{gitlabMetrics.mergeRequests.length}</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-medium flex items-center gap-2">
                        <GitBranch className="h-4 w-4" />
                        Active Branches
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">{gitlabMetrics.branches.length}</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-medium flex items-center gap-2">
                        <Code className="h-4 w-4" />
                        Lines Changed
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">
                        +{gitlabMetrics.codeAdditionsDeletions.reduce((sum, item) => sum + item.additions, 0)} / 
                        -{gitlabMetrics.codeAdditionsDeletions.reduce((sum, item) => sum + item.deletions, 0)}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Commit Activity</CardTitle>
                      <CardDescription>Number of commits over time</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={gitlabMetrics.commits}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip 
                              formatter={(value) => [`${value} commits`, "Count"]}
                              contentStyle={{ 
                                borderRadius: '8px', 
                                border: 'none', 
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                fontSize: '12px'
                              }} 
                            />
                            <Legend />
                            <Line 
                              type="monotone" 
                              dataKey="count" 
                              stroke="#6366F1" 
                              activeDot={{ r: 8 }}
                              name="Commits"
                              strokeWidth={2}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Code Changes</CardTitle>
                      <CardDescription>Lines added and removed over time</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={gitlabMetrics.codeAdditionsDeletions}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip 
                              contentStyle={{ 
                                borderRadius: '8px', 
                                border: 'none', 
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                fontSize: '12px'
                              }} 
                            />
                            <Legend />
                            <Bar 
                              dataKey="additions" 
                              fill="#10B981" 
                              name="Lines Added"
                              radius={[4, 4, 0, 0]}
                            />
                            <Bar 
                              dataKey="deletions" 
                              fill="#EF4444" 
                              name="Lines Deleted"
                              radius={[4, 4, 0, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
                
                <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Working Hours</CardTitle>
                      <CardDescription>Activity distribution during the week</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={heatmapData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                            <XAxis dataKey="day" />
                            <YAxis />
                            <Tooltip 
                              contentStyle={{ 
                                borderRadius: '8px', 
                                border: 'none', 
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                fontSize: '12px'
                              }} 
                            />
                            <Legend />
                            <Bar 
                              dataKey="8-12" 
                              fill="#6366F1" 
                              name="Morning (8-12)"
                              radius={[4, 4, 0, 0]}
                            />
                            <Bar 
                              dataKey="12-16" 
                              fill="#F59E0B" 
                              name="Afternoon (12-16)"
                              radius={[4, 4, 0, 0]}
                            />
                            <Bar 
                              dataKey="16-20" 
                              fill="#10B981" 
                              name="Evening (16-20)"
                              radius={[4, 4, 0, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Branches</CardTitle>
                      <CardDescription>Active branches and their commit count</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Branch Name</TableHead>
                              <TableHead>Commits</TableHead>
                              <TableHead>Last Activity</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {gitlabMetrics.branches.map((branch, index) => (
                              <motion.tr
                                key={branch.name}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="border-b"
                              >
                                <TableCell className="font-medium">
                                  <div className="flex items-center space-x-2">
                                    <GitBranch className="h-4 w-4 text-muted-foreground" />
                                    <span>{branch.name}</span>
                                  </div>
                                </TableCell>
                                <TableCell>{branch.commits}</TableCell>
                                <TableCell>{branch.lastActive}</TableCell>
                              </motion.tr>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Merge Requests</CardTitle>
                      <CardDescription>History of merge requests</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Date</TableHead>
                              <TableHead>Count</TableHead>
                              <TableHead>Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {gitlabMetrics.mergeRequests.map((mr, index) => (
                              <motion.tr
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="border-b"
                              >
                                <TableCell>{mr.date}</TableCell>
                                <TableCell>{mr.count}</TableCell>
                                <TableCell>
                                  <span className={`px-2 py-1 rounded-full text-xs ${
                                    mr.status === "merged" 
                                      ? "bg-green-100 text-green-800" 
                                      : mr.status === "opened"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-amber-100 text-amber-800"
                                  }`}>
                                    {mr.status.charAt(0).toUpperCase() + mr.status.slice(1)}
                                  </span>
                                </TableCell>
                              </motion.tr>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            )
          )}
        </div>
      </main>
    </div>
  );
}
