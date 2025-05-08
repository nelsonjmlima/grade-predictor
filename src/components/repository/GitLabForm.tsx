import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, Key, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { getProjectInfo, getProjectMembers } from "@/services/gitlabService";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const formSchema = z.object({
  link: z.string().url({ message: "Please enter a valid GitLab URL" }),
  token: z.string().min(10, { message: "Please enter a valid GitLab token" }),
});

export type GitLabFormValues = z.infer<typeof formSchema>;

interface GitLabFormProps {
  onSuccess: (data: {
    projectId: number;
    projectName: string;
    projectUrl: string;
    members: Array<{
      id: number;
      name: string;
      username: string;
    }>;
  }) => void;
}

export function GitLabForm({ onSuccess }: GitLabFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const form = useForm<GitLabFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      link: "",
      token: "",
    },
  });

  const onSubmit = async (values: GitLabFormValues) => {
    // Check if user is authenticated
    if (!user) {
      toast.error("You must be logged in to connect to GitLab");
      return;
    }

    setIsLoading(true);
    try {
      const project = await getProjectInfo(values.link, values.token);
      
      if (!project) {
        setIsLoading(false);
        return;
      }
      
      const members = await getProjectMembers(project.id, values.token);

      // Create repository entry
      try {
        const { data: repositoryData, error: repositoryError } = await supabase
          .from('repositories')
          .insert([{
            project_id: project.id.toString(),
            name: project.name,
            link: project.web_url,
            user_id: user.id
          }])
          .select();

        if (repositoryError) {
          console.error("Error saving GitLab repository to Supabase:", repositoryError);
          toast.error("Failed to save repository information");
          setIsLoading(false);
          return;
        }

        const repositoryId = repositoryData[0].id;

        // Insert students/members as needed
        if (members && members.length > 0) {
          const studentInserts = members.map(member => ({
            repository_id: repositoryId,
            name: member.name || member.username,
            email: `${member.username}@example.com`, // Placeholder email
            gitlab_username: member.username,
            gitlab_member_id: member.id
          }));

          const { error: studentsError } = await supabase
            .from('students')
            .insert(studentInserts);

          if (studentsError) {
            console.error("Error saving GitLab members as students:", studentsError);
            // Continue anyway but log the error
          }
        }

        toast.success("Repository connected successfully");
      } catch (error) {
        console.error("Error saving to repositories table:", error);
        toast.error("Failed to save repository information");
      }
      
      onSuccess({
        projectId: project.id,
        projectName: project.name,
        projectUrl: project.web_url,
        members: members.map(member => ({
          id: member.id,
          name: member.name,
          username: member.username,
        })),
      });
    } catch (error) {
      console.error("Error in GitLab form:", error);
      toast.error("Failed to connect to GitLab");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border shadow-md">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6 pt-6">
            <FormField 
              control={form.control} 
              name="link" 
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GitLab Project URL</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <Link className="h-4 w-4 text-muted-foreground" />
                      <Input placeholder="https://gitlab.com/username/repository" {...field} />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Enter the full URL to your GitLab repository
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )} 
            />

            <FormField 
              control={form.control} 
              name="token" 
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GitLab Token</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <Key className="h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Enter GitLab token" 
                        type="password"
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Enter your GitLab personal access token with API access
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )} 
            />
          </CardContent>
          <CardFooter className="pt-2">
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || !user}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                "Connect to GitLab"
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
