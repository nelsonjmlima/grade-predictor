
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  LayoutDashboard,
  FolderGit2,
  Settings,
  Lock,
  GitBranch,
  PlusCircle,
  Users
} from 'lucide-react';
import { Logo } from '../logo/Logo';
import { useAuth } from '@/contexts/AuthContext';
import { useMobile } from '@/hooks/use-mobile';

export function SideNav() {
  const location = useLocation();
  const { isMobile } = useMobile();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(!isMobile);

  // Close the sidebar on mobile when the route changes
  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    }
  }, [location.pathname, isMobile]);

  // Ensure sidebar is open on desktop
  useEffect(() => {
    if (!isMobile) {
      setIsOpen(true);
    }
  }, [isMobile]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile toggle button */}
      {isMobile && (
        <button
          className="fixed bottom-4 right-4 z-50 rounded-full bg-primary p-3 text-white shadow-lg"
          onClick={toggleSidebar}
        >
          <LayoutDashboard className="h-6 w-6" />
        </button>
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r bg-white transition-transform dark:bg-gray-950',
          isMobile && !isOpen && '-translate-x-full'
        )}
      >
        <div className="border-b p-4">
          <Logo className="h-8" />
          <h1 className="text-lg font-semibold">Grade Predictor</h1>
        </div>
        <ScrollArea className="flex-1">
          <nav className="flex flex-col gap-1 p-2">
            <Link to="/dashboard">
              <Button
                variant={location.pathname === '/dashboard' ? 'secondary' : 'ghost'}
                className="w-full justify-start gap-2"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>

            <Link to="/repositories">
              <Button
                variant={location.pathname === '/repositories' ? 'secondary' : 'ghost'}
                className="w-full justify-start gap-2"
              >
                <FolderGit2 className="h-4 w-4" />
                All Repositories
              </Button>
            </Link>

            <Link to="/repositories/add">
              <Button
                variant={location.pathname === '/repositories/add' ? 'secondary' : 'ghost'}
                className="w-full justify-start gap-2"
              >
                <PlusCircle className="h-4 w-4" />
                Add Repository
              </Button>
            </Link>

            <Link to="/groups/add">
              <Button
                variant={location.pathname === '/groups/add' ? 'secondary' : 'ghost'}
                className="w-full justify-start gap-2"
              >
                <Users className="h-4 w-4" />
                Add Group
              </Button>
            </Link>
            
            <Link to="/repositories/ranking">
              <Button
                variant={location.pathname === '/repositories/ranking' ? 'secondary' : 'ghost'}
                className="w-full justify-start gap-2"
              >
                <GitBranch className="h-4 w-4" />
                Repository Ranking
              </Button>
            </Link>

            <Link to="/settings">
              <Button
                variant={location.pathname === '/settings' ? 'secondary' : 'ghost'}
                className="w-full justify-start gap-2"
              >
                <Settings className="h-4 w-4" />
                Settings
              </Button>
            </Link>
          </nav>
        </ScrollArea>
        <div className="border-t p-2">
          <Link to="/password">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Lock className="h-4 w-4" />
              Password
            </Button>
          </Link>
          <Link to="/login?logout=true">
            <Button variant="ghost" className="w-full justify-start gap-2">
              Sign Out
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}
