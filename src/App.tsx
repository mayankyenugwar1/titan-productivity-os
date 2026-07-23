import { Routes, Route, Navigate } from "react-router-dom";

import { AppLayout } from "@/components/layout/AppLayout";

import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Dashboard from "@/pages/Dashboard";
import Habits from "@/pages/Habits";

import ProtectedRoute from "@/components/auth/ProtectedRoute";

function Achievements() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-white">Achievements</h1>
      <p className="text-zinc-400">Achievements page coming soon.</p>
    </div>
  );
}

function Profile() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-white">Profile</h1>
      <p className="text-zinc-400">Profile page coming soon.</p>
    </div>
  );
}

function Settings() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-white">Settings</h1>
      <p className="text-zinc-400">Settings page coming soon.</p>
    </div>
  );
}

export default function App() {
  return (
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
            <AppLayout pageTitle="Mission Control">
              <Dashboard />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/habits"
        element={
          <ProtectedRoute>
            <AppLayout pageTitle="Habits">
              <Habits />
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
        path="/profile"
        element={
          <ProtectedRoute>
            <AppLayout pageTitle="Profile">
              <Profile />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <AppLayout pageTitle="Settings">
              <Settings />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}