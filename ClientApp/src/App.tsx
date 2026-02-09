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
const ChartShowcase = lazy(() => import("./pages/ChartShowcase"));

// Lazy load Runner modules
const DynamicFormDataPage = lazy(() => import("./modules/dynamicform/pages/DynamicFormDataPage"));
const TrackerRunnerList = lazy(() => import("./modules/trackerrunner/pages/TrackerRunnerList"));
const TrackerRunnerView = lazy(() => import("./modules/trackerrunner/pages/TrackerRunnerView"));
const ReportRunnerList = lazy(() => import("./modules/reportrunner/pages/ReportRunnerList"));
const ReportRunnerView = lazy(() => import("./modules/reportrunner/pages/ReportRunnerView"));
const InvestigateRunnerList = lazy(() => import("./modules/investigaterunner/pages/InvestigateRunnerList"));
const InvestigateRunnerView = lazy(() => import("./modules/investigaterunner/pages/InvestigateRunnerView"));

const queryClient = new QueryClient();

// Loading component with MUI styling
const LoadingFallback = () => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--background, #020617)',
    gap: '1.5rem',
  }}>
    <div style={{
      width: 60,
      height: 60,
      border: '4px solid rgba(139, 92, 246, 0.2)',
      borderTop: '4px solid #8b5cf6',
      borderRadius: '50%',
      animation: 'spin 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite',
    }} />
    <div style={{
      fontSize: '1.1rem',
      fontWeight: 600,
      color: '#8b5cf6',
      letterSpacing: '0.05em',
      animation: 'pulse 1.5s ease-in-out infinite',
    }}>
      Loading...
    </div>
    <style>{`
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      @keyframes pulse {
        0%, 100% { opacity: 0.6; }
        50% { opacity: 1; }
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
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
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

                {/* Dynamic Form */}
                <Route path="/processed-data" element={<DynamicFormDataPage />} />

                  {/* Tracker Runner */}
                  <Route path="/trackerrunner" element={<TrackerRunnerList />} />
                  <Route path="/trackerrunner/:id" element={<TrackerRunnerView />} />

                  {/* Report Runner */}
                  <Route path="/reportrunner" element={<ReportRunnerList />} />
                  <Route path="/reportrunner/:id" element={<ReportRunnerView />} />

                  {/* Investigate Runner */}
                  <Route path="/investigate-runner" element={<InvestigateRunnerList />} />
                  <Route path="/investigate-runner/:id" element={<InvestigateRunnerView />} />

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
