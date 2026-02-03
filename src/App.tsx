import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/theme/ThemeProvider";
import Login from "./modules/auth/login/Login";
import ProfilePage from "./pages/ProfilePage";
import ResetPassword from './pages/ResetPassword';
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import OAuthCallback from "./pages/OAuthCallback";
import OAuthComplete from "./pages/OAuthComplete";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminLayout from "./components/layout/AdminLayout";

// Lazy load Dashboard components
const DashboardList = lazy(() => import("./modules/dashboard/list/DashboardList"));
const DashboardBuilder = lazy(() => import("./modules/dashboard/editor/DashboardEditor"));
const DashboardViewer = lazy(() => import("./modules/dashboard/viewer/DashboardViewer"));
const DashboardHome = lazy(() => import("./pages/DashboardHome"));
const DynamicFormList = lazy(() => import("./modules/dynamicform/DynamicFormList"));
const DynamicFormViewer = lazy(() => import("./modules/dynamicform/DynamicFormViewer"));
const ChartShowcase = lazy(() => import("./pages/ChartShowcase"));

const queryClient = new QueryClient();

// Loading component with MUI styling
const LoadingFallback = () => (
  <div style={{
    display: 'flex',
    height: '100vh',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--background, #020617)',
  }}>
    <div style={{
      width: 40,
      height: 40,
      border: '3px solid rgba(139, 92, 246, 0.2)',
      borderTop: '3px solid #8b5cf6',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    }} />
    <style>{`
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

const App = () => (
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              {/* Protected Routes with Admin Layout */}
              <Route element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                {/* Main Dashboard */}
                <Route path="/home" element={<DashboardHome />} />

                {/* Dashboard Builder Routes */}
                <Route path="/dashboards" element={<DashboardList />} />
                <Route path="/dashboards/new" element={<DashboardBuilder />} />
                <Route path="/dashboards/:id" element={<DashboardViewer />} />
                <Route path="/dashboards/edit/:id" element={<DashboardBuilder />} />

                {/* Dynamic Forms */}
                <Route path="/dynamic-forms" element={<DynamicFormList />} />
                <Route path="/dynamic-forms/:id" element={<DynamicFormViewer />} />

                {/* Chart Library Showcase */}
                <Route path="/charts" element={<ChartShowcase />} />

                {/* User Management */}
                <Route path="/profile" element={<ProfilePage />} />
              </Route>

              {/* Auth Redirects */}
              <Route path="/" element={<Navigate to='/login' replace />} />
              <Route path="/auth/callback" element={<OAuthCallback />} />
              <Route path="/oauth-complete" element={<OAuthComplete />} />

              {/* Legal */}
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />

              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
