
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { updateRepository, Repository } from "@/services/repositoryData";

const formSchema = z.object({
  name: z.string().min(3, { message: "Repository name must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  projectId: z.string().optional(),
  author: z.string().optional(),
  email: z.string().email({ message: "Please enter a valid email" }).optional().or(z.string().length(0)),
  gitlabUser: z.string().optional(),
  commitCount: z.coerce.number().int().nonnegative().optional(),
  operations: z.coerce.number().int().nonnegative().optional(),
  additions: z.coerce.number().int().nonnegative().optional(),
  deletions: z.coerce.number().int().nonnegative().optional(),
  weekOfPrediction: z.string().optional(),
  finalGradePrediction: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface EditRepositoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  repository: Repository;
  onRepositoryUpdated: (updatedRepo: Repository) => void;
}

export function EditRepositoryDialog({
  open,
  onOpenChange,
  repository,
  onRepositoryUpdated
}: EditRepositoryDialogProps) {
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: repository.name,
      description: repository.description,
      projectId: repository.projectId || '',
      author: repository.author || '',
      email: repository.email || '',
      gitlabUser: repository.gitlabUser || '',
      commitCount: repository.commitCount || 0,
      operations: repository.operations || 0,
      additions: repository.additions || 0,
      deletions: repository.deletions || 0,
      weekOfPrediction: repository.weekOfPrediction || '',
      finalGradePrediction: repository.finalGradePrediction || '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (!repository.id) {
      toast.error("Cannot update repository", {
        description: "Repository ID is missing."
      });
      return;
    }

    setIsSaving(true);
    
    try {
      const updatedRepo = updateRepository(repository.id, {
        name: values.name,
        description: values.description,
        projectId: values.projectId,
        author: values.author,
        email: values.email,
        gitlabUser: values.gitlabUser,
        commitCount: values.commitCount,
        operations: values.operations,
        additions: values.additions,
        deletions: values.deletions,
        weekOfPrediction: values.weekOfPrediction,
        finalGradePrediction: values.finalGradePrediction,
      });
      
      if (updatedRepo) {
        toast.success("Repository updated", {
          description: `"${values.name}" has been updated successfully.`
        });
        onRepositoryUpdated(updatedRepo);
      } else {
        toast.error("Failed to update repository", {
          description: "The repository could not be found."
        });
      }
    } catch (error) {
      console.error("Error updating repository:", error);
      toast.error("Failed to update repository", {
        description: "An unexpected error occurred. Please try again."
      });
    } finally {
      setIsSaving(false);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Repository</DialogTitle>
          <DialogDescription>
            Update the details of your repository.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Repository Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="projectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project ID</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      className="resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Author</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="gitlabUser"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GitLab Username</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="commitCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Commit Count</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="additions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additions</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="deletions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deletions</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="operations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Operations</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="weekOfPrediction"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Week of Prediction</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="finalGradePrediction"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Final Grade Prediction</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="pt-4">
              <Button 
                variant="outline" 
                type="button" 
                onClick={() => onOpenChange(false)}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
