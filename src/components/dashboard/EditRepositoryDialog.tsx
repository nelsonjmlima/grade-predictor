
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
  id: z.string().optional(),
  studentsCount: z.coerce.number().int().nonnegative().optional(),
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
  const studentsCount = repository.students?.length || 0;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: repository.name,
      description: repository.description,
      projectId: repository.projectId || '',
      id: repository.id || '',
      studentsCount: studentsCount,
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
        // We don't update the ID as it's a readonly field
        // We don't update the students count as it's managed elsewhere
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Repository</DialogTitle>
          <DialogDescription>
            Update the details of your repository.
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
                    <Input {...field} />
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

            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID/Group</FormLabel>
                  <FormControl>
                    <Input {...field} readOnly disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="studentsCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Students</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" {...field} readOnly disabled />
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
