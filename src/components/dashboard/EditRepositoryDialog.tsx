
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { updateRepository, Repository } from "@/services/repositoryData";
import { Student } from "@/services/studentData";

const formSchema = z.object({
  name: z.string().min(3, { message: "Repository name must be at least 3 characters" }),
  projectId: z.string().optional(),
  id: z.string().min(1, { message: "ID is required" }),
  studentsCount: z.coerce.number().int().nonnegative(),
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
  
  // Calculate students count safely
  const studentsCount = Array.isArray(repository.students) 
    ? repository.students.length 
    : (typeof repository.students === 'string' 
      ? repository.students.split('\n').filter(email => email.trim()).length 
      : 0);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: repository.name,
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
      // Create or update students array based on the existing type
      let updatedStudents: Student[] = [];
      
      // If students is already an array, use it directly
      if (Array.isArray(repository.students)) {
        updatedStudents = [...repository.students];
      }
      // If students is a string, convert it to an empty array (this shouldn't happen in normal flow)
      else if (typeof repository.students === 'string') {
        updatedStudents = [];
      }
      
      const currentCount = updatedStudents.length;
      const targetCount = values.studentsCount;
      
      // If the studentsCount has increased, add dummy students
      if (targetCount > currentCount) {
        for (let i = currentCount; i < targetCount; i++) {
          updatedStudents.push({
            id: `student-${Math.random().toString(36).substr(2, 9)}`,
            name: `Student ${i + 1}`,
            email: `student${i + 1}@example.com`,
            commitCount: 0,
            lastActivity: 'Never'
          });
        }
      } 
      // If the studentsCount has decreased, remove excess students
      else if (targetCount < currentCount) {
        updatedStudents = updatedStudents.slice(0, targetCount);
      }
      
      const updatedRepo = updateRepository(repository.id, {
        name: values.name,
        description: repository.description, // Keep the existing description
        projectId: values.projectId,
        id: values.id, // Now we update the ID field
        students: updatedStudents, // Update the students array based on new count
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
                    <Input {...field} />
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
                    <Input type="number" min="0" {...field} />
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
