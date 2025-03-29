
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookOpen, Users, GitBranch, Link, Key, User } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addRepository } from "@/services/repositoryData";

const formSchema = z.object({
  name: z.string().min(3, { message: "Repository name must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  type: z.enum(["course", "project", "thesis"], { required_error: "Please select a repository type" }),
  students: z.string().optional(),
  link: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
  apiKey: z.string().optional(),
  userId: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateRepositoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRepositoryCreated?: () => void;
}

export function CreateRepositoryDialog({ 
  open, 
  onOpenChange, 
  onRepositoryCreated 
}: CreateRepositoryDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      type: undefined,
      students: "",
      link: "",
      apiKey: "",
      userId: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // Create a new repository object
      const newRepo = {
        id: values.name.toLowerCase().replace(/\s+/g, '-'),
        name: values.name,
        description: values.description,
        lastActivity: "Just now",
        commitCount: 0,
        mergeRequestCount: 0,
        branchCount: 1,
        progress: 0,
      };
      
      // Add repository to our store
      addRepository(newRepo);
      
      console.log("Creating repository with values:", values);
      console.log("New repository created:", newRepo);
      
      // Show success notification
      toast.success("Repository created successfully", {
        description: `${values.name} has been created and is ready to use.`,
      });
      
      setIsSubmitting(false);
      form.reset();
      onOpenChange(false);
      
      if (onRepositoryCreated) {
        onRepositoryCreated();
      }
      
      // Navigate to repositories page to see the new repository
      navigate("/repositories");
    } catch (error) {
      console.error("Error creating repository:", error);
      toast.error("Failed to create repository", {
        description: "An error occurred while creating the repository. Please try again.",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Repository</DialogTitle>
          <DialogDescription>
            Set up a new repository to track student progress and performance.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Brief description of this repository's purpose" 
                      className="resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Repository Type</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select repository type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="course">
                        <div className="flex items-center">
                          <BookOpen className="h-4 w-4 mr-2" />
                          <span>Course</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="project">
                        <div className="flex items-center">
                          <GitBranch className="h-4 w-4 mr-2" />
                          <span>Project</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="thesis">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2" />
                          <span>Thesis</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Repository Link <span className="text-sm text-muted-foreground">(optional)</span></FormLabel>
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
                  <FormLabel>API Key <span className="text-sm text-muted-foreground">(optional)</span></FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <Key className="h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Enter repository API key" 
                        type="password"
                        showPasswordToggle 
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User ID <span className="text-sm text-muted-foreground">(optional)</span></FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Enter user ID" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="students"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Student Email Addresses <span className="text-sm text-muted-foreground">(optional)</span></FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter student email addresses, one per line" 
                      className="resize-none h-24" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button 
                variant="outline" 
                type="button" 
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Repository"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
