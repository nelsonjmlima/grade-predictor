
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom'
import './App.css'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as SonnerToaster } from "sonner";

import DashboardPage from './pages/DashboardPage'
import RepositoriesPage from './pages/RepositoriesPage'
import RepositoryDetailsPage from './pages/RepositoryDetailsPage'
import AddRepositoryPage from './pages/AddRepositoryPage'
import NotFound from './pages/NotFound'
import LoginPage from './pages/LoginPage'
import PasswordPage from './pages/PasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import VerificationPage from './pages/VerificationPage'
import SettingsPage from './pages/SettingsPage'
import RepositoryComparisonPage from './pages/RepositoryComparisonPage'
import RepositoryRankingPage from './pages/RepositoryRankingPage'
import AddGroupPage from './pages/AddGroupPage'
import GroupDetailsPage from './pages/GroupDetailsPage'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from '@/components/ui/theme-provider'

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/password" element={<PasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/verification" element={<VerificationPage />} />
            
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/repositories"
              element={
                <ProtectedRoute>
                  <RepositoriesPage />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/repositories/:id"
              element={
                <ProtectedRoute>
                  <RepositoryDetailsPage />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/repositories/add"
              element={
                <ProtectedRoute>
                  <AddRepositoryPage />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/repositories/compare"
              element={
                <ProtectedRoute>
                  <RepositoryComparisonPage />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/repositories/ranking"
              element={
                <ProtectedRoute>
                  <RepositoryRankingPage />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/groups/add"
              element={
                <ProtectedRoute>
                  <AddGroupPage />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/groups/:groupId"
              element={
                <ProtectedRoute>
                  <GroupDetailsPage />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
        <SonnerToaster position="top-right" expand={true} closeButton richColors />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
