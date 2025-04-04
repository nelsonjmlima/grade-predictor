
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, Key, ArrowLeft, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { addRepository } from "@/services/repositoryData";

const formSchema = z.object({
  name: z.string().min(3, {
    message: "Repository name must be at least 3 characters"
  }),
  link: z.string().url({
    message: "Please enter a valid URL"
  }).optional().or(z.literal("")),
  apiKey: z.string().optional(),
  studentList: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function AddRepositoryPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      link: "",
      apiKey: "",
      studentList: "",
    }
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const newRepo = {
        id: values.name.toLowerCase().replace(/\s+/g, '-'),
        name: values.name,
        description: "",
        lastActivity: "Just now",
        commitCount: 0,
        mergeRequestCount: 0,
        branchCount: 1,
        progress: 0,
        createdAt: new Date().toISOString(),
        link: values.link || undefined,
        apiKey: values.apiKey || undefined,
        students: values.studentList
      };
      
      addRepository(newRepo as any);
      
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

  return (
    <div className="min-h-screen bg-background p-6">
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
                <FormField 
                  control={form.control} 
                  name="name" 
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Repository Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Software Engineering 2023" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} 
                />

                <FormField 
                  control={form.control} 
                  name="link" 
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Repository Link</FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <Link className="h-4 w-4 text-muted-foreground" />
                          <Input placeholder="https://github.com/username/repository" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} 
                />

                <FormField 
                  control={form.control} 
                  name="apiKey" 
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>API Key</FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <Key className="h-4 w-4 text-muted-foreground" />
                          <Input placeholder="Enter repository API key" type="password" showPasswordToggle {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} 
                />
                
                <FormField 
                  control={form.control} 
                  name="studentList" 
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Student List</FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <Textarea 
                            placeholder="Enter student emails, one per line"
                            className="min-h-[120px]"
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Enter student email addresses, one per line. These will be added as students in the repository.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )} 
                />
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
    </div>
  );
}
