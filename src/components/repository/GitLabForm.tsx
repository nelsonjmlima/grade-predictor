
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

  const form = useForm<GitLabFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      link: "",
      token: "",
    },
  });

  const onSubmit = async (values: GitLabFormValues) => {
    setIsLoading(true);
    try {
      const project = await getProjectInfo(values.link, values.token);
      
      if (!project) {
        setIsLoading(false);
        return;
      }
      
      const members = await getProjectMembers(project.id, values.token);
      
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
      
      toast.success("GitLab project information retrieved successfully");
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
                        showPasswordToggle 
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
          <CardFooter className="flex justify-start space-x-4 pt-2"> {/* Changed from justify-end to justify-start */}
            <Button type="submit" disabled={isLoading}>
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
