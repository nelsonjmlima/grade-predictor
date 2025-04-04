
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, Key } from "lucide-react";
import { toast } from "sonner";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { addRepository } from "@/services/repositoryData";

const formSchema = z.object({
  name: z.string().min(3, { message: "Repository name must be at least 3 characters" }),
  link: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
  apiKey: z.string().optional(),
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

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      link: "",
      apiKey: "",
    },
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
      };
      
      addRepository(newRepo as any);
      
      toast.success("Repository created successfully", {
        description: `${values.name} has been created and is ready to use.`,
      });
      
      setIsSubmitting(false);
      form.reset();
      onOpenChange(false);
      
      if (onRepositoryCreated) {
        onRepositoryCreated();
      }
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
