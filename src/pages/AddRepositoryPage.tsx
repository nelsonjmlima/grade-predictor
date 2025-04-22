
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
// --- Supabase client import ---
import { supabase } from "@/integrations/supabase/client";

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
      
      // First, add to local storage.
      addRepository(newRepo as any);

      // --- Supabase Insert ---
      // Only inserting projectId and projectUrl (url) as per schema.
      // API_Key column is also available but not in use here.
      const { error } = await supabase.from('Repositorio').insert([
        {
          id: repositoryData.projectId, // your table expects bigint, so just use projectId
          URL_Repositorio: repositoryData.projectUrl,
          // API_Key: '' // could be added if you collect it
        }
      ]);
      if (error) {
        console.error("Error writing repository to Supabase:", error);
        toast.error("Saved locally, but failed to save to Supabase", {
          description: "Repository was saved in the app, but not remotely."
        });
      } else {
        toast.success("Repository created successfully", {
          description: `${repositoryData.projectName} has been added to both the app & Supabase with ${selectedStudents.length} students.`
        });
      }
      
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
                <CardFooter className="pt-2">
                  <Button 
                    onClick={handleSubmit} 
                    disabled={isSubmitting || repositoryData.members.filter(m => m.selected !== false).length === 0}
                    className="w-full flex items-center justify-center"
                  >
                    <Plus className="h-4 w-4 mr-1" />
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
