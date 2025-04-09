
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "sonner";

// Pages
import LoginPage from "./pages/LoginPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import DashboardPage from "./pages/DashboardPage";
import RepositoryDetailsPage from "./pages/RepositoryDetailsPage";
import StudentMetricsPage from "./pages/StudentMetricsPage";
import AddRepositoryPage from "./pages/AddRepositoryPage";
import NotFound from "./pages/NotFound";
import VerificationPage from "./pages/VerificationPage";
import Index from "./pages/Index";
import PasswordPage from "./pages/PasswordPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";

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
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/index" element={<Navigate to="/" replace />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/verification" element={<VerificationPage />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
              <Route path="/repositories/add" element={<ProtectedRoute><AddRepositoryPage /></ProtectedRoute>} />
              <Route path="/repositories/:id" element={<ProtectedRoute><RepositoryDetailsPage /></ProtectedRoute>} />
              <Route path="/repositories/:id/student/:studentId" element={<ProtectedRoute><StudentMetricsPage /></ProtectedRoute>} />
              <Route path="/password" element={<ProtectedRoute><PasswordPage /></ProtectedRoute>} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster position="top-right" />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
