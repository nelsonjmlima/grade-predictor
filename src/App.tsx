
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";

// Pages
import LoginPage from "./pages/LoginPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import DashboardPage from "./pages/DashboardPage";
import RepositoriesPage from "./pages/RepositoriesPage";
import RepositoryDetailsPage from "./pages/RepositoryDetailsPage";
import StudentMetricsPage from "./pages/StudentMetricsPage";
import StudentGitlabMetricsPage from "./pages/StudentGitlabMetricsPage";
import AddRepositoryPage from "./pages/AddRepositoryPage";
import RepositoryComparisonPage from "./pages/RepositoryComparisonPage";
import RepositoryRankingPage from "./pages/RepositoryRankingPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";
import VerificationPage from "./pages/VerificationPage";
import Index from "./pages/Index";
import LogoPage from "./pages/LogoPage";

const queryClient = new QueryClient();

const App = () => {
  // Add animation reveal on scroll
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
        }
      });
    }, { threshold: 0.1 });

    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach(element => observer.observe(element));

    return () => {
      elements.forEach(element => observer.unobserve(element));
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner position="top-right" theme="light" closeButton />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/index" element={<Index />} />
            <Route path="/logo" element={<LogoPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/verification" element={<VerificationPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/repositories" element={<RepositoriesPage />} />
            <Route path="/repositories/add" element={<AddRepositoryPage />} />
            <Route path="/repositories/compare" element={<RepositoryComparisonPage />} />
            <Route path="/repositories/ranking" element={<RepositoryRankingPage />} />
            <Route path="/repositories/:id" element={<RepositoryDetailsPage />} />
            <Route path="/repositories/:id/student/:studentId" element={<StudentMetricsPage />} />
            <Route path="/repositories/:id/student/:studentId/gitlab" element={<StudentGitlabMetricsPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
