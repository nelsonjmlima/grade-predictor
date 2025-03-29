
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
