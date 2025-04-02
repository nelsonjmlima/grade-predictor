
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GitBranch, Link, Key, User, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { addRepository } from "@/services/repositoryData";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  name: z.string().min(3, {
    message: "Repository name must be at least 3 characters"
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters"
  }),
  projectId: z.string().optional(),
  students: z.string().optional(),
  link: z.string().url({
    message: "Please enter a valid URL"
  }).optional().or(z.literal("")),
  apiKey: z.string().optional(),
  userId: z.string().optional()
});

type FormValues = z.infer<typeof formSchema>;

export default function AddRepositoryPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      projectId: "",
      students: "",
      link: "",
      apiKey: "",
      userId: ""
    }
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const repoId = values.name.toLowerCase().replace(/\s+/g, '-');
      
      const newRepo = {
        id: repoId,
        name: values.name,
        description: values.description,
        lastActivity: "Just now",
        commitCount: 0,
        mergeRequestCount: 0,
        branchCount: 1,
        progress: 0,
        createdAt: new Date().toISOString(),
        projectId: values.projectId || undefined,
        link: values.link || undefined,
        apiKey: values.apiKey || undefined,
        userId: values.userId || undefined,
        students: values.students || undefined,
        storagePath: `repositories/${repoId}`
      };

      toast.loading("Creating repository...");
      await addRepository(newRepo as any);

      toast.success("Repository created successfully", {
        description: `${values.name} has been created and is ready to use.`
      });

      navigate("/repositories");
    } catch (error) {
      console.error("Error creating repository:", error);
      toast.error("Failed to create repository", {
        description: "An error occurred while creating the repository. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return <div className="min-h-screen bg-background p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="icon" className="rounded-full" onClick={() => navigate("/repositories")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-semibold tracking-tight">Add Repository</h1>
        </div>
        
        <Card className="border shadow-md">
          <CardHeader>
            <CardTitle>Repository Details</CardTitle>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-6">
                <FormField control={form.control} name="name" render={({
                field
              }) => <FormItem>
                      <FormLabel>Repository Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Software Engineering 2023" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />

                <FormField control={form.control} name="description" render={({
                field
              }) => <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Brief description of this repository's purpose" className="resize-none min-h-16" {...field} />
                      </FormControl>
                      <p className="text-sm text-muted-foreground">Description must be at least 10 characters</p>
                    </FormItem>} />

                <FormField control={form.control} name="link" render={({
                field
              }) => <FormItem>
                      <FormLabel>Repository Link <span className="text-sm text-muted-foreground">(optional)</span></FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <Link className="h-4 w-4 text-muted-foreground" />
                          <Input placeholder="https://github.com/username/repository" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />

                <FormField control={form.control} name="apiKey" render={({
                field
              }) => <FormItem>
                      <FormLabel>API Key <span className="text-sm text-muted-foreground">(optional)</span></FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <Key className="h-4 w-4 text-muted-foreground" />
                          <Input placeholder="Enter repository API key" type="password" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />

                <FormField control={form.control} name="projectId" render={({
                field
              }) => <FormItem>
                      <FormLabel>Project ID <span className="text-sm text-muted-foreground">(optional)</span></FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <GitBranch className="h-4 w-4 text-muted-foreground" />
                          <Input placeholder="Enter Project ID" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />

                <FormField control={form.control} name="userId" render={({
                field
              }) => <FormItem>
                      <FormLabel>User ID <span className="text-sm text-muted-foreground">(optional)</span></FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <Input placeholder="Enter user ID" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />

                <FormField control={form.control} name="students" render={({
                field
              }) => <FormItem>
                      <FormLabel>Student Email Addresses <span className="text-sm text-muted-foreground">(optional)</span></FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter student email addresses, one per line" className="resize-none h-24" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />
              </CardContent>
              <CardFooter className="flex justify-end space-x-4 pt-6">
                <Button variant="outline" type="button" onClick={() => navigate("/repositories")} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Save Repository"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </div>;
}
