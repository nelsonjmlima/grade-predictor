
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SideNav } from "@/components/dashboard/SideNav";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { GitLabForm } from "@/components/repository/GitLabForm";
import { StudentIdManager } from "@/components/repository/StudentIdManager";
import { addRepository } from "@/services/repositoryData";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AddRepositoryPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<"gitlab" | "details">("gitlab");
  
  const [repositoryData, setRepositoryData] = useState({
    projectId: 0,
    projectName: "",
    projectUrl: "",
    members: [] as Array<{
      id: number;
      name: string;
      username: string;
      selected?: boolean;
    }>,
  });

  const handleGitLabSuccess = (data: {
    projectId: number;
    projectName: string;
    projectUrl: string;
    members: Array<{
      id: number;
      name: string;
      username: string;
      selected?: boolean;
    }>;
  }) => {
    setRepositoryData({
      ...data,
      members: data.members.map(member => ({...member, selected: true}))
    });
    setStep("details");
  };

  const handleStudentsChange = (students: Array<{
    id: number;
    name: string;
    username: string;
    selected?: boolean;
  }>) => {
    setRepositoryData({
      ...repositoryData,
      members: students,
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Filter only selected students
      const selectedStudents = repositoryData.members.filter(member => member.selected !== false);
      
      const newRepo = {
        id: `gitlab-${repositoryData.projectId}`,
        name: repositoryData.projectName,
        projectId: repositoryData.projectId.toString(),
        description: `GitLab project #${repositoryData.projectId}`,
        lastActivity: "Just now",
        commitCount: 0,
        mergeRequestCount: 0,
        branchCount: 1,
        progress: 0,
        createdAt: new Date().toISOString(),
        link: repositoryData.projectUrl,
        students: selectedStudents.map(member => ({
          id: `student-${member.id}`,
          name: member.name,
          email: `${member.username}@gitlab.com`,
          gitlabUsername: member.username,
          commitCount: 0,
          lastActivity: 'Never'
        })),
      };
      
      addRepository(newRepo as any);
      
      toast.success("Repository created successfully", {
        description: `${repositoryData.projectName} has been created with ${selectedStudents.length} selected students.`,
      });
      
      navigate("/dashboard");
    } catch (error) {
      console.error("Error creating repository:", error);
      toast.error("Failed to create repository", {
        description: "An error occurred while creating the repository. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <SideNav />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-2xl space-y-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate("/dashboard")}
              className="mr-2"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-3xl font-bold">
              {step === "gitlab" ? "Connect GitLab Repository" : "Configure Repository"}
            </h1>
          </div>
          
          {step === "gitlab" ? (
            <GitLabForm onSuccess={handleGitLabSuccess} />
          ) : (
            <div className="space-y-6">
              <Card className="border shadow-md">
                <CardHeader>
                  <CardTitle>GitLab Project Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="projectName">Project Name</Label>
                      <Input id="projectName" value={repositoryData.projectName} readOnly />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="projectId">Project ID</Label>
                      <Input id="projectId" value={repositoryData.projectId} readOnly />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="projectUrl">Project URL</Label>
                    <Input id="projectUrl" value={repositoryData.projectUrl} readOnly />
                  </div>
                </CardContent>
              </Card>
              
              <StudentIdManager 
                initialStudents={repositoryData.members}
                onChange={handleStudentsChange}
              />
              
              <Card>
                <CardFooter className="flex justify-between items-center pt-6">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setStep("gitlab")} 
                    disabled={isSubmitting}
                  >
                    <ArrowLeft className="h-6 w-6" />
                  </Button>
                  <Button 
                    onClick={handleSubmit} 
                    disabled={isSubmitting || repositoryData.members.filter(m => m.selected !== false).length === 0}
                    className="w-full sm:w-auto flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    {isSubmitting ? "Adding..." : "Add Repository"}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
