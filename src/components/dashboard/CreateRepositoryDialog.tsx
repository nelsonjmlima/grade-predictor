
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GitLabForm } from "@/components/repository/GitLabForm";
import { addRepository } from "@/services/repositoryData";
import { Repository } from "@/services/repositoryData";
import { toast } from "sonner";

interface CreateRepositoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRepositoryCreated: () => void;
}

export function CreateRepositoryDialog({
  open,
  onOpenChange,
  onRepositoryCreated,
}: CreateRepositoryDialogProps) {
  const [repositoryName, setRepositoryName] = useState("");
  const [repositoryDescription, setRepositoryDescription] = useState("");
  const [selectedTab, setSelectedTab] = useState("manual");
  const [selectedStudents, setSelectedStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateRepository = async () => {
    if (!repositoryName.trim()) {
      toast.error("Repository name is required");
      return;
    }

    setIsLoading(true);
    try {
      const newRepo: Repository = {
        name: repositoryName,
        description: repositoryDescription,
        lastActivity: new Date().toISOString(),
        commitCount: Math.floor(Math.random() * 100),
        mergeRequestCount: Math.floor(Math.random() * 20),
        branchCount: Math.floor(Math.random() * 5) + 1,
        progress: Math.floor(Math.random() * 100),
        students: selectedStudents
      };

      await addRepository(newRepo);
      
      toast.success("Repository created successfully", {
        description: `${repositoryName} has been created with ${selectedStudents.length} selected students.`,
      });
      
      // Reset form
      setRepositoryName("");
      setRepositoryDescription("");
      setSelectedStudents([]);
      
      // Close dialog and notify parent
      onOpenChange(false);
      onRepositoryCreated();
    } catch (error) {
      console.error("Error creating repository:", error);
      toast.error("Failed to create repository");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGitLabSuccess = async (data: any) => {
    try {
      setIsLoading(true);
      const newRepo: Repository = {
        name: data.projectName,
        description: `GitLab project #${data.projectId}`,
        lastActivity: new Date().toISOString(),
        commitCount: Math.floor(Math.random() * 100),
        mergeRequestCount: Math.floor(Math.random() * 20),
        branchCount: Math.floor(Math.random() * 5) + 1,
        progress: Math.floor(Math.random() * 100),
        link: data.projectUrl,
        projectId: String(data.projectId),
        students: data.members.map(member => ({
          id: String(member.id),
          name: member.name,
          email: `${member.username}@example.com`,
          gitlabUsername: member.username,
          commitCount: Math.floor(Math.random() * 50),
          lastActivity: new Date().toISOString()
        }))
      };

      await addRepository(newRepo);
      
      toast.success("Repository created successfully", {
        description: `${data.projectName} has been created with ${data.members.length} GitLab members.`,
      });
      
      onOpenChange(false);
      onRepositoryCreated();
    } catch (error) {
      console.error("Error creating repository from GitLab:", error);
      toast.error("Failed to create repository");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add new repository</DialogTitle>
          <DialogDescription>
            Create a new repository or connect to an existing one
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
            <TabsTrigger value="gitlab">GitLab Connect</TabsTrigger>
          </TabsList>
          
          <TabsContent value="manual" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Repository Name</Label>
                <Input
                  id="name"
                  placeholder="Enter repository name"
                  value={repositoryName}
                  onChange={(e) => setRepositoryName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter repository description"
                  value={repositoryDescription}
                  onChange={(e) => setRepositoryDescription(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                onClick={handleCreateRepository} 
                disabled={isLoading || !repositoryName.trim()}
              >
                {isLoading ? "Creating..." : "Create Repository"}
              </Button>
            </DialogFooter>
          </TabsContent>
          
          <TabsContent value="gitlab">
            <GitLabForm onSuccess={handleGitLabSuccess} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
