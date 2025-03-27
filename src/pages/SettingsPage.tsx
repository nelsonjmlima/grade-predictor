
import { useState } from "react";
import { SideNav } from "@/components/dashboard/SideNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { GitlabIcon, Save, Key, User, Bell, Shield, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSaveGeneral = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Profile updated successfully");
    }, 1000);
  };
  
  const handleSavePassword = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Password updated successfully");
    }, 1000);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <SideNav />
      
      <main className="flex-1 overflow-y-auto">
        <div className="p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight animate-fade-in">Settings</h1>
            <p className="text-muted-foreground animate-fade-in opacity-0" style={{ animationDelay: "100ms" }}>
              Manage your account and application preferences
            </p>
          </div>
          
          <Tabs defaultValue="general" className="w-full animate-fade-in opacity-0" style={{ animationDelay: "200ms" }}>
            <TabsList className="w-full max-w-md grid grid-cols-4 mb-8">
              <TabsTrigger value="general" className="flex gap-2 items-center">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger value="password" className="flex gap-2 items-center">
                <Key className="h-4 w-4" />
                <span className="hidden sm:inline">Password</span>
              </TabsTrigger>
              <TabsTrigger value="integrations" className="flex gap-2 items-center">
                <GitlabIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Integrations</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex gap-2 items-center">
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">Notifications</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your account profile information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First name</Label>
                        <Input id="firstName" defaultValue="Nuno" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last name</Label>
                        <Input id="lastName" defaultValue="Seixas" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email address</Label>
                      <Input id="email" type="email" defaultValue="n.seixas@university.edu" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="institution">Institution</Label>
                      <Input id="institution" defaultValue="University of Technology" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Input id="department" defaultValue="Computer Science" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={handleSaveGeneral} disabled={isLoading}>
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
            </TabsContent>
            
            <TabsContent value="password">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>Update your account password</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current password</Label>
                    <Input id="currentPassword" type="password" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New password</Label>
                    <Input id="newPassword" type="password" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm new password</Label>
                    <Input id="confirmPassword" type="password" />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={handleSavePassword} disabled={isLoading}>
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
              </Card>
            </TabsContent>
            
            <TabsContent value="integrations">
              <Card>
                <CardHeader>
                  <CardTitle>GitLab Integration</CardTitle>
                  <CardDescription>Configure your GitLab account connection</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <GitlabIcon className="h-8 w-8" />
                      <div>
                        <p className="font-medium">GitLab Account</p>
                        <p className="text-sm text-muted-foreground">Connected to gitlab.com/john.smith</p>
                      </div>
                    </div>
                    <Button variant="outline">Disconnect</Button>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="accessToken">GitLab Access Token</Label>
                      <Input id="accessToken" type="password" defaultValue="••••••••••••••••" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="webhookUrl">Webhook URL</Label>
                      <div className="flex">
                        <Input 
                          id="webhookUrl" 
                          defaultValue="https://gradepredictor.com/webhooks/gitlab/123456" 
                          readOnly
                          className="rounded-r-none"
                        />
                        <Button variant="secondary" className="rounded-l-none">
                          Copy
                        </Button>
                      </div>
                    </div>
                  </div>
                  
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
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-3">
                  <Button variant="outline">Test Connection</Button>
                  <Button>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Configure how you want to receive notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
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
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="weeklyReports">Weekly Reports</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive weekly summary of student performance
                        </p>
                      </div>
                      <Switch id="weeklyReports" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="gradeChanges">Grade Prediction Updates</Label>
                        <p className="text-sm text-muted-foreground">
                          Get notified when grade predictions change significantly
                        </p>
                      </div>
                      <Switch id="gradeChanges" defaultChecked />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button>
                    <Save className="mr-2 h-4 w-4" />
                    Save Preferences
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
