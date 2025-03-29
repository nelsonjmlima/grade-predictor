
import { useState } from "react";
import { SideNav } from "@/components/dashboard/SideNav";
import {
  User,
  Key,
  GitlabIcon,
  Bell,
  RefreshCw,
  Save,
  Shield,
  CheckCircle2,
  Briefcase,
  Building,
  AtSign,
  LockKeyhole,
  HelpCircle,
  AlertTriangle
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// Password schema
const passwordSchema = z.object({
  currentPassword: z.string().min(1, { message: "Current password is required" }),
  newPassword: z.string().min(8, { message: "New password must be at least 8 characters" }),
  confirmPassword: z.string().min(1, { message: "Confirm password is required" }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { updatePassword } = useAuth();
  
  const handleSaveGeneral = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Profile updated successfully");
    }, 1000);
  };
  
  // Password form
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  
  const handleSavePassword = async (data: PasswordFormValues) => {
    setIsLoading(true);
    
    try {
      // Call the updatePassword function from AuthContext
      const { error } = await updatePassword(data.newPassword);
      
      if (error) {
        console.error("Password update error:", error);
        toast.error(error.message || "Failed to update password");
        passwordForm.setError("root", { 
          message: error.message || "Failed to update password" 
        });
      } else {
        toast.success("Password updated successfully");
        passwordForm.reset();
      }
    } catch (err) {
      console.error("Password update exception:", err);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveIntegrations = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Integration settings saved successfully");
    }, 1000);
  };
  
  const handleSaveNotifications = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Notification preferences saved successfully");
    }, 1000);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <SideNav />
      
      <main className="flex-1 overflow-y-auto">
        <div className="container py-6 max-w-5xl animate-fade-in">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground mt-1">
              Manage your account and application preferences
            </p>
          </div>
          
          <Tabs defaultValue="general" className="w-full space-y-6">
            <div className="bg-background sticky top-0 z-10 pb-4 pt-1">
              <TabsList className="w-full grid grid-cols-4 md:w-auto md:inline-flex">
                <TabsTrigger value="general">
                  <User className="h-4 w-4 mr-2 md:mr-1" />
                  <span>Profile</span>
                </TabsTrigger>
                <TabsTrigger value="password">
                  <Key className="h-4 w-4 mr-2 md:mr-1" />
                  <span>Password</span>
                </TabsTrigger>
                <TabsTrigger value="integrations">
                  <GitlabIcon className="h-4 w-4 mr-2 md:mr-1" />
                  <span>Integrations</span>
                </TabsTrigger>
                <TabsTrigger value="notifications">
                  <Bell className="h-4 w-4 mr-2 md:mr-1" />
                  <span>Notifications</span>
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="general">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <User className="h-5 w-5 mr-2" />
                        Personal Information
                      </CardTitle>
                      <CardDescription>Update your basic profile details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName" className="flex items-center gap-1">
                            First name
                          </Label>
                          <Input id="firstName" defaultValue="Nuno" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName" className="flex items-center gap-1">
                            Last name
                          </Label>
                          <Input id="lastName" defaultValue="Seixas" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email" className="flex items-center gap-1">
                          <AtSign className="h-4 w-4" />
                          Email address
                        </Label>
                        <Input id="email" type="email" defaultValue="n.seixas@university.edu" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Building className="h-5 w-5 mr-2" />
                        Institution Details
                      </CardTitle>
                      <CardDescription>Manage your institution information</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="institution" className="flex items-center gap-1">
                          <Briefcase className="h-4 w-4" />
                          Institution
                        </Label>
                        <Input id="institution" defaultValue="University of Technology" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="department" className="flex items-center gap-1">
                          Institution Department
                        </Label>
                        <Input id="department" defaultValue="Computer Science" />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button onClick={handleSaveGeneral} disabled={isLoading} className="ml-auto">
                        {isLoading ? (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
                
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <HelpCircle className="h-5 w-5 mr-2" />
                        Account Status
                      </CardTitle>
                      <CardDescription>View your current account details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">Account Type</div>
                        <div className="font-medium flex items-center">
                          Professor
                          <Badge className="ml-2 bg-primary">Active</Badge>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">Member Since</div>
                        <div className="font-medium">October 15, 2023</div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">Last Login</div>
                        <div className="font-medium">Today at 9:42 AM</div>
                      </div>
                      
                      <div className="rounded-lg bg-muted p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                            <div className="font-medium">Email Verified</div>
                          </div>
                          <Badge variant="outline" className="bg-green-50">Complete</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        Display Preferences
                      </CardTitle>
                      <CardDescription>Customize your interface settings</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="sidebarCollapsed">Sidebar Default State</Label>
                          <p className="text-sm text-muted-foreground">
                            Start with collapsed sidebar
                          </p>
                        </div>
                        <Switch id="sidebarCollapsed" />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="compactView">Compact View</Label>
                          <p className="text-sm text-muted-foreground">
                            Show more content with reduced spacing
                          </p>
                        </div>
                        <Switch id="compactView" defaultChecked />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="password">
              <div className="max-w-2xl mx-auto">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <LockKeyhole className="h-5 w-5 mr-2" />
                      Change Password
                    </CardTitle>
                    <CardDescription>Update your account password</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Form {...passwordForm}>
                      <form onSubmit={passwordForm.handleSubmit(handleSavePassword)} className="space-y-4">
                        {passwordForm.formState.errors.root && (
                          <div className="p-3 bg-destructive/15 text-destructive rounded-md flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" />
                            <span>{passwordForm.formState.errors.root.message}</span>
                          </div>
                        )}
                        
                        <FormField
                          control={passwordForm.control}
                          name="currentPassword"
                          render={({ field }) => (
                            <FormItem className="space-y-2">
                              <FormLabel 
                                className="flex items-center gap-1"
                              >
                                Current password
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="w-80">Enter your current password to authorize the change</p>
                                  </TooltipContent>
                                </Tooltip>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="password"
                                  placeholder="••••••••"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Separator />
                        
                        <FormField
                          control={passwordForm.control}
                          name="newPassword"
                          render={({ field }) => (
                            <FormItem className="space-y-2">
                              <FormLabel>New password</FormLabel>
                              <FormControl>
                                <Input
                                  type="password"
                                  placeholder="••••••••"
                                  {...field}
                                />
                              </FormControl>
                              <p className="text-sm text-muted-foreground">
                                Password must be at least 8 characters and include a number and special character
                              </p>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={passwordForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem className="space-y-2">
                              <FormLabel>Confirm new password</FormLabel>
                              <FormControl>
                                <Input
                                  type="password"
                                  placeholder="••••••••"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <CardFooter className="flex justify-end px-0 pt-4">
                          <Button 
                            variant="outline" 
                            className="mr-2"
                            type="button"
                            onClick={() => passwordForm.reset()}
                          >
                            Cancel
                          </Button>
                          <Button 
                            type="submit"
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <>
                                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                Updating...
                              </>
                            ) : (
                              <>
                                <Shield className="mr-2 h-4 w-4" />
                                Update Password
                              </>
                            )}
                          </Button>
                        </CardFooter>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="integrations">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <GitlabIcon className="h-5 w-5 mr-2" />
                    GitLab Integration
                  </CardTitle>
                  <CardDescription>Configure your GitLab account connection</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center p-4 rounded-lg border bg-card">
                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-orange-100 p-2">
                        <GitlabIcon className="h-8 w-8 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">GitLab Account</h3>
                        <p className="text-sm text-muted-foreground">Connected to gitlab.com/john.smith</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="ml-auto bg-green-50 text-green-700 hover:bg-green-100">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Connected
                    </Badge>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="accessToken" className="flex items-center gap-1">
                        <Key className="h-4 w-4" />
                        GitLab Access Token
                      </Label>
                      <Input id="accessToken" type="password" defaultValue="••••••••••••••••" />
                      <p className="text-sm text-muted-foreground">
                        Used to securely access your repositories and commit data
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="webhookUrl">Webhook URL</Label>
                      <div className="flex">
                        <Input 
                          id="webhookUrl" 
                          defaultValue="https://gradepredictor.com/webhooks/gitlab/123456" 
                          readOnly
                          className="rounded-r-none font-mono text-sm"
                        />
                        <Button variant="secondary" className="rounded-l-none">
                          Copy
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Add this URL to your GitLab project's webhooks settings
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4 rounded-lg border p-4">
                    <h3 className="font-medium">Integration Settings</h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="autoSync">Auto-Synchronization</Label>
                          <p className="text-sm text-muted-foreground">
                            Automatically sync repository data every 24 hours
                          </p>
                        </div>
                        <Switch id="autoSync" defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="webhooks">Event Webhooks</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive real-time updates on repository events
                          </p>
                        </div>
                        <Switch id="webhooks" defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="autoAnalyze">Auto-Analysis</Label>
                          <p className="text-sm text-muted-foreground">
                            Automatically analyze new commits when received
                          </p>
                        </div>
                        <Switch id="autoAnalyze" defaultChecked />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-3">
                  <Button variant="outline">Test Connection</Button>
                  <Button onClick={handleSaveIntegrations}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications">
              <div className="max-w-3xl mx-auto">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Bell className="h-5 w-5 mr-2" />
                      Notification Settings
                    </CardTitle>
                    <CardDescription>Configure how you want to receive notifications</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-4">
                        <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                          Delivery Methods
                        </h3>
                        
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label htmlFor="emailNotifications">Email Notifications</Label>
                              <p className="text-sm text-muted-foreground">
                                Receive notifications via email
                              </p>
                            </div>
                            <Switch id="emailNotifications" defaultChecked />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label htmlFor="pushNotifications">Browser Notifications</Label>
                              <p className="text-sm text-muted-foreground">
                                Receive push notifications in browser
                              </p>
                            </div>
                            <Switch id="pushNotifications" defaultChecked />
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                          Summary Reports
                        </h3>
                        
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label htmlFor="dailyReports">Daily Digest</Label>
                              <p className="text-sm text-muted-foreground">
                                Receive daily summary of activities
                              </p>
                            </div>
                            <Switch id="dailyReports" />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label htmlFor="weeklyReports">Weekly Summary</Label>
                              <p className="text-sm text-muted-foreground">
                                Receive weekly summary of student performance
                              </p>
                            </div>
                            <Switch id="weeklyReports" defaultChecked />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                        Notification Types
                      </h3>
                      
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="flex items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <Label htmlFor="commitNotifications">Repository Updates</Label>
                            <p className="text-sm text-muted-foreground">
                              Notifications for new commits and branches
                            </p>
                          </div>
                          <Switch id="commitNotifications" defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <Label htmlFor="gradeChanges">Grade Predictions</Label>
                            <p className="text-sm text-muted-foreground">
                              Notifications for significant grade prediction changes
                            </p>
                          </div>
                          <Switch id="gradeChanges" defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <Label htmlFor="systemNotifications">System Updates</Label>
                            <p className="text-sm text-muted-foreground">
                              Notifications about system maintenance and updates
                            </p>
                          </div>
                          <Switch id="systemNotifications" defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <Label htmlFor="securityAlerts">Security Alerts</Label>
                            <p className="text-sm text-muted-foreground">
                              Notifications about security-related events
                            </p>
                          </div>
                          <Switch id="securityAlerts" defaultChecked />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button onClick={handleSaveNotifications}>
                      <Save className="mr-2 h-4 w-4" />
                      Save Preferences
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
