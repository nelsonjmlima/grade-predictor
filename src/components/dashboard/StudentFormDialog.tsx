
import { useState } from "react";
import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Student } from "@/services/repositoryData";
import { getStudentData } from "@/services/studentData";

// Define the form schema
const studentFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email" }),
  commitCount: z.coerce.number().int().min(0),
  lastActivity: z.string(),
  grade: z.string().optional(),
});

type StudentFormValues = z.infer<typeof studentFormSchema>;

interface StudentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStudentSaved: (student: Student) => void;
  initialStudent?: Student;
  repositoryId: string;
}

export function StudentFormDialog({
  open,
  onOpenChange,
  onStudentSaved,
  initialStudent,
  repositoryId
}: StudentFormDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  // Set up form with default values
  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: initialStudent || {
      id: `student-${Date.now()}`,
      name: "",
      email: "",
      commitCount: 0,
      lastActivity: "Today",
      grade: "",
    },
  });

  const onSubmit = async (values: StudentFormValues) => {
    setIsLoading(true);
    
    try {
      // In a real application, this would make an API call
      // For now, we'll simulate a successful save
      const studentData = await getStudentData();
      
      // Create the new student by combining form values with default student data
      const newStudent: Student = {
        ...values as Student,
        // Add any missing required fields
        id: values.id || `student-${Date.now()}`,
        grade: values.grade || undefined,
      };
      
      onStudentSaved(newStudent);
      onOpenChange(false);
      toast.success("Student data saved successfully");
    } catch (error) {
      console.error("Error saving student data:", error);
      toast.error("Failed to save student data");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{initialStudent ? "Edit Student" : "Add New Student"}</DialogTitle>
          <DialogDescription>
            {initialStudent ? "Update the student information below." : "Fill in the student details to add them to this repository."}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
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
                    <Input placeholder="john.doe@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="commitCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Commit Count</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="grade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grade (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="A, B+, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="lastActivity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Activity</FormLabel>
                  <FormControl>
                    <Input placeholder="Today, Yesterday, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="pt-4">
              <Button variant="outline" type="button" onClick={() => onOpenChange(false)} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Student"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
