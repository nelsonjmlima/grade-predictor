
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight, Home, GitBranch, LogOut, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuth } from "@/contexts/AuthContext";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  to: string;
  active?: boolean;
  collapsed?: boolean;
  onClick?: () => void;
}

function NavItem({
  icon: Icon,
  label,
  to,
  active,
  collapsed,
  onClick
}: NavItemProps) {
  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        <Link 
          to={to} 
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 group hover:bg-primary/10",
            active && "bg-primary/10 text-primary font-medium"
          )}
          onClick={onClick}
        >
          <Icon className={cn("h-5 w-5", active ? "text-primary" : "text-muted-foreground")} />
          {!collapsed && (
            <span className={cn("text-sm transition-opacity duration-200", collapsed ? "opacity-0 w-0" : "opacity-100")}>
              {label}
            </span>
          )}
        </Link>
      </TooltipTrigger>
      {collapsed && <TooltipContent side="right">{label}</TooltipContent>}
    </Tooltip>
  );
}

export function SideNav() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [showSignOutDialog, setShowSignOutDialog] = useState(false);
  const navigate = useNavigate();
  const { signOut, user } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      // Close the dialog first
      setShowSignOutDialog(false);
      // Navigate to the index page after successful sign out
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const userEmail = user?.email || "user@example.com";
  const userName = user?.user_metadata?.name || userEmail.split('@')[0] || "User";
  const userInitials = userName.slice(0, 2).toUpperCase();

  return (
    <div className={cn("flex flex-col h-screen bg-card border-r border-border transition-all duration-300 ease-in-out", collapsed ? "w-[52px]" : "w-[157px]")}>
      <div className="p-4 flex items-center justify-between border-b border-border">
        <div className="flex items-center gap-2 overflow-hidden">
          {!collapsed && <span className="font-semibold truncate animate-fade-in text-base">Grade Predictor</span>}
        </div>
      </div>
      
      <div className="flex-1 py-6 overflow-y-auto scrollbar-none">
        <nav className="space-y-2 px-2">
          <NavItem 
            icon={Home} 
            label="Dashboard" 
            to="/dashboard" 
            active={activeItem === "Dashboard"} 
            collapsed={collapsed} 
            onClick={() => setActiveItem("Dashboard")} 
          />
          <NavItem 
            icon={GitBranch} 
            label="Repositories" 
            to="/repositories" 
            active={activeItem === "Repositories"} 
            collapsed={collapsed} 
            onClick={() => setActiveItem("Repositories")} 
          />
          <NavItem 
            icon={Lock} 
            label="Password" 
            to="/password" 
            active={activeItem === "Password"} 
            collapsed={collapsed} 
            onClick={() => setActiveItem("Password")} 
          />
        </nav>
      </div>
      
      <div className="p-3 border-t border-border mt-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback>{userInitials}</AvatarFallback>
            </Avatar>
            {!collapsed && <span className="text-sm font-medium truncate">{userName}</span>}
          </div>
          <div className="flex items-center gap-2">
            {!collapsed && <span className="text-sm text-muted-foreground">Sign Out</span>}
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full h-8 w-8" 
              onClick={() => setShowSignOutDialog(true)}
            >
              <LogOut className="h-4 w-4 text-muted-foreground" />
              <span className="sr-only">Sign Out</span>
            </Button>
          </div>
        </div>
      </div>

      <AlertDialog open={showSignOutDialog} onOpenChange={setShowSignOutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign Out</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to sign out of your account?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSignOut}>Sign Out</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
