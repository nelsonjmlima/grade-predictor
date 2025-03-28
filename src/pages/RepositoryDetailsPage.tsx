
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SideNav } from "@/components/dashboard/SideNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, GitCommit, GitBranch, GitMerge, Users, Activity } from "lucide-react";
import { RepositoryGradesView } from "@/components/dashboard/RepositoryGradesView";
import { allRepositories, sampleStudents, programmingStudents } from "@/services/repositoryData";

export default function RepositoryDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [repository, setRepository] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      // Find repository by id
      const foundRepo = allRepositories.find(repo => repo.id === id);
      if (foundRepo) {
        setRepository(foundRepo);
      }
      setLoading(false);
    }
  }, [id]);

  const handleGoBack = () => {
    navigate(-1);
  };

  // If repository not found
  if (!loading && !repository) {
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
              <h2 className="text-2xl font-semibold mb-2">Repository not found</h2>
              <p className="text-muted-foreground">The requested repository does not exist or has been removed.</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const students = id === 'programming-fundamentals' ? programmingStudents : sampleStudents;

  return (
    <div className="flex h-screen overflow-hidden">
      <SideNav />
      <main className="flex-1 overflow-y-auto p-6 bg-background">
        <div className="max-w-6xl mx-auto space-y-6">
          <Button variant="outline" onClick={handleGoBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          
          {repository && (
            <>
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-semibold">{repository.name}</h1>
                  <p className="text-muted-foreground">{repository.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" className="gap-2">
                    <GitBranch className="h-4 w-4" />
                    Branches
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Users className="h-4 w-4" />
                    Collaborators
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
                    <p className="text-2xl font-bold">{repository.commitCount}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                      <GitMerge className="h-4 w-4" />
                      Merge Requests
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{repository.mergeRequestCount}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                      <GitBranch className="h-4 w-4" />
                      Branches
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{repository.branchCount}</p>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Project Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span className="font-medium">{repository.progress}%</span>
                    </div>
                    <Progress value={repository.progress} className="h-2" />
                    <p className="text-sm text-muted-foreground pt-2">
                      Last updated: {repository.lastActivity}
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Tabs defaultValue="students" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="students">Students</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>
                
                <TabsContent value="students">
                  <RepositoryGradesView 
                    repositoryName={repository.name} 
                    students={students} 
                  />
                </TabsContent>
                
                <TabsContent value="activity">
                  <Card>
                    <CardContent className="p-6">
                      <p className="text-center py-8 text-muted-foreground">
                        Activity data will be displayed here.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="analytics">
                  <Card>
                    <CardContent className="p-6">
                      <p className="text-center py-8 text-muted-foreground">
                        Analytics data will be displayed here.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
