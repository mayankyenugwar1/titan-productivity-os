import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { AppLayout } from "@/components/layout/AppLayout";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";

import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Dashboard from "@/pages/Dashboard";
import MissionControlPage from "@/pages/MissionControlPage";
import Achievements from "@/pages/Achievements";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";

import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Lazy-load pages
const CommandCenter = lazy(() => import("@/pages/CommandCenter"));
const Analytics = lazy(() => import("@/pages/Analytics"));
const CalendarPage = lazy(() => import("@/pages/CalendarPage"));
const AICorePage = lazy(() => import("@/pages/AICorePage"));
const KnowledgePage = lazy(() => import("@/pages/KnowledgePage"));
const ProjectsPage = lazy(() => import("@/pages/ProjectsPage"));
const AutomationPage = lazy(() => import("@/pages/AutomationPage"));
const IntegrationsPage = lazy(() => import("@/pages/IntegrationsPage"));

export default function App() {
  return (
    <ErrorBoundary>
      <Routes>
        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AppLayout pageTitle="TITAN Overview">
                <Dashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/command-center"
          element={
            <ProtectedRoute>
              <AppLayout pageTitle="Command Center">
                <Suspense fallback={<div className="p-8 text-center text-zinc-500 font-mono text-xs">LOADING COMMAND CENTER...</div>}>
                  <CommandCenter />
                </Suspense>
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/habits"
          element={
            <ProtectedRoute>
              <AppLayout pageTitle="Mission Control">
                <MissionControlPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/calendar"
          element={
            <ProtectedRoute>
              <AppLayout pageTitle="Time OS">
                <Suspense fallback={<div className="p-8 text-center text-zinc-500 font-mono text-xs">LOADING TIME OS...</div>}>
                  <CalendarPage />
                </Suspense>
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/ai-core"
          element={
            <ProtectedRoute>
              <AppLayout pageTitle="AI OS Core">
                <Suspense fallback={<div className="p-8 text-center text-zinc-500 font-mono text-xs">LOADING AI OS CORE...</div>}>
                  <AICorePage />
                </Suspense>
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/knowledge"
          element={
            <ProtectedRoute>
              <AppLayout pageTitle="Knowledge OS">
                <Suspense fallback={<div className="p-8 text-center text-zinc-500 font-mono text-xs">LOADING KNOWLEDGE OS...</div>}>
                  <KnowledgePage />
                </Suspense>
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <AppLayout pageTitle="Projects & Goals">
                <Suspense fallback={<div className="p-8 text-center text-zinc-500 font-mono text-xs">LOADING PROJECTS & GOALS...</div>}>
                  <ProjectsPage />
                </Suspense>
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/automation"
          element={
            <ProtectedRoute>
              <AppLayout pageTitle="Automation OS">
                <Suspense fallback={<div className="p-8 text-center text-zinc-500 font-mono text-xs">LOADING AUTOMATION OS...</div>}>
                  <AutomationPage />
                </Suspense>
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/integrations"
          element={
            <ProtectedRoute>
              <AppLayout pageTitle="Integrations Hub">
                <Suspense fallback={<div className="p-8 text-center text-zinc-500 font-mono text-xs">LOADING INTEGRATIONS HUB...</div>}>
                  <IntegrationsPage />
                </Suspense>
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/achievements"
          element={
            <ProtectedRoute>
              <AppLayout pageTitle="Achievements">
                <Achievements />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <AppLayout pageTitle="Analytics">
                <Suspense fallback={<div className="p-8 text-center text-zinc-500 font-mono text-xs">LOADING INTELLIGENCE ANALYTICS...</div>}>
                  <Analytics />
                </Suspense>
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <AppLayout pageTitle="Operator">
                <Profile />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <AppLayout pageTitle="System Control">
                <Settings />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ErrorBoundary>
  );
}
