
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookOpen, Users, GitBranch, Link, Key, User, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

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

export default function AddRepositoryPage() {
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
    
    // Simulate API call with a timeout
    setTimeout(() => {
      console.log("Creating repository with values:", values);
      
      setIsSubmitting(false);
      form.reset();
      
      toast.success("Repository created successfully!");
      navigate("/repositories");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full"
            onClick={() => navigate("/repositories")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-semibold tracking-tight">Add New Repository</h1>
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
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Brief description of this repository's purpose" 
                          className="resize-none min-h-24" 
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
                          <Input placeholder="Enter repository API key" type="password" {...field} />
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
                      <FormLabel>User ID</FormLabel>
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
                      <FormLabel>Student Email Addresses (optional)</FormLabel>
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
              </CardContent>
              <CardFooter className="flex justify-end space-x-4 pt-6">
                <Button 
                  variant="outline" 
                  type="button" 
                  onClick={() => navigate("/repositories")}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Repository"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
}
